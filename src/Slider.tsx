import { classOptional } from "./utils";

interface SliderParams {
  checked: boolean;
  onChange: (e: boolean) => void;
}

export default function Slider({checked, onChange} : SliderParams) {
  return <div
    className="bg-gray-200 h-4 w-8 cursor-pointer relative rounded-[800px] border-1 border-gray-300 box-border"
    onClick={() => onChange(!checked)}
  >
    <div className={classOptional({
      "w-4 h-4 rounded-[50%] absolute transition-all top-[-1px]": true,
      "right-0 bg-blue-400": checked,
      "right-4 bg-gray-50": !checked,
    })} />
  </div>
}
