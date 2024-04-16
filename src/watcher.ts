import axios, { AxiosRequestConfig } from "axios";
import { Post, NodeContainer } from "./types";
import { COOKIE_FILE_PATH, USER_AGENT } from "./constants";
import { cookiesToStr, getCookieStr, saveCookies } from "./session/utils";
import {
  LoginError,
  MaxRetriesReachedError,
  UnexpectedStatusError,
} from "./errors";
import puppeteer from "puppeteer";
import { random, sleep } from "./utils";

type Listener = (posts: Post[]) => void;
/**
 * Intervals are used to randomize waiting and cooldowns
 */
type Interval = [number, number];

type WatcherOptions = {
  userAgent: string;
  /**
   * Where to store session cookies
   * @default "../resources/cookies.txt"
   */
  cookieFilePath: string;
  /**
   * How long to wait before refreshing the feed again in milliseconds.
   * Values under 60_000 milliseconds are not recommneded.
   * @default [54_582, 71_845]
   */
  pollingInterval: Interval;
  /**
   * How many times to try refreshing the feed before crashing
   * @default 3
   */
  maxRetries: number;
  /**
   * How long to wait before trying to refresh the feed again in milliseconds.
   * @default [7352, 13_791]
   */
  retryCooldown: Interval;
};

function getNodeContainers(html: string) {
  const lines = html.split("\n"); // the HTML returned by Instagram is split in lines
  const line = lines.find((line) =>
    // "RelayPrefetchedStreamCache" is unique to the script tag that contains
    // the posts. Look for it first to avoid using RegEx unnecessarily.
    line.slice(45, 200).includes("RelayPrefetchedStreamCache")
  );
  if (!line) return null;
  // The "node" array is between `"edges":` and `,"page_info"` in that line
  return JSON.parse(
    line.match(/"edges":(.*?),"page_info"/)?.[1] ?? "null"
  ) as NodeContainer[];
}

export class Watcher {
  static #defaultOptions: WatcherOptions = {
    userAgent: USER_AGENT,
    cookieFilePath: COOKIE_FILE_PATH,
    pollingInterval: [54_582, 71_845],
    maxRetries: 3,
    retryCooldown: [7352, 13_791],
  };
  #initializing = false;
  #initialized = false;
  #options: WatcherOptions;
  #requestConfig: AxiosRequestConfig = {};
  #listeners: Map<Symbol, (containers: Post[]) => void> = new Map();
  #watchIntervalId?: NodeJS.Timeout;
  #username: string;
  #password: string;

  constructor(
    username: string,
    password: string,
    options: Partial<WatcherOptions> = {}
  ) {
    this.#username = username;
    this.#password = password;
    this.#options = { ...Watcher.#defaultOptions, ...options };
  }

  get defaults() {
    return { ...Watcher.#defaultOptions };
  }

  async #initialize(force = false) {
    if (this.#initializing) return;
    if (!force && this.#initialized) return;

    this.#initializing = true;

    let cookies = getCookieStr(this.#options.cookieFilePath);
    if (!cookies) {
      cookies = await this.#login();
      // If cookies are still `null` after logging in then something went wrong
      // durign login
      if (!cookies) throw new LoginError();
    }

    this.#setRequestConfig(cookies);

    this.#initializing = false;
    this.#initialized = true;
  }

  #setRequestConfig(cookies: string) {
    this.#requestConfig = {
      url: "https://www.instagram.com/?variant=following",
      headers: {
        "User-Agent": this.#options.userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Alt-Used": "www.instagram.com",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        Cookie: cookies,
      },
    };
  }

  async #login() {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setUserAgent(this.#options.userAgent);
    await page.goto("https://www.instagram.com");

    const usernameSelector = "input[name='username']";
    const passwordSelector = "input[name='password']";
    await page.waitForSelector(usernameSelector);
    await page.waitForSelector(passwordSelector);
    await page.type(usernameSelector, this.#username, { delay: 137 });
    await page.type(passwordSelector, this.#password, { delay: 154 });
    await Promise.all([
      page.waitForNavigation(),
      page.click("button[type='submit']", { delay: 670 }),
    ]);

    const cookies = await page.cookies().then(cookiesToStr);
    saveCookies(this.#options.cookieFilePath, cookies);

    await browser.close();

    return cookies;
  }

  async #fetchFeedPage(tries = 1): Promise<string> {
    if (tries > this.#options.maxRetries) throw new MaxRetriesReachedError();

    await this.#initialize();

    try {
      const res = await axios(this.#requestConfig);

      if (res.status !== 200) throw new UnexpectedStatusError(res.status);

      return res.data;
    } catch (error) {
      // "ERR_FR_TOO_MANY_REDIRECTS" most likely means your session has expired
      if (error.code === "ERR_FR_TOO_MANY_REDIRECTS") {
        await this.#initialize(true);
        await sleep(...this.#options.retryCooldown);

        return this.#fetchFeedPage(tries + 1);
      }
      throw error;
    }
  }

  /**
   * @returns First 4 posts in the Following feed
   */
  async get() {
    let html;
    try {
      html = await this.#fetchFeedPage();
    } catch (error) {
      // Halt everything if fetching feed page went wrong
      this.#destroyWatcher();
      throw error;
    }

    const containers = getNodeContainers(html);

    if (!containers) {
      throw new Error("Could not extract NodeContainers from HTML response.");
    }

    return containers.map((container) => container.node.media);
  }

  #watch() {
    this.#destroyWatcher();

    const refresh = async () => {
      const posts = await this.get();

      this.#listeners.forEach((listen) => listen(posts));
    };

    refresh();
    this.#watchIntervalId = setInterval(
      refresh,
      random(...this.#options.pollingInterval)
    );
  }

  #destroyWatcher() {
    clearInterval(this.#watchIntervalId);
  }

  /**
   * Calls `listener` for every new post found
   * @param listener Function that will be called when a new post is found
   * @returns A function to remove the `listener`
   */
  watch(listener: Listener) {
    const symbol = Symbol();
    // Keep track of IDs of media that have been watched
    const watched: Map<string, any> = new Map();
    // IDs of the posts that were visible last refresh
    let latest: string[] = [];

    // Get rid of old watched media IDs every once in a while.
    // If media ID is not in `latest`, then it's been buried by newer posts
    // and is no longer relevant.
    const intervalId = setInterval(() => {
      watched.forEach((_, id) => !latest.includes(id) && watched.delete(id));
    }, 60_000_000);

    const onChange = async (posts: Post[]) => {
      latest = [];

      listener(
        posts.filter((post) => {
          latest.push(post.id);
          if (watched.has(post.id)) return false;
          watched.set(post.id, 0);
          return true;
        })
      );
    };

    this.#listeners.set(symbol, onChange);

    // If this is the first listener then the feed is not currently refreshing
    if (this.#listeners.size === 1) this.#watch();

    return () => {
      clearInterval(intervalId);
      this.#listeners.delete(symbol);
      // Stop refreshing feed if there are no watchers left
      if (!this.#listeners.size) this.#destroyWatcher();
    };
  }

  /**
   * Remove all watchers and stop refreshing feed
   */
  destroy() {
    this.#destroyWatcher();
    this.#listeners.clear();
  }
}
