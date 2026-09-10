import type { CourseSection, CourseStats, Entry, Topic } from "./course-types";
import { sectionsA } from "./course-a";
import { sectionsB } from "./course-b";

export type { CourseSection, CourseStats, Entry, Topic };

export const COURSE: CourseSection[] = [...sectionsA, ...sectionsB];

export function courseStats(): CourseStats {
  let topics = 0;
  let commands = 0;
  let figures = 0;
  for (const s of COURSE) {
    topics += s.topics.length;
    for (const t of s.topics) {
      for (const e of t.entries) {
        if (e.kind === "cmd") commands += 1;
        if (e.kind === "image") figures += 1;
      }
    }
  }
  return { sections: COURSE.length, topics, commands, figures };
}

/** Searchable text of an entry — used by the grep filter */
export function entryText(e: Entry): string {
  switch (e.kind) {
    case "cmd":
      return `${e.cmd} ${e.desc ?? ""}`;
    case "note":
      return e.text;
    case "def":
      return `${e.term} ${e.desc ?? ""}`;
    case "sub":
      return e.text;
    case "code":
      return `${e.caption ?? ""} ${e.lines.join(" ")}`;
    case "image":
      return `${e.caption} ${e.tag}`;
  }
}

export function topicText(t: Topic): string {
  return `${t.title} ${t.entries.map(entryText).join(" ")}`.toLowerCase();
}
