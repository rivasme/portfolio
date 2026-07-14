"use client";

import StreamEngine from "@/components/features/stream-engine";
import { DESIGN_SKILLS_SECTIONS } from "./design-skills-sections";

export default function DesignSkillsContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={DESIGN_SKILLS_SECTIONS} isStatic={isStatic} />;
}
