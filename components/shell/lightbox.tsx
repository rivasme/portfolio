"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface LightboxDetail {
  src: string;
  alt: string;
}

export default function Lightbox() {
  const [mounted, setMounted] = useState(false);
  const [image, setImage] = useState<LightboxDetail | null>(null);

  useEffect(() => { setMounted(true); }, []);

  /* Open on ramble:lightbox events dispatched by case-study images */
  useEffect(() => {
    const open = (e: Event) => {
      const detail = (e as CustomEvent<LightboxDetail>).detail;
      if (detail?.src) setImage(detail);
    };
    window.addEventListener("ramble:lightbox", open);
    return () => window.removeEventListener("ramble:lightbox", open);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    if (!image) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") setImage(null); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [image]);

  if (!mounted || !image) return null;

  return createPortal(
    /* Overlay */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", animation: "fade-up 180ms ease-out both" }}
      onClick={(e) => { if (e.target === e.currentTarget) setImage(null); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="rounded-xl shadow-2xl object-contain"
        style={{ maxWidth: "min(92vw, 1600px)", maxHeight: "92vh", width: "auto", height: "auto" }}
      />

      {/* Close button */}
      <button
        onClick={() => setImage(null)}
        aria-label="Close"
        className="fixed right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full overflow-hidden transition-opacity hover:opacity-80"
        style={{ background: "#042f2e" }}
      >
        <X size={14} style={{ color: "#2dd4bf" }} />
      </button>
    </div>,
    document.body
  );
}
