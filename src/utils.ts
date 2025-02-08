export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function mapRange(value: number, low1: number, high1: number, low2: number, high2: number) {
  return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classOptional(o: Record<string, any>): string {
  return Object.entries(o).filter(([_k, v]) => v).map(([k, _]) => k).join(" ");
}
