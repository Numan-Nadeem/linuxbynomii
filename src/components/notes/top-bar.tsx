"use client";

import { useEffect, useState } from "react";

export function TopBar({ progress }: { progress: number }) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":")
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-line bg-tv/100">
      {/* reading progress */}
      <div aria-hidden className="absolute top-0 left-0 h-0.5 bg-hazard hazard-glow" style={{ width: `${progress}%` }} />

      <div className="flex h-12 items-stretch justify-between">
        {/* ident block */}
        <a
          href="#top"
          className="flex items-center gap-3 border-r border-line px-3 md:px-4 hover:bg-[#141414] transition-colors"
        >
          <span aria-hidden className="h-3.5 w-3.5 bg-hazard hazard-glow shrink-0" />
          <span className="font-macro text-[13px] md:text-sm tracking-tight text-phos">
            LINUX_SYSADMIN://FIELD_NOTES
          </span>
        </a>

        {/* center readout — desktop only */}
        <div className="hidden md:flex items-stretch divide-x divide-line border-x border-line">
          <span className="flex items-center px-3 micro text-phos-faint">DOC/LX-09</span>
          <span className="flex items-center px-3 micro text-phos-faint">REV 2.6</span>
          <span className="flex items-center px-3 micro text-phos-dim" suppressHydrationWarning>
            {time}
          </span>
        </div>

        {/* status — the single terminal-green element */}
        <div className="flex items-center gap-2 border-l border-line px-3 md:px-4">
          <span aria-hidden className="h-2 w-2 bg-signal signal-glow animate-pulse" />
          <span className="micro-lg text-signal signal-glow">ONLINE</span>
        </div>
      </div>
    </header>
  );
}
