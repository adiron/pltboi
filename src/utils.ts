import { PalettesList } from './App';
import { MakePaletteParams } from './palette';

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

export function makeRandomPalette(): MakePaletteParams {
  const hue = Math.random() * 360;
  return {
    min: [ 0.8382, 0.0493, hue ],
    mid: [ 0.5000, 0.30, hue ],
    max: [ 0.2665, 0.0499, hue ],
    steps: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    midpointStep: 50,
  }
}

function isPaletteList(arg: object): arg is PalettesList {
  /* Beware: this function is *naive*. I wrote it to test against localStorage,
     which presumably will only be populated by the app. This could in theory
     lead to bad objects being fed into the works. */
  if (!Array.isArray(arg)) {
    return false;
  }

  const childrenMatch = arg.every(x => {
    if (!Array.isArray(x)) {
      return false;
    }

    if (x.length !== 2) {
      return false;
    }

    if (typeof x[0] !== 'string') {
      return false;
    }

    if (typeof x[1] !== 'object') {
      return false;
    }

    const k = Object.keys(x[1]);
    if (
      !k.includes("min") ||
      !k.includes("mid") ||
      !k.includes("max") ||
      !k.includes("steps") ||
      !k.includes("midpointStep") 
     ) {
       return false;
     }

    return true;
  })

  if (!childrenMatch) {
    return false;
  }

  return true;
}

export function loadPaletteListOrFallback() : PalettesList {
  try {
    const obj = JSON.parse(localStorage.getItem("palettes") || "");
    console.log("Received object", obj);
    if (isPaletteList(obj)) {
      return obj;
    } else {
      console.log("Saved palette is not valid.")
    }
  } catch {
    console.log("Error reading stored colors.")
  }
  return [[crypto.randomUUID(), makeRandomPalette()]];
}

