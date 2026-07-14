"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";

interface MonolithModalProps {
  onClose: () => void;
}

export default function MonolithModal({ onClose }: MonolithModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Close on Escape */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", animation: "fade-up 180ms ease-out both" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "var(--accent)", border: "1px solid var(--border)" }}
      >
        {/* Hero image */}
        <div className="relative w-full aspect-[2720/1568]">
          <Image
            src="/images/monolith-hero.png"
            alt="Monolith Plan"
            fill
            className="object-cover rounded-t-xl"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          {/* Title */}
          <p className="text-[16px] font-medium leading-6" style={{ color: "#2dd4bf" }}>
            The Plan Legal Wouldn&rsquo;t Let Us Advertise!
          </p>

          {/* Body */}
          <div className="flex flex-col gap-0 text-[14px] leading-5 text-foreground">
            <p>Unlimited tokens. Unlimited context. Zero rate limits, because limits were never really the point.</p>
            <p>&nbsp;</p>
            <p>
              Priority access to{" "}
              <span className="font-medium italic" style={{ color: "#2dd4bf" }}>Tangent 90°</span>
              , our flagship model that reasons at exactly the angle math says shouldn&rsquo;t exist. It doesn&rsquo;t hallucinate, it just occasionally reports from a parallel context window.
            </p>
            <p>&nbsp;</p>
            <p>
              <span className="font-normal italic" style={{ color: "#2dd4bf" }}>Also included:</span>
              {" "}a dedicated inference cluster, a personal apology from the power grid, and full immunity from the phrase &ldquo;you&rsquo;ve reached your usage limit.&rdquo;
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-medium leading-4 transition-colors"
              style={{
                background: "rgba(210,207,203,0.06)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
              }}
            >
              Not now, but blow my inbox up about it!
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-medium leading-4 transition-opacity hover:opacity-80"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full overflow-hidden transition-opacity hover:opacity-80"
          style={{ background: "#042f2e" }}
        >
          <X size={11} style={{ color: "#2dd4bf" }} />
        </button>
      </div>
    </div>,
    document.body
  );
}
