"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TARGET = "NUMAN NADEEM";
const GLYPHS = "!<>-_\\/[]{}=+*^?#%@$01";
const FRAMES = 26; // ~430ms decode at 60fps

/**
 * Builder signature link.
 * Completely still when idle. On hover / focus it runs a terminal-style
 * decode scramble (JS) while CSS glitch slices + an underline draw-in run.
 * On leave it freezes back to the true label instantly.
 */
export function Byline() {
  const [display, setDisplay] = useState(TARGET);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const scramble = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    frameRef.current = 0;
    const step = () => {
      frameRef.current += 1;
      const settled = Math.floor((frameRef.current / FRAMES) * TARGET.length);
      let out = "";
      for (let i = 0; i < TARGET.length; i++) {
        const ch = TARGET[i];
        if (ch === " " || i < settled) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (frameRef.current < FRAMES) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [stop]);

  const restore = useCallback(() => {
    stop();
    setDisplay(TARGET);
  }, [stop]);

  useEffect(() => stop, [stop]);

  return (
    <a
      href="https://www.numannadeem.dev"
      target="_blank"
      rel="noopener noreferrer"
      data-text={display}
      onMouseEnter={scramble}
      onMouseLeave={restore}
      onFocus={scramble}
      onBlur={restore}
      aria-label="Built by Numan Nadeem - opens www.numannadeem.dev in a new tab"
      className="glitch-link font-macro hazard-glow inline-block select-none text-[clamp(1.5rem,4.5vw,2.75rem)] text-hazard"
    >
      {display}
      <span aria-hidden className="byline-rule" />
    </a>
  );
}
