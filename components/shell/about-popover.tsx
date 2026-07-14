"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const BODY = (
  <>
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--foreground)" }}>
      ramble was built to compete directly with Claude, ChatGPT, and Gemini. Early benchmarks show it outperforms all three on the &ldquo;Talks About David Rivas&rsquo;s Design Work&rdquo; leaderboard, a category it created and currently leads by a wide margin.
    </p>
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--foreground)" }}>
      It also scored a 98.6% on the DRB (David Rivas Benchmark), losing points only for occasionally being too honest about a project&rsquo;s timeline.
    </p>
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--brand-teal-400)" }}>
      Jokes aside, I was bored with generic portfolio sites, so I built an AI chatbot instead. Ask it something.
    </p>
  </>
);

export default function AboutPopover({
  onClose,
  anchor = "right",
}: {
  onClose: () => void;
  anchor?: "right" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [closeable, setCloseable] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Delay backdrop close so iOS ghost-click after tap can't instantly dismiss */
  useEffect(() => {
    if (!mounted || anchor !== "center") return;
    const t = setTimeout(() => setCloseable(true), 250);
    return () => clearTimeout(t);
  }, [mounted, anchor]);

  /* Desktop popover: click-outside to close */
  useEffect(() => {
    if (anchor !== "right") return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [anchor, onClose]);

  /* Mobile: full modal with backdrop */
  if (anchor === "center") {
    if (!mounted) return null;
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", animation: "fade-up 150ms ease-out both" }}
        onClick={(e) => { if (closeable && e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={ref}
          className="relative w-full max-w-sm flex flex-col gap-3 rounded-2xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(210,207,203,0.12)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", lineHeight: "20px" }}>
              About ramble
            </p>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-60"
              style={{ color: "var(--muted-foreground)" }}
              aria-label="Close"
            >
              <X size={13} />
            </button>
          </div>
          {BODY}
        </div>
      </div>,
      document.body,
    );
  }

  /* Desktop: absolute popover */
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: "50%",
        transform: "translateX(50%)",
        width: "min(320px, calc(100vw - 32px))",
        zIndex: 9999,
        background: "var(--card)",
        border: "1px solid rgba(210,207,203,0.12)",
        borderRadius: 16,
        padding: "20px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
        animation: "fade-up 150ms ease-out both",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", lineHeight: "20px" }}>
        About ramble
      </p>
      {BODY}
    </div>
  );
}
