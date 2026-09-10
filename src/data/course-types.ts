/**
 * Industrial Telemetry Notes — data model
 * Source: Linux System Administration Course.docx
 */

export type Entry =
  | { kind: "cmd"; cmd: string; desc?: string; prompt?: string }
  | { kind: "note"; text: string }
  | { kind: "def"; term: string; desc?: string }
  | { kind: "sub"; text: string }
  | { kind: "code"; lines: string[]; caption?: string }
  | { kind: "image"; src: string; caption: string; tag: string; w?: number };

export interface Topic {
  id: string;
  code: string; // module code e.g. 02-04
  title: string;
  entries: Entry[];
}

export interface CourseSection {
  id: string;
  num: string; // 01..08
  ref: string; // original doc reference e.g. "DOC §1"
  title: string;
  subtitle: string;
  topics: Topic[];
}

export interface CourseStats {
  sections: number;
  topics: number;
  commands: number;
  figures: number;
}
