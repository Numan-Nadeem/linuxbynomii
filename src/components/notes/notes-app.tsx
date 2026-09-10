"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CourseSection, CourseStats } from "@/data/course-types";
import { entryText, topicText } from "@/data/course";
import { TopBar } from "./top-bar";
import { Hero } from "./hero";
import { Rail } from "./rail";
import { SectionBlock, type FilterState } from "./section-block";
import { SectionPager } from "./pager";
import { Footer } from "./footer";

/**
 * Documentation-style shell.
 * Browse mode: one section per view (briefing | sec-NN), hash-synced,
 * prev/next pager. Search mode: matching sections stacked as results.
 */
export function NotesApp({
  sections,
  stats,
}: {
  sections: CourseSection[];
  stats: CourseStats;
}) {
  const [view, setView] = useState("top");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const pendingTopicRef = useRef<string | null>(null);

  const sectionIds = useMemo(() => new Set(sections.map((s) => s.id)), [sections]);

  /* ── scroll tracking: progress + back-to-top visibility ── */
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

  /* ── hide back-to-top while the footer is on screen (no overlap) ── */
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setFooterInView(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  /* ── core navigation: set view + sync URL + reposition scroll ── */
  const goTo = useCallback(
    (id: string, opts?: { topic?: string; push?: boolean }) => {
      const target = sectionIds.has(id) ? id : "top";
      const hash = target === "top" ? "#top" : `#${target}`;
      if (opts?.push !== false && window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
      pendingTopicRef.current = opts?.topic ?? null;
      setView(target);
      if (!opts?.topic) {
        document.documentElement.scrollTop = 0; // instant jump on page swap
      }
    },
    [sectionIds]
  );

  /* ── hash -> view (deep links to sections AND topics, back/forward) ── */
  useEffect(() => {
    const ownerOf = (topicId: string) =>
      sections.find((s) => s.topics.some((t) => t.id === topicId));
    const applyHash = () => {
      const h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!h || h === "top") {
        goTo("top", { push: false });
      } else if (sectionIds.has(h)) {
        goTo(h, { push: false });
      } else {
        const owner = ownerOf(h);
        if (owner) goTo(owner.id, { topic: h, push: false });
        else goTo("top", { push: false });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("popstate", applyHash);
    return () => {
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener("popstate", applyHash);
    };
  }, [sections, sectionIds, goTo]);

  /* ── deferred topic jump: scroll once the section has rendered ── */
  useEffect(() => {
    const id = pendingTopicRef.current;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      pendingTopicRef.current = null;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [view, query]);

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

  const searchMode = query.trim().length > 0;
  const activeSection = sections.find((s) => s.id === view);

  /* rail dispatcher: section ids swap the page, topic ids jump within */
  const railNavigate = useCallback(
    (id: string) => {
      if (sectionIds.has(id)) {
        if (searchMode) {
          // in results view everything is mounted - just scroll to it
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          goTo(id);
        }
      } else {
        const owner = sections.find((s) => s.topics.some((t) => t.id === id));
        if (!owner) return;
        if (searchMode || owner.id === view) {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          goTo(owner.id, { topic: id });
        }
      }
    },
    [goTo, sections, searchMode, sectionIds, view]
  );

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
        active={view}
        query={query}
        matchCounts={filter.matchCounts}
        onNavigate={railNavigate}
      />

      {/* ── main column: docs viewer ── */}
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

          {/* mobile section chips - primary nav on small screens */}
          <div className="lg:hidden border-t border-line overflow-x-auto" role="navigation" aria-label="Sections quick nav">
            <div className="flex w-max">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  railNavigate("top");
                }}
                className={`micro-lg px-3 py-2 border-r border-line whitespace-nowrap ${
                  view === "top" ? "bg-hazard text-white" : "text-phos-dim"
                }`}
              >
                ../BRIEF
              </a>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    railNavigate(s.id);
                  }}
                  className={`micro-lg px-3 py-2 border-r border-line whitespace-nowrap ${
                    view === s.id ? "bg-hazard text-white" : "text-phos-dim"
                  }`}
                >
                  {s.num}/{s.title.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── content pane ── */}
        {searchMode ? (
          /* search results: every matching section stacked */
          <div className="flex-1" aria-label="Search results">
            <div className="flex items-center justify-between border-b border-line bg-[#0f0f0f] px-3 md:px-8 py-2">
              <span className="micro text-phos-dim">
                [ GREP RESULTS ] — {totalHits} HIT{totalHits === 1 ? "" : "S"} ACROSS{" "}
                {sections.filter((s) => s.topics.some((t) => (filter.matchCounts.get(t.id) ?? 0) > 0)).length} SECTION(S)
              </span>
              <span className="micro text-hazard hazard-glow">LIVE</span>
            </div>
            {sections.map((s) => (
              <SectionBlock key={s.id} section={s} filter={filter} />
            ))}
            {totalHits === 0 && (
              <div className="px-4 md:px-8 py-16 text-center">
                <p className="font-macro text-2xl text-phos-dim">NO RECORDS MATCH</p>
                <p className="micro text-phos-faint mt-3">
                  grep: pattern not found — adjust query or press CLR
                </p>
              </div>
            )}
          </div>
        ) : view === "top" ? (
          /* briefing page */
          <div className="flex-1">
            <Hero stats={stats} />
            <SectionPager sections={sections} current="top" onNavigate={railNavigate} />
          </div>
        ) : (
          activeSection && (
            <div className="flex-1">
              <SectionBlock section={activeSection} filter={filter} />
              <SectionPager sections={sections} current={view} onNavigate={railNavigate} />
            </div>
          )
        )}

        <Footer />
      </main>

      {/* back to top - hidden while footer on screen to avoid overlap */}
      {showTop && !footerInView && (
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
