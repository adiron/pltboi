import { useState } from 'react';
import PaletteViewer from './PaletteViewer';
import { MakePaletteParams } from './palette';

function makeRandomPalette(): MakePaletteParams {
  const hue = Math.random() * 360;
  return {
    min: [ 0.8382, 0.0493, hue ],
    mid: [ 0.5000, 0.30, hue ],
    max: [ 0.2665, 0.0499, hue ],
    steps: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    midpointStep: 50,
  }
}

function App() {

  const [ palettes, setPalettes ] = useState<MakePaletteParams[]>([makeRandomPalette()])

  function handlePaletteChange(p : MakePaletteParams, i: number) {
    setPalettes(palettes.map((d, j) => j === i ? p : d));
  }

  function handleAddPalette() {
    setPalettes([...palettes, makeRandomPalette()])
  }

  return (
    <>
      <div
      className="flex flex-col gap-4"
      >
      { palettes.map((p, i) => {
        return <PaletteViewer {...p} onChange={e => handlePaletteChange(e, i)} key={i} />
      })
      }
      <button onClick={() => handleAddPalette()}>
      +
        </button>
      </div>
      <div>v {__COMMIT_HASH__}</div>
    </>
  )
}

export default App
