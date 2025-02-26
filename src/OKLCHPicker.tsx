import { convert, deserialize, listColorSpaces, OKLCH, RGBToHex, sRGB, Vector, sRGBGamut, gamutMapOKLCH, MapToL  } from "@texel/color";
import { ChangeEvent, useEffect, useState } from "react";
import { SwatchRole } from "./PaletteViewer";
import { classOptional } from "./utils";

interface OKLCHPickerProps { 
  value: Vector;
  onChange: (v: Vector) => void;
  visible?: boolean;
  onHueLockChange?: (e: boolean) => void;
  hueLock: boolean;
  role: SwatchRole;
}

export default function OKLCHPicker({value, onChange, visible, role, hueLock, onHueLockChange} : OKLCHPickerProps) {
  const [ serialized, setSerialized ] = useState<string>("")

  useEffect(() => {
    const colorInRGB = convert(value, OKLCH, sRGB);
    const newSerialized = RGBToHex(colorInRGB);

    try {
      const currentlyDeserialized = deserialize(serialized);
      const spaceDeserialized = listColorSpaces().find(f => f.id === currentlyDeserialized.id);
      const reserializationResult = RGBToHex(convert(currentlyDeserialized.coords, spaceDeserialized!, sRGB));
      if (newSerialized !== reserializationResult) {
        setSerialized(newSerialized);
      }
    } catch {
      setSerialized(newSerialized);
    }
  }, [value, serialized]);

  function handleSerialize(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setSerialized(v);
    const result = deserialize(v);
    onChange(
      convert(result.coords, sRGB, OKLCH)
    );
  }

  function handleChange(v: Vector) {
    const mapped = gamutMapOKLCH(v, sRGBGamut, OKLCH, undefined, MapToL);
    onChange(mapped);
  }
  return <div className={classOptional({
    "shadow-xl absolute top-17 z-1 text-sm text-left flex items-center flex-col cursor-auto": true,
    "hidden": !visible,
    "-translate-x-1/2 left-[50%]": role === "mid",
    "right-0 items-end": role === "max",
    "left-0 items-start": role === "min",
  })}>
    { /* Arrow */ }
    <div className="w-3 overflow-hidden rotate-90 -m-1 mx-6">
      <div
        className="h-4 bg-white rotate-45 transform origin-bottom-right rounded-sm"
      />
    </div>
    <div className="bg-white rounded-lg grid auto-rows-[30px] gap-2 p-4 ">
      { /* Lightness */ }
      <div className="grid grid-cols-(--picker-control-grid) gap-2 items-center text-gray-600">
        <div className="">
          Lightness
        </div>
        <input 
          className="h-2"
          type="range"
          min="0" 
          max="1"
          value={value[0]}
          step={1 / 100}
          onChange={(e) => handleChange([parseFloat(e.target.value), value[1], value[2]])}
        />
        <div className="text-right">
          {value[0].toFixed(2)}
        </div>
      </div>

      { /* Chroma */ }
      <div className="grid grid-cols-(--picker-control-grid) gap-2 items-center text-gray-600">
        <div className="">
          Chroma
        </div>
        <input 
          className="h-2"
          type="range"
          min="0" 
          max="0.5"
          value={value[1]}
          step={1 / 500}
          onChange={(e) => handleChange([value[0], parseFloat(e.target.value), value[2]])}
        />
        <div className="text-right">
          {value[1].toFixed(2)}
        </div>
      </div>

      { /* Hue */ }
      <div className="grid grid-cols-(--picker-control-grid) gap-2 items-center text-gray-600">
        <div className="">
          Hue
        </div>
        <input 
          className="h-2"
          type="range"
          min="0" 
          max="360"
          value={value[2]}
          step={1 / 100}
          onChange={(e) => handleChange([value[0], value[1], parseFloat(e.target.value)])}
        />
        <div className="text-right">
          {value[2].toFixed(0)}°
        </div>
      </div>
      <div className="grid grid-cols-(--picker-control-grid) gap-2 items-center text-gray-600">
        <div className="">
          Hex equiv.
        </div>
        <input
          className="bg-white border-1 border-gray-300 p-1 font-mono"
          value={serialized}
          onChange={handleSerialize}
        />
      </div>
    </div>
  </div>
}
