import { useEffect, useState } from 'react';
import PaletteViewer from './PaletteViewer';
import { MakePaletteParams } from './palette';
import Jumpy from './Jumpy';
import { loadPaletteListOrFallback, makeRandomPalette } from './utils';

export type PalettesList = [string, MakePaletteParams][];

function App() {
  const [ palettes, setPalettes ] = useState<PalettesList>(() => loadPaletteListOrFallback());

  useEffect(() => {
    localStorage.setItem("palettes", JSON.stringify(palettes));
  }, [palettes]);

  function handlePaletteChange(newP : MakePaletteParams, targetUuid: string) {
    setPalettes(
      palettes.map((p) => p[0] === targetUuid ? [p[0], newP] : p)
    );
  }

  function handleAddPalette() {
    setPalettes([
      ...palettes,
      [crypto.randomUUID(), makeRandomPalette()]
    ]);
  }

  function handleDelete(targetUuid: string) {
    setPalettes(palettes.filter(([uuid, _p]) => targetUuid !== uuid));
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
      { palettes.map(([uuid, p]) => {
        return <PaletteViewer {...p} onChange={e => handlePaletteChange(e, uuid)} onDelete={() => handleDelete(uuid)} key={uuid} />
      }) }
      <button 
        className="cursor-pointer h-15 w-15 rounded bg-gray-200 hover:bg-(image:--rainbow) bg-[length:500%_100%] b hover:animate-bgscroll border-gray-300 hover:border-gray-500 transition-all border"
        onClick={() => handleAddPalette()}
      >
        +
      </button>
      </div>
      <div className="w-full text-center text-md">
        <a target="_blank" href={`https://github.com/adiron/pltboi/tree/${__COMMIT_HASH__}`}>
          <Jumpy text={`version ${__COMMIT_HASH__}`}></Jumpy>
        </a>
        <a target="_blank" href="https://adiron.me">
          <Jumpy text="ADI RON me fecit" />
        </a>
      </div>
    </div>
  )
}

export default App
