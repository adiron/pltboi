import { classOptional } from "./utils";

interface SwatchProps extends React.PropsWithChildren {
  color: string;
  name?: string;
  editable?: boolean;
  onClick?: () => void;
}

export default function Swatch({color, name, children, editable, onClick} : SwatchProps) {
  return <div
    className={classOptional({ 
      "outline-1": true,
      "outline-gray-400": true,
      "bg-white": true,
      "hover:bg-gray-100": true,
      "cursor-pointer": true,
      "transition-background-color": true ,
      "relative": true,
      "after:block after:w-4 after:h-4 after:bg-black after:absolute after:left-[50%] after:-translate-1/2": editable,
    })}
    onClick={onClick}
  >
    <div
      className="w-15 h-15 m-2"
      style={{
        backgroundColor: color
      }}
    >
      {/* This is here to prevent clicking the picker from triggering a click */}
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
    {
      name && <div className="text-center pb-2 text-sm">
        {name}
      </div>
    }
  </div>
}
