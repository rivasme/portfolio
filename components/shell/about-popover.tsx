"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CONTENT = (ref: React.RefObject<HTMLDivElement | null>, positionStyle: React.CSSProperties, onClose: () => void) => (
  <div
    ref={ref}
    style={{
      ...positionStyle,
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
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--foreground)" }}>
      ramble was built to compete directly with Claude, ChatGPT, and Gemini. Early benchmarks show it outperforms all three on the &ldquo;Talks About David Rivas&rsquo;s Design Work&rdquo; leaderboard, a category it created and currently leads by a wide margin.
    </p>
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--foreground)" }}>
      It also scored a 98.6% on the DRB (David Rivas Benchmark), losing points only for occasionally being too honest about a project&rsquo;s timeline.
    </p>
    <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--brand-teal-400)" }}>
      Jokes aside, I was bored with generic portfolio sites, so I built an AI chatbot instead. Ask it something.
    </p>
  </div>
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  if (anchor === "center") {
    const positionStyle: React.CSSProperties = {
      position: "fixed",
      bottom: 80,
      left: 16,
      right: 16,
    };
    return mounted ? createPortal(CONTENT(ref, positionStyle, onClose), document.body) : null;
  }

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: "50%",
    transform: "translateX(50%)",
    width: "min(320px, calc(100vw - 32px))",
  };
  return CONTENT(ref, positionStyle, onClose);
}
