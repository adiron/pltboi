import { gamutMapOKLCH, lerp, lerpAngle, MapToL, OKLCH, serialize, sRGB, sRGBGamut, Vector } from "@texel/color"
import { mapRange } from "./utils";

export interface MakePaletteParams {
  min: Vector,
  mid: Vector,
  max: Vector,
  steps: number[],
  midpointStep: number,
}

type Palette = Record<number, string>;

export function makePalette({
  min, mid, max, steps, midpointStep
} : MakePaletteParams) : Palette {
  if (!steps.includes(midpointStep)) {
    throw new Error("Midpoint not in steps");
  }

  if (steps.length < 3) {
    throw new Error("Not enough steps");
  }

  steps.sort((a, b) => a - b);

  if (steps[0] === midpointStep || steps[steps.length - 1] === midpointStep) {
    throw new Error("Invalid midpoint step");
  }

  // Map all of the colors
  min = gamutMapOKLCH(min, sRGBGamut, OKLCH, undefined, MapToL);
  mid = gamutMapOKLCH(mid, sRGBGamut, OKLCH, undefined, MapToL);
  max = gamutMapOKLCH(max, sRGBGamut, OKLCH, undefined, MapToL);

  return Object.fromEntries(steps.map((step, stepIndex) => {
    if (stepIndex === 0) {
      // Return min-point as-is
      return [step, serialize(min, OKLCH, sRGB)]
    }
    if (stepIndex === steps.length - 1) {
      return [step, serialize(max, OKLCH, sRGB)]
    }
    if (step === midpointStep) {
      return [step, serialize(mid, OKLCH, sRGB)]
    }

    // Interpolation time.

    if (step < midpointStep) {
      const myRangePosition = mapRange(step, steps[0], midpointStep, 0, 1);
      return [step, serialize([
        lerp(min[0], mid[0], myRangePosition),
        lerp(min[1], mid[1], myRangePosition),
        lerpAngle(min[2], mid[2], myRangePosition),
      ], OKLCH, sRGB)];
    }

    const myRangePosition = mapRange(step, midpointStep, steps[steps.length - 1], 0, 1);
    return [step, serialize([
      lerp(mid[0], max[0], myRangePosition),
      lerp(mid[1], max[1], myRangePosition),
      lerpAngle(mid[2], max[2], myRangePosition),
    ], OKLCH, sRGB)];
  }))
}
