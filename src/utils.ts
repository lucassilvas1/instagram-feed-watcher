export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function sleep(maxMs: number, minMs?: number): Promise<void> {
  return new Promise((res) => setTimeout(res, random(minMs ?? maxMs, maxMs)));
}
