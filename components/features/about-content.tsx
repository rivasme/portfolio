"use client";

import StreamEngine from "./stream-engine";
import { ABOUT_SECTIONS } from "./about-sections";

export default function AboutContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={ABOUT_SECTIONS} isStatic={isStatic} />;
}
