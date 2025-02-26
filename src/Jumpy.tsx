import { useMemo, useRef, useState } from "react";

interface JumpyProps {
  text: string,
  className?: string,
}

export default function Jumpy({text, className} : JumpyProps) {
  const startTime = useRef<number|null>(null);
  const timerId = useRef<number|null>(null);
  const [dt, setDt] = useState<number|null>(null);
  
  function beginAnimation() {
    setDt(0);
    startTime.current = Date.now();
    timerId.current = setInterval(() => {
      if (startTime.current) {
        setDt(Date.now() - startTime.current)
      }
    }, 1000 / 60);
  }

  function stopAnimation() {
    setDt(null);
    startTime.current = null;
    if (timerId.current) {
      clearInterval(timerId.current)
    }
  }

  const letters = useMemo(() => text.split("").map(e => e === ' ' ? '\xa0' : e), [text]);

  return <div 
    className={className}
    onMouseEnter={() => beginAnimation()}
    onMouseLeave={() => stopAnimation()}
  >
  {
    dt ? 
      letters.map((c, i) => <span
                    key={i}
                    className="inline-block transition-transform"
                    style={{
                      transform: `translateY(${Math.sin(i + dt / 100.0) * 20}%)`,
                    }}
                  >
                    {c}
                  </span>) :
      letters.map((c, i) => <span 
                    className="inline-block transition-transform"
                    key={i}
                  >
                    {c}
                  </span>)
  }
  </div>
}
