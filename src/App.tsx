import { useState } from 'react';
import PaletteViewer from './PaletteViewer';
import { MakePaletteParams } from './palette';
import Jumpy from './Jumpy';

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

  function handleDelete(i: number) {
    setPalettes(palettes.filter((_, j) => i !== j));
  }

  return (
    <div className="p-8 grid grid-rows-(--app-grid) min-h-screen">
      <div className="w-full text-center pb-16 tracking-tight">
        <Jumpy
          text="pltboi"
          className="text-4xl bold"
        />
      </div>
      <div
        className="flex flex-col gap-8 text-center items-center"
      >
      { palettes.map((p, i) => {
        return <PaletteViewer {...p} onChange={e => handlePaletteChange(e, i)} onDelete={() => handleDelete(i)} key={`${i},${p.mid[2]}`} />
      }) }
      <button 
        className="cursor-pointer h-15 w-15 rounded bg-gray-200 hover:bg-(image:--rainbow) bg-[length:500%_100%] b hover:animate-bgscroll border-gray-300 hover:border-gray-500 transition-all border"
        onClick={() => handleAddPalette()}
      >
        +
      </button>
      </div>
      <div className="w-full text-center">
        <Jumpy className="text-md" text={`version ${__COMMIT_HASH__}`}></Jumpy>
        <a target="_blank" href="https://adiron.me">
          <Jumpy text="ADI RON me fecit" className="hover:text-blue-500" />
        </a>
      </div>
    </div>
  )
}

export default App
