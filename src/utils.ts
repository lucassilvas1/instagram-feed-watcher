export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function sleep(maxMs: number, minMs?: number): Promise<void> {
  return new Promise((res) => setTimeout(res, random(minMs ?? maxMs, maxMs)));
}

function escapeRegExp(text: string) {
  return Array.from(text)
    .map((char) => `\\u{${char.charCodeAt(0).toString(16)}}`)
    .join("");
}

export function findBetween(text: string, prefix: string, suffix: string) {
  const exp = new RegExp(
    `${escapeRegExp(prefix)}(.*?)${escapeRegExp(suffix)}`,
    "u"
  );
  return text.match(exp)?.[1];
}
