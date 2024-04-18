import fs from "fs";
import path from "path";
import { findBetween } from "../utils";
import { InfoNotFoundError } from "../errors";

export type Cookie = { name: string; value: string };

export function getSavedCookies(cookieFilePath: string) {
  try {
    return JSON.parse(
      fs.readFileSync(cookieFilePath, { encoding: "utf-8" })
    ) as Cookie[];
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export function cookiesToStr(cookies: Cookie[]) {
  return cookies.map((cookie) => cookie.name + "=" + cookie.value).join("; ");
}

export function saveCookies(cookieFilePath: string, cookies: Cookie[]) {
  try {
    fs.writeFileSync(cookieFilePath, JSON.stringify(cookies), {
      encoding: "utf-8",
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    fs.mkdirSync(path.dirname(cookieFilePath), { recursive: true });
    saveCookies(cookieFilePath, cookies);
  }
}

export function getCsrfToken(body: string[]) {
  // CSRF token should be located at the 31st line of the body
  const line = body.at(30);
  if (!line) throw new InfoNotFoundError("CSRF token", body.join("\n"));
  const token = findBetween(line, `"csrf_token":"`, `"`);
  if (!token) throw new InfoNotFoundError("CSRF token", body.join("\n"));
  return token;
}
