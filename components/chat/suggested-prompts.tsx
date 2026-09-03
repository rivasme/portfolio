"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* Starter prompts shown on the homepage / new-chat state only.
   Clicking one submits the full sentence; the slash command inside it is what
   actually routes the response (see resolveCommand in home-content).
   - Desktop: SuggestedPrompts renders the list inline under the input.
   - Mobile:  SuggestedPromptsDropdown renders a pill that opens the list upward. */

interface Suggestion {
  before: string;
  badge: string;
  after: string;
}

const SUGGESTIONS: Suggestion[] = [
  { before: "Show me the latest ", badge: "/projects", after: " David has worked on" },
  { before: "I want to know more about David, tell me ", badge: "/about", after: " him" },
  { before: "I want to know what people are saying about him, show me ", badge: "/testimonials", after: "" },
];

function Badge({ children }: { children: string }) {
  return (
    <span
      className="mx-0.5 inline-block rounded-md px-1 py-[3px] font-mono text-[13px] leading-none align-middle"
      style={{ color: "var(--brand-teal-400)", border: "1px solid var(--border)" }}
    >
      {children}
    </span>
  );
}

function SuggestionRow({ s, onSelect }: { s: Suggestion; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-lg px-3 py-2 text-left text-[13px] leading-5 text-foreground cursor-pointer transition-colors duration-100 hover:bg-[rgba(210,207,203,0.06)] active:bg-[rgba(210,207,203,0.12)]"
    >
      {s.before}
      <Badge>{s.badge}</Badge>
      {s.after}
    </button>
  );
}

/* ── Desktop: inline stacked list ─────────────────────────────────────────── */
export default function SuggestedPrompts({ onSubmit }: { onSubmit: (v: string) => void }) {
  return (
    <div className="mt-6 flex flex-col gap-0.5">
      <p className="px-3 pb-1 text-[12px] leading-5 text-muted-foreground">Suggested for you:</p>
      {SUGGESTIONS.map((s) => (
        <SuggestionRow key={s.badge} s={s} onSelect={() => onSubmit(`${s.before}${s.badge}${s.after}`)} />
      ))}
    </div>
  );
}

/* ── Mobile: pill trigger + upward popover ────────────────────────────────── */
export function SuggestedPromptsDropdown({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative mt-2 px-2">
      {open && (
        <div
          className="absolute bottom-[calc(100%+8px)] left-2 right-2 z-50 flex flex-col gap-0.5 rounded-xl border border-border p-1 shadow-lg"
          style={{ background: "#262421", animation: "fade-up 160ms ease-out both" }}
        >
          {SUGGESTIONS.map((s) => (
            <SuggestionRow
              key={s.badge}
              s={s}
              onSelect={() => {
                onSubmit(`${s.before}${s.badge}${s.after}`);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[13px] leading-5 text-muted-foreground transition-colors hover:bg-[rgba(210,207,203,0.06)] active:bg-[rgba(210,207,203,0.1)]"
      >
        Suggested for you
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
