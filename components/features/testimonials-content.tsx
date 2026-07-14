"use client";

import StreamEngine from "./stream-engine";
import { TESTIMONIALS_SECTIONS } from "./testimonials-sections";

export default function TestimonialsContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={TESTIMONIALS_SECTIONS} isStatic={isStatic} />;
}
