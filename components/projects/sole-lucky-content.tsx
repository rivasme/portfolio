"use client";

import StreamEngine from "@/components/features/stream-engine";
import { SOLE_LUCKY_SECTIONS } from "./sole-lucky-sections";

export default function SoleLuckyContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={SOLE_LUCKY_SECTIONS} isStatic={isStatic} />;
}
