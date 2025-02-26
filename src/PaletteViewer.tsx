import { useMemo, useState } from "react";
import Swatch from "./Swatch";
import { makePalette, MakePaletteParams } from "./palette";
import OKLCHPicker from "./OKLCHPicker";

interface PaletteViewerProps extends MakePaletteParams {
  onChange: (p: MakePaletteParams) => void;
  onDelete: () => void;
}

type EditingState = "min"|"mid"|"max"|null;

function PaletteViewer({ onChange, onDelete, ...params } : PaletteViewerProps) {
  const palette = useMemo(() => {
    return makePalette(params);
  }, [params]);

  const sortedSteps = params.steps.slice().sort((a, b) => a - b);

  const [ editing, setEditing ] = useState<EditingState>(null);

  function toggleEditing(state: EditingState) {
    if (state === editing) {
      setEditing(null);
    } else {
      setEditing(state);
    }
  }
  
  return (
    <div
      className="flex gap-0 group/palette"
    >
      {
        Object.entries(palette).map(([step, color]) => {
          if (parseInt(step) === sortedSteps[0]) {
            return <Swatch
              name={step}
              color={color}
              key={step}
              onClick={() => toggleEditing("min")}
              editable
            >
              <OKLCHPicker 
                value={params.min}
                onChange={e => onChange({...params, min: e})}
                visible={editing === "min"}
              />
            </Swatch>
          }
          if (parseInt(step) === sortedSteps[sortedSteps.length - 1]) {
            return <Swatch
              name={step}
              color={color}
              key={step}
              onClick={() => toggleEditing("max")}
              editable
            >
              <OKLCHPicker 
                value={params.max}
                onChange={e => onChange({...params, max: e})}
                visible={editing === "max"}
              />
            </Swatch>
          }
          if (parseInt(step) === params.midpointStep) {
            return <Swatch
              name={step}
              color={color}
              key={step}
              onClick={() => toggleEditing("mid")}
              editable
            >
              <OKLCHPicker 
                value={params.mid}
                onChange={e => onChange({...params, mid: e})}
                visible={editing === "mid"}
              />
            </Swatch>
          }

          return (
            <Swatch 
              name={step}
              color={color}
              key={step}
            />
          )
        })
      }
      <button title="Delete palette" onClick={() => onDelete()}>X</button>
    </div>
  )
}

export default PaletteViewer

