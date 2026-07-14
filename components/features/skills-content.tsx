"use client";

import StreamEngine from "./stream-engine";
import { SKILLS_SECTIONS } from "./skills-sections";

export default function SkillsContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={SKILLS_SECTIONS} isStatic={isStatic} />;
}
