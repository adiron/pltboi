import { useState } from 'react';
import PaletteViewer from './PaletteViewer';
import { MakePaletteParams } from './palette';

function App() {

  const [ paletteParams, setPaletteParams ] = useState<MakePaletteParams>({
    mid: [ 0.4848, 0.2259, 264.72 ],
    min: [ 0.8382, 0.0493, 264.72 ],
    max: [ 0.2665, 0.0499, 264.72 ],
    steps: [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    midpointStep: 50,
  })

  return (
    <div
      className="flex flex-col gap-4"
    >
      <PaletteViewer {...paletteParams} onChange={e => setPaletteParams(e)} />
    </div>
  )
}

export default App
