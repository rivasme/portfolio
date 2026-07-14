"use client";

import StreamEngine from "@/components/features/stream-engine";
import { RAMBLE_AI_SECTIONS } from "./ramble-ai-sections";

export default function RambleAiContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={RAMBLE_AI_SECTIONS} isStatic={isStatic} />;
}
