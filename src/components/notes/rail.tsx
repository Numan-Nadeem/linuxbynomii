"use client";

import type { CourseSection, CourseStats } from "@/data/course-types";
import { topicText } from "@/data/course";

export interface RailProps {
  sections: CourseSection[];
  stats: CourseStats;
  active: string;
  query: string;
  matchCounts: Map<string, number>;
  onNavigate: (id: string) => void;
}

export function Rail({ sections, stats, active, query, matchCounts, onNavigate }: RailProps) {
  const q = query.trim().toLowerCase();
  const activeSection = sections.find((s) => s.id === active);
  const visibleTopics = activeSection
    ? activeSection.topics.filter((t) => !q || (matchCounts.get(t.id) ?? 0) > 0)
    : [];

  return (
    <aside
      aria-label="Section index"
      className="hidden lg:flex fixed left-0 top-12 bottom-0 w-64 z-30 flex-col border-r border-line bg-tv"
    >
      {/* index header */}
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="micro text-phos-dim">[ INDEX ]</span>
        <span className="micro text-phos-faint">LS -LA /NOTES</span>
      </div>

      {/* directory listing */}
      <nav className="flex-1 overflow-y-auto" aria-label="Sections">
        <ol>
          <li className="border-b border-line">
            <button
              type="button"
              onClick={() => onNavigate("top")}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                active === "top" ? "bg-hazard text-white" : "text-phos-dim hover:bg-[#141414]"
              }`}
            >
              <span className="micro-lg w-7 shrink-0">../</span>
              <span className="micro-lg truncate">BRIEFING</span>
            </button>
          </li>
          {sections.map((s) => {
            const isActive = s.id === active;
            const hits = q
              ? s.topics.reduce((a, t) => a + (matchCounts.get(t.id) ?? 0), 0)
              : null;
            return (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => onNavigate(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                    isActive ? "bg-hazard text-white" : "text-phos-dim hover:bg-[#141414]"
                  }`}
                >
                  <span className="micro-lg w-7 shrink-0">{s.num}/</span>
                  <span className="micro-lg truncate flex-1">{s.title}</span>
                  {hits !== null && hits > 0 && (
                    <span
                      className={`micro px-1 border ${
                        isActive ? "border-white text-white" : "border-hazard text-hazard"
                      }`}
                    >
                      {hits}
                    </span>
                  )}
                </button>
                {isActive && visibleTopics.length > 0 && (
                  <ul className="bg-[#0f0f0f] py-1 border-t border-line">
                    {visibleTopics.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => onNavigate(t.id)}
                          className="flex w-full items-center gap-2 px-3 py-1 pl-8 text-left hover:bg-[#1a1a1a]"
                        >
                          <span aria-hidden className="text-phos-faint micro">└</span>
                          <span className="micro text-phos-dim truncate">{t.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* stats block */}
      <div className="border-t border-line">
        <div className="grid grid-cols-2 gap-px bg-line border-b border-line">
          {[
            ["SEC", String(stats.sections).padStart(2, "0")],
            ["MOD", String(stats.topics).padStart(2, "0")],
            ["CMD", String(stats.commands).padStart(3, "0")],
            ["FIG", String(stats.figures).padStart(2, "0")],
          ].map(([k, v]) => (
            <div key={k} className="bg-tv px-3 py-1.5 flex items-center justify-between">
              <span className="micro text-phos-faint">{k}</span>
              <span className="micro-lg text-phos">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div aria-hidden className="barcode h-4 w-20" />
          <span className="micro text-phos-faint">REV 2.6</span>
        </div>
      </div>
    </aside>
  );
}
