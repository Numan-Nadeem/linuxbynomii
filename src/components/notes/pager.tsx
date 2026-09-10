"use client";

import type { CourseSection } from "@/data/course-types";

/**
 * Documentation pager - prev / next section traversal.
 * current="top" is the briefing page; "top" offers BEGIN ->, sections
 * offer <<< PREV / NEXT >>>, the last section closes the dossier.
 */
export function SectionPager({
  sections,
  current,
  onNavigate,
}: {
  sections: CourseSection[];
  current: string;
  onNavigate: (id: string) => void;
}) {
  const idx = sections.findIndex((s) => s.id === current);

  const prev = idx === -1 ? null : idx > 0 ? sections[idx - 1] : null;
  const next =
    idx === -1 ? sections[0] : idx < sections.length - 1 ? sections[idx + 1] : null;

  return (
    <nav
      aria-label="Section pagination"
      className="border-t-2 border-phos grid gap-px bg-line sm:grid-cols-2"
    >
      {/* previous */}
      {prev ? (
        <button
          type="button"
          onClick={() => onNavigate(prev.id)}
          className="group flex cursor-pointer flex-col items-start gap-1.5 bg-tv px-4 md:px-8 py-5 md:py-6 text-left transition-colors hover:bg-hazard focus-visible:bg-hazard"
        >
          <span className="micro text-phos-faint group-hover:text-white transition-colors">
            {"<<<"} PREV — {idx === 0 ? "BRIEFING" : `SECTION ${prev.num}`}
          </span>
          <span className="font-macro text-lg md:text-2xl tracking-tight text-phos group-hover:text-white transition-colors">
            {idx === 0 ? "../BRIEFING" : `${prev.num} / ${prev.title}`}
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-start gap-1.5 bg-tv px-4 md:px-8 py-5 md:py-6" aria-hidden>
          <span className="micro text-phos-faint">{"///"} START OF DOSSIER</span>
          <span className="font-macro text-lg md:text-2xl tracking-tight text-phos-faint">
            LX-09
          </span>
        </div>
      )}

      {/* next */}
      {next ? (
        <button
          type="button"
          onClick={() => onNavigate(next.id)}
          className="group flex cursor-pointer flex-col items-end gap-1.5 bg-tv px-4 md:px-8 py-5 md:py-6 text-right border-t sm:border-t-0 border-line transition-colors hover:bg-hazard focus-visible:bg-hazard"
        >
          <span className="micro text-phos-faint group-hover:text-white transition-colors">
            {idx === -1 ? "BEGIN DOSSIER" : `NEXT — SECTION ${next.num}`} {">>>"}
          </span>
          <span className="font-macro text-lg md:text-2xl tracking-tight text-phos group-hover:text-white transition-colors">
            {next.num} / {next.title}
          </span>
        </button>
      ) : (
        <div
          className="flex flex-col items-end gap-1.5 bg-tv px-4 md:px-8 py-5 md:py-6 text-right border-t sm:border-t-0 border-line"
          aria-hidden
        >
          <span className="micro text-phos-faint">END OF DOSSIER {"///"}</span>
          <span className="font-macro text-lg md:text-2xl tracking-tight text-phos-faint">
            TRANSMISSION COMPLETE
          </span>
        </div>
      )}
    </nav>
  );
}
