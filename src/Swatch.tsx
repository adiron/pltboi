import { deserialize, listColorSpaces, convert, OKLCH } from "@texel/color";
import { classOptional } from "./utils";
import { useMemo } from "react";

const LIGHTNESS_BREAKPOINT = 0.57;

interface SwatchProps extends React.PropsWithChildren {
  color: string;
  name?: string;
  editable?: boolean;
  onClick?: () => void;
}

export default function Swatch({color, name, children, editable, onClick} : SwatchProps) {
  const deserialized = deserialize(color);
  const space = listColorSpaces().find(f => f.id === deserialized.id);
  const lch = convert(deserialized.coords, space!, OKLCH);
  const backgroundLight = LIGHTNESS_BREAKPOINT < lch[0];

  return <div
    className={classOptional({ 
      "cursor-pointer": true,
      "relative": true,
      "text-white": !backgroundLight,
      "text-black": backgroundLight,
      "after:block after:w-4 after:h-4 after:bg-black after:absolute after:left-[50%] after:-translate-1/2": editable,
    })}
    onClick={onClick}
  >
    <div
      className="w-15 h-15 hover:rounded-[30%] transition-[border_radius]"
      style={{
        backgroundColor: color
      }}
    >
    {/* This is here to prevent clicking the picker from triggering a click */}
      <div 
        onClick={e => e.stopPropagation()}
        className="grid h-full"
      >
      {name && <div className="text-center text-sm m-auto opacity-0 group-hover/palette:opacity-100 transition-opacity duration-700">
        {name}
        </div>
      }
        {children}
      </div>
    </div>
  </div>
}
