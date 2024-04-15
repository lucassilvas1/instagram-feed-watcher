import fs from "fs";
import path from "path";
import { Cookie } from "puppeteer";

export function getCookieStr(cookieFilePath: string) {
  try {
    return fs.readFileSync(cookieFilePath, { encoding: "utf-8" });
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export function cookiesToStr(cookies: Cookie[]) {
  return cookies.map((cookie) => cookie.name + "=" + cookie.value).join("; ");
}

export function saveCookies(cookieFilePath: string, cookies: string) {
  try {
    fs.writeFileSync(cookieFilePath, cookies, { encoding: "utf-8" });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    fs.mkdirSync(path.dirname(cookieFilePath), { recursive: true });
    saveCookies(cookieFilePath, cookies);
  }
}
