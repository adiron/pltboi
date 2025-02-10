import { convert, deserialize, listColorSpaces, OKLCH, RGBToHex, sRGB, Vector, sRGBGamut, gamutMapOKLCH, MapToL  } from "@texel/color";
import { ChangeEvent, useEffect, useState } from "react";

interface OKLCHPickerProps { 
  value: Vector;
  onChange: (v: Vector) => void;
  visible?: boolean;
}

export default function OKLCHPicker({value, onChange, visible} : OKLCHPickerProps) {
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

  if (!visible) {
    return <></>;
  }

  return <div className="border-1 p-2 absolute bg-gray-100 top-30 z-1">
    <div className="flex gap-2 items-center text-gray-600">
      <div className="w-25">
        Lightness
      </div>
      <input 
        className="h-2 w-40"
        type="range"
        min="0" 
        max="1"
        value={value[0]}
        step={1 / 100}
        onChange={(e) => handleChange([parseFloat(e.target.value), value[1], value[2]])}
      />
      {value[0].toFixed(2)}
    </div>
    <div className="flex gap-2 items-center text-gray-600">
      <div className="w-25">
        Chroma
      </div>
      <div className="w-10">
        <input 
          className="h-2 w-40"
          type="range"
          min="0" 
          max="0.5"
          value={value[1]}
          step={1 / 500}
          onChange={(e) => handleChange([value[0], parseFloat(e.target.value), value[2]])}
        />
        {value[1].toFixed(2)}
      </div>
    </div>
    <div className="flex gap-2 items-center text-gray-600">
      <div className="w-25">
        Hue
      </div>
      <input 
        className="h-2 w-40"
        type="range"
        min="0" 
        max="360"
        value={value[2]}
        step={1 / 10}
        onChange={(e) => handleChange([value[0], value[1], parseFloat(e.target.value)])}
      />
      {value[2].toFixed(0)}°
    </div>
    <div className="flex gap-2 items-center text-gray-600">
      <div className="w-25">
        Hex equiv.
      </div>
      <input
        className="bg-white border-1 p-1 font-mono"
        value={serialized}
        onChange={handleSerialize}
      />
    </div>
  </div>
}
