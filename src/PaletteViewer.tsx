import { useCallback, useMemo, useState } from "react";
import Swatch from "./Swatch";
import { makePalette, MakePaletteParams } from "./palette";
import OKLCHPicker from "./OKLCHPicker";
import { classOptional } from "./utils";
import { Vector } from "@texel/color";
import { gamutMapOKLCH, sRGBGamut, OKLCH, MapToL } from "@texel/color";

interface PaletteViewerProps extends MakePaletteParams {
  onChange: (p: MakePaletteParams) => void;
  onDelete: () => void;
}

export type SwatchRole = "min"|"mid"|"max"|null;
export type NonNullSwatchRole = Exclude<SwatchRole, null>;

function PaletteViewer({ onChange, onDelete, ...params } : PaletteViewerProps) {
  const palette = useMemo(() => {
    return makePalette(params);
  }, [params]);

  const [ editing, setEditing ] = useState<SwatchRole>(null);
  const [ hueLock, setHueLock ] = useState<boolean>(true);

  function toggleEditing(state: SwatchRole) {
    if (state === editing) {
      setEditing(null);
    } else {
      setEditing(state);
    }
  }

  const handleColorChange = useCallback((role: NonNullSwatchRole, newColor: Vector) => {
    if (!hueLock) {
      return onChange({...params, [role]: newColor})
    }

    const newHue = newColor[2];
    return onChange({
      ...params,
      min: gamutMapOKLCH([ ...params.min.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
      mid: gamutMapOKLCH([ ...params.mid.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
      max: gamutMapOKLCH([ ...params.max.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
      [role]: newColor,
    });

  }, [hueLock, onChange, params]);

  const handleHueLockChange = useCallback((newState: boolean, role: NonNullSwatchRole) => {
    if (!newState) {
      return setHueLock(newState);
    }

    const newHue = params[role][2];
    setHueLock(newState);
    return onChange({
      ...params,
      min: gamutMapOKLCH([ ...params.min.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
      mid: gamutMapOKLCH([ ...params.mid.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
      max: gamutMapOKLCH([ ...params.max.slice(0,2), newHue ], sRGBGamut, OKLCH, undefined, MapToL),
    });
  }, [params, onChange])

  const getEditingStateForStep = useCallback<(step: number) => SwatchRole>((color) => {
    const sortedSteps = params.steps.slice().sort((a, b) => a - b);

    if (color === sortedSteps[0]) {
      return "min";
    }
    if (color === sortedSteps[sortedSteps.length - 1]) {
      return "max";
    }
    if (color === params.midpointStep) {
      return "mid";
    }
    return null;
  }, [params.midpointStep, params.steps]);
  
  return (
    <div
      className={classOptional({
        "flex gap-0 group/palette ml-19": true,
        "active": editing !== null,
      })}
    >
      {
        Object.entries(palette).map(([step, color]) => {
          const targetState = getEditingStateForStep(parseInt(step))

          return <Swatch
            name={step}
            color={color}
            key={step}
            onClick={targetState ? (() => toggleEditing(targetState)) : undefined}
            editable={targetState !== null}
            active={targetState !== null && targetState === editing}
          >
            { targetState !== null && <OKLCHPicker 
                value={params[targetState]}
                key={step}
                onChange={e => handleColorChange(targetState, e)}
                onHueLockChange={e => handleHueLockChange(e, targetState)}
                visible={editing === targetState}
                hueLock={hueLock}
                role={targetState}
              />
            }
          </Swatch>
        })
      }
      <button
        title="Delete palette"
        onClick={() => onDelete()}
        className="ml-4 opacity-30 hover:opacity-100 group-hover/palette:opacity-50 cursor-pointer h-15 w-15 rounded bg-transparent hover:bg-gray-300 b border-gray-300 hover:border-gray-500 transition-all border"
      >
        ×
      </button>
    </div>
  )
}

export default PaletteViewer

