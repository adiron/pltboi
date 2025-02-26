import { deserialize, listColorSpaces, convert, OKLCH } from "@texel/color";
import { classOptional } from "./utils";
import { useMemo } from "react";

const LIGHTNESS_BREAKPOINT = 0.57;

interface SwatchProps extends React.PropsWithChildren {
  color: string;
  name?: string;
  editable?: boolean;
  onClick?: () => void;
  active: boolean;
}

export default function Swatch({color, name, children, editable, active, onClick} : SwatchProps) {
  const deserialized = useMemo(() => deserialize(color), [color]);
  const space = listColorSpaces().find(f => f.id === deserialized.id);
  const lch = useMemo(() => convert(deserialized.coords, space!, OKLCH), [deserialized, space]);
  const backgroundLight = LIGHTNESS_BREAKPOINT < lch[0];

  return <div
    className={classOptional({ 
      "cursor-pointer": true,
      "relative": true,
      "text-white": !backgroundLight,
      "text-black": backgroundLight,
      "": editable,
    })}
    onClick={onClick}
  >
    {
      editable && <div
        className="peer/nub block w-4 h-4 bg-black absolute left-[50%] translate-y-1/2 -translate-x-1/2 bottom-0"
      > </div>
    }
    <div
      className={classOptional({
        "w-15 h-15 hover:rounded-[30%] transition-[border_radius] peer-hover/nub:rounded-[30%]": true,
        "rounded-[30%]": active,
      })}
      style={{
        backgroundColor: color
      }}
    >
    {/* This is here to prevent clicking the picker from triggering a click */}
      <div 
        onClick={e => e.stopPropagation()}
        className="grid h-full"
      >
      {name && <div className="text-center text-sm m-auto opacity-0 [.active_&]:opacity-100 group-hover/palette:opacity-100 transition-opacity duration-700">
        {name}
        </div>
      }
        {children}
      </div>
    </div>
  </div>
}
