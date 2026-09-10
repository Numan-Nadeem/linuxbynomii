import { COURSE, courseStats } from "@/data/course";
import { NotesApp } from "@/components/notes/notes-app";

export default function Home() {
  const stats = courseStats();
  return <NotesApp sections={COURSE} stats={stats} />;
}
