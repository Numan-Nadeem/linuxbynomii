"use client";

import type { CourseSection, Topic } from "@/data/course-types";
import { entryText, topicText } from "@/data/course";
import { EntryView } from "./entries";

export interface FilterState {
  query: string;
  matchCounts: Map<string, number>; // topicId -> matches
}

function TopicBlock({
  topic,
  filter,
}: {
  topic: Topic;
  filter: FilterState;
}) {
  const q = filter.query.trim().toLowerCase();
  const matches = filter.matchCounts.get(topic.id) ?? 0;

  // When filtering, a topic is shown only if it has matches
  if (q && matches === 0) return null;

  const entries =
    q
      ? topic.entries.filter((e) => entryText(e).toLowerCase().includes(q))
      : topic.entries;

  return (
    <article id={topic.id} className="scroll-mt-28 border border-line bg-tv">
      {/* topic header */}
      <header className="flex flex-wrap items-stretch justify-between border-b border-line bg-[#0f0f0f]">
        <h3 className="flex items-center gap-3 px-3 md:px-4 py-2.5">
          <span className="bg-phos px-1.5 py-0.5 micro-lg font-bold text-tv">{topic.code}</span>
          <span className="font-macro text-[15px] md:text-[17px] tracking-tight text-phos">
            {topic.title}
          </span>
        </h3>
        <span className="flex items-center gap-2 px-3 md:px-4 micro text-phos-faint">
          {q ? (
            <span className="text-hazard">{matches} MATCH{matches === 1 ? "" : "ES"}</span>
          ) : (
            <span>{topic.entries.length} REC</span>
          )}
          <span aria-hidden className="text-hazard">§</span>
        </span>
      </header>
      <div className="grid-compartment border-x-0 border-b-0 border-t-0">
        {entries.map((e, i) => (
          <EntryView key={i} entry={e} />
        ))}
      </div>
    </article>
  );
}

export function SectionBlock({
  section,
  filter,
}: {
  section: CourseSection;
  filter: FilterState;
}) {
  const q = filter.query.trim().toLowerCase();
  const visibleTopics = q
    ? section.topics.filter((t) => (filter.matchCounts.get(t.id) ?? 0) > 0)
    : section.topics;

  // whole section hidden when filtering yields nothing
  if (q && visibleTopics.length === 0) return null;

  const totalMatches = visibleTopics.reduce(
    (acc, t) => acc + (filter.matchCounts.get(t.id) ?? 0),
    0
  );

  return (
    <section
      id={section.id}
      aria-label={section.title}
      className="scroll-mt-24 border-t-2 border-phos"
    >
      {/* ── section head ── */}
      <div className="relative overflow-hidden border-b border-line bg-tv dot-grid">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-start gap-4 md:gap-8">
            <div
              aria-hidden
              className="macro-section-num font-macro select-none shrink-0"
            >
              {section.num}
            </div>
            <div className="pt-1 md:pt-3">
              <p className="micro text-phos-faint mb-2">
                [ SECTION {section.num} ] — REF {section.ref}
              </p>
              <h2 className="macro-section-title font-macro text-phos">
                {section.title}
              </h2>
              <p className="mt-3 micro-lg text-phos-dim">{section.subtitle}</p>
            </div>
          </div>
          <div className="shrink-0 md:text-right">
            <div className="inline-block border border-line bg-[#0f0f0f] px-3 py-2">
              <p className="micro text-phos-faint">MODULES LOADED</p>
              <p className="font-macro text-2xl text-hazard hazard-glow">
                {q ? `${visibleTopics.length}/${section.topics.length}` : section.topics.length}
              </p>
              {q && (
                <p className="micro text-phos-dim mt-1">{totalMatches} ENTRY HITS</p>
              )}
            </div>
          </div>
        </div>
        {/* crosshair marks at corners */}
        <span aria-hidden className="absolute left-2 top-2 text-phos-faint micro">+</span>
        <span aria-hidden className="absolute right-2 top-2 text-phos-faint micro">+</span>
        <span aria-hidden className="absolute left-2 bottom-2 text-phos-faint micro">+</span>
      </div>

      {/* ── topic stack ── */}
      <div className="flex flex-col gap-6 px-3 md:px-8 py-6 md:py-8 bg-tv-panel">
        {visibleTopics.map((t) => (
          <TopicBlock key={t.id} topic={t} filter={filter} />
        ))}
      </div>
    </section>
  );
}
