"use client";

import StreamEngine from "./stream-engine";
import { RESUME_SECTIONS } from "./resume-sections";

export default function ResumeContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={RESUME_SECTIONS} isStatic={isStatic} />;
}
