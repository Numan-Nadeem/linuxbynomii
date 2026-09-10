"use client";

import { useState } from "react";
import type { Entry } from "@/data/course-types";

/* ── CMD LINE ─────────────────────────────────────────────── */
function CmdRow({ e }: { e: Extract<Entry, { kind: "cmd" }> }) {
  const [copied, setCopied] = useState(false);
  const prompt = e.prompt ?? "$";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(e.cmd);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="CLICK TO COPY"
      aria-label={`Copy command ${e.cmd}`}
      className="group grid w-full grid-cols-1 text-left transition-colors duration-75 hover:bg-[#141414] md:grid-cols-[minmax(0,58%)_minmax(0,42%)]"
    >
      <span className="flex items-start gap-2 px-3 py-2 md:px-4 border-b border-line md:border-b-0 md:border-r">
        <span
          aria-hidden
          className={`shrink-0 select-none pt-px micro-lg ${
            copied ? "text-phos" : "text-hazard hazard-glow"
          }`}
        >
          {copied ? "[#]" : `[${prompt}]`}
        </span>
        <span
          className={`break-all font-mono text-[13px] leading-5 ${
            copied ? "text-phos-dim" : "text-phos phos-glow"
          }`}
        >
          {copied ? "COPIED TO BUFFER" : e.cmd}
        </span>
      </span>
      <span className="relative flex items-start gap-2 px-3 py-1.5 md:py-2 md:px-4">
        <span aria-hidden className="micro text-phos-faint hidden md:inline pt-px">
          &gt;&gt;&gt;
        </span>
        <span className="text-[11.5px] leading-[18px] text-phos-dim">{e.desc}</span>
      </span>
    </button>
  );
}

/* ── DEFINITION ROW ───────────────────────────────────────── */
function DefRow({ e }: { e: Extract<Entry, { kind: "def" }> }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] md:grid-cols-[190px_minmax(0,1fr)] border-b border-line last:border-b-0">
      <span className="px-3 py-1.5 md:px-4 micro-lg text-phos border-r border-line break-all flex items-start gap-1">
        <span aria-hidden className="text-phos-faint">[</span>
        <span className="min-w-0">{e.term}</span>
        <span aria-hidden className="text-phos-faint">]</span>
      </span>
      <span className="px-3 py-1.5 md:px-4 text-[11.5px] leading-[18px] text-phos-dim">
        {e.desc}
      </span>
    </div>
  );
}

/* ── SUB LABEL ────────────────────────────────────────────── */
function SubLabel({ e }: { e: Extract<Entry, { kind: "sub" }> }) {
  return (
    <div className="flex items-center gap-3 px-3 md:px-4 pt-5 pb-2">
      <span aria-hidden className="text-hazard hazard-glow micro-lg">+</span>
      <span className="micro-lg text-hazard whitespace-nowrap">{e.text}</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ── NOTE ─────────────────────────────────────────────────── */
function NoteRow({ e }: { e: Extract<Entry, { kind: "note" }> }) {
  return (
    <p className="px-3 md:px-4 py-2 pr-8 text-[12.5px] leading-[20px] text-phos-dim">
      <span aria-hidden className="text-phos-faint select-none mr-2">{"//"}</span>
      {e.text}
    </p>
  );
}

/* ── CODE BLOCK ───────────────────────────────────────────── */
function CodeBlock({ e }: { e: Extract<Entry, { kind: "code" }> }) {
  return (
    <div className="mx-3 md:mx-4 mb-3 border border-line">
      {e.caption && (
        <div className="flex items-center justify-between border-b border-line bg-[#050505] px-3 py-1.5">
          <span className="micro text-phos-dim">[ {e.caption} ]</span>
          <span aria-hidden className="micro text-phos-faint">CTRL+C READY</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-[#050505] px-3 py-2 font-mono text-[12px] leading-6">
        {e.lines.map((ln, i) => (
          <div key={i} className="flex gap-3 whitespace-pre">
            <span aria-hidden className="select-none text-phos-faint w-5 text-right shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-phos">{ln}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ── FIGURE PLATE ─────────────────────────────────────────── */
function Figure({ e }: { e: Extract<Entry, { kind: "image" }> }) {
  return (
    <figure className="mx-3 md:mx-4 mb-4 mt-1">
      <div className="flex items-stretch justify-between border border-line">
        <span className="bg-hazard px-2 py-1 micro-lg text-white hazard-glow">{e.tag}</span>
        <span className="flex-1 border-x border-line px-3 py-1 micro text-phos-dim overflow-hidden text-ellipsis whitespace-nowrap">
          {e.caption}
        </span>
        <span aria-hidden className="hidden sm:flex items-center px-2 micro text-phos-faint">
          SRC/DOC
        </span>
      </div>
      <div className="plate border-x border-b border-line">
        <img src={e.src} alt={e.caption} loading="lazy" />
      </div>
      <figcaption className="mt-0 border border-t-0 border-line bg-[#050505] px-3 py-1.5 flex items-center justify-between">
        <span className="micro text-phos-faint">EVIDENCE PLATE — {e.tag}</span>
        <span aria-hidden className="micro text-hazard">+ + +</span>
      </figcaption>
    </figure>
  );
}

/* ── DISPATCHER ───────────────────────────────────────────── */
export function EntryView({ entry }: { entry: Entry }) {
  switch (entry.kind) {
    case "cmd":
      return <CmdRow e={entry} />;
    case "def":
      return <DefRow e={entry} />;
    case "sub":
      return <SubLabel e={entry} />;
    case "note":
      return <NoteRow e={entry} />;
    case "code":
      return <CodeBlock e={entry} />;
    case "image":
      return <Figure e={entry} />;
    default:
      return null;
  }
}
