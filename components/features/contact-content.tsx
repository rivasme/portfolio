"use client";

import StreamEngine from "./stream-engine";
import { CONTACT_SECTIONS } from "./contact-sections";

export default function ContactContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={CONTACT_SECTIONS} isStatic={isStatic} />;
}
