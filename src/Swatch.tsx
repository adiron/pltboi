import { deserialize, listColorSpaces, convert, OKLCH } from "@texel/color";
import { classOptional } from "./utils";
import { useCallback, useMemo, useRef, useState } from "react";

const LIGHTNESS_BREAKPOINT = 0.57;

interface SwatchProps extends React.PropsWithChildren {
  color: string;
  name?: string;
  editable?: boolean;
  onClick?: () => void;
  active: boolean;
}

const COPIED_TIMEOUT = 2 * 1000;

export default function Swatch({color, name, children, editable, active, onClick} : SwatchProps) {
  const deserialized = useMemo(() => deserialize(color), [color]);
  const space = listColorSpaces().find(f => f.id === deserialized.id);
  const lch = useMemo(() => convert(deserialized.coords, space!, OKLCH), [deserialized, space]);
  const backgroundLight = LIGHTNESS_BREAKPOINT < lch[0];
  const [ hovering, setHovering ] = useState<boolean>(false);
  const [ copied, setCopied ] = useState<boolean>(false);

  const copiedTimer = useRef<number|null>(null);

  const doCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(color);
    if (copiedTimer.current) {
      clearTimeout(copiedTimer.current);
    }
    copiedTimer.current = setTimeout(() => { setCopied(false); copiedTimer.current = null }, COPIED_TIMEOUT);
  }, [copiedTimer, color]);

  const clearCopied = useCallback(() => {
    setCopied(false);
    if (copiedTimer.current) {
      clearTimeout(copiedTimer.current);
    }
  }, [copiedTimer])

  return <div
    className={classOptional({ 
      "cursor-pointer": true,
      "relative": true,
      "text-white": !backgroundLight,
      "text-black": backgroundLight,
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
        onClick={e => { doCopy(); e.stopPropagation() }}
        className="grid h-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); clearCopied(); }}
      >
        {name && <div className="text-center text-sm m-auto opacity-0 [.active_&]:opacity-100 group-hover/palette:opacity-100 transition-opacity duration-700">
          {name}
        </div>}
        { /* Tooltip */ }
        <div className={classOptional({
          "text-white bg-black absolute rounded -top-1 text-sm left-[50%] -translate-y-1/1 -translate-x-1/2 p-1 transition-opacity pointer-events-none": true,
          "opacity-0": !hovering,
        })}>
          {
            copied ? "Copied!" : "Copy"
          }
        </div>
        {children}
      </div>
    </div>
  </div>
}
