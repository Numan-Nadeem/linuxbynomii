"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseSection, CourseStats } from "@/data/course-types";
import { entryText, topicText } from "@/data/course";
import { TopBar } from "./top-bar";
import { Hero } from "./hero";
import { Rail } from "./rail";
import { SectionBlock, type FilterState } from "./section-block";
import { Footer } from "./footer";

export function NotesApp({
  sections,
  stats,
}: {
  sections: CourseSection[];
  stats: CourseStats;
}) {
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);

  /* ── scroll tracking: progress + active section ── */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      setShowTop(window.scrollY > 800);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", ...sections.map((s) => s.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // re-register whenever the query changes — filtered sections remount
  }, [sections, query]);

  /* ── grep filter: per-topic match counts ── */
  const filter: FilterState = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchCounts = new Map<string, number>();
    if (!q) return { query, matchCounts };
    for (const s of sections) {
      for (const t of s.topics) {
        let n = 0;
        for (const e of t.entries) {
          if (entryText(e).toLowerCase().includes(q)) n += 1;
        }
        // topic title counts as one hit
        if (topicText(t).includes(q) && n === 0) n = 1;
        matchCounts.set(t.id, n);
      }
    }
    return { query, matchCounts };
  }, [query, sections]);

  const totalHits = useMemo(
    () => Array.from(filter.matchCounts.values()).reduce((a, b) => a + b, 0),
    [filter]
  );

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-tv">
      {/* ── CRT overlay layers ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 crt-scanlines" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 grain" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40 crt-vignette" />

      <TopBar progress={progress} />
      <Rail
        sections={sections}
        stats={stats}
        active={active}
        query={query}
        matchCounts={filter.matchCounts}
        onNavigate={navigate}
      />

      {/* ── main column ── */}
      <main className="flex-1 lg:pl-64 pt-12 flex flex-col">
        {/* sticky toolbar: grep + mobile chips */}
        <div className="sticky top-12 z-30 border-b border-line bg-tv">
          <div className="flex items-stretch">
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 border-r border-line shrink-0">
              <span className="micro text-hazard hazard-glow">GREP</span>
              <span aria-hidden className="text-phos-faint micro hidden md:inline">-ri</span>
            </div>
            <div className="flex-1 flex items-center gap-2 px-2 md:px-3">
              <span aria-hidden className="text-hazard micro-lg select-none">&gt;</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='filter modules & commands, e.g. "acl" / "journalctl" / "selinux"'
                aria-label="Filter notes by keyword"
                className="w-full bg-transparent py-2 font-mono text-[12.5px] text-phos placeholder:text-phos-faint focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear filter"
                  className="micro border border-line px-1.5 py-0.5 text-phos-dim hover:border-hazard hover:text-hazard transition-colors"
                >
                  CLR
                </button>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-3 border-l border-line px-3 micro text-phos-faint shrink-0">
              {query ? (
                <span className="text-hazard">{totalHits} HITS</span>
              ) : (
                <span>ALL RECORDS</span>
              )}
            </div>
          </div>

          {/* mobile section chips */}
          <div className="lg:hidden border-t border-line overflow-x-auto" role="navigation" aria-label="Sections quick nav">
            <div className="flex w-max">
              <a
                href="#top"
                className={`micro-lg px-3 py-2 border-r border-line whitespace-nowrap ${
                  active === "top" ? "bg-hazard text-white" : "text-phos-dim"
                }`}
              >
                ../BRIEF
              </a>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`micro-lg px-3 py-2 border-r border-line whitespace-nowrap ${
                    active === s.id ? "bg-hazard text-white" : "text-phos-dim"
                  }`}
                >
                  {s.num}/{s.title.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Hero stats={stats} />

        <div className="flex-1">
          {sections.map((s) => (
            <SectionBlock key={s.id} section={s} filter={filter} />
          ))}

          {/* no results state */}
          {query && totalHits === 0 && (
            <div className="px-4 md:px-8 py-16 text-center">
              <p className="font-macro text-2xl text-phos-dim">NO RECORDS MATCH</p>
              <p className="micro text-phos-faint mt-3">
                grep: pattern not found — adjust query or press CLR
              </p>
            </div>
          )}
        </div>

        <Footer />
      </main>

      {/* back to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-4 right-4 z-40 border border-line bg-tv px-3 py-2 micro text-phos-dim hover:bg-hazard hover:text-white hover:border-hazard transition-colors"
        >
          [ TOP ]
        </button>
      )}
    </div>
  );
}
