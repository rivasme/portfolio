"use client";

import StreamEngine from "@/components/features/stream-engine";
import { HITHE_SECTIONS } from "./hithe-sections";

export default function HitheContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={HITHE_SECTIONS} isStatic={isStatic} />;
}
