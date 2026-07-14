"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search as SearchIcon, ChevronRight, X, History } from "lucide-react";
import StreamEngine from "./stream-engine";
import { searchSections, type SearchEntry } from "./learn-index";
import { ABOUT_SECTIONS } from "./about-sections";
import { SKILLS_SECTIONS } from "./skills-sections";
import { RESUME_SECTIONS } from "./resume-sections";
import { TESTIMONIALS_SECTIONS } from "./testimonials-sections";
import PROJECTS from "./project-learn-data";
import type { Section } from "./section-types";

/* ─── Feature badge ───────────────────────────────────────────────────────── */
function FeatureBadge({ label }: { label: string }) {
  return (
    <span
      className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-none tracking-wide capitalize"
      style={{ border: "1px solid var(--border)", color: "var(--brand-teal-400)" }}
    >
      {label}
    </span>
  );
}

/* ─── History entry type ──────────────────────────────────────────────────── */
interface HistoryEntry {
  displayTitle: string;
  feature: string;
  entry: SearchEntry;
  date: Date;
}

/* ─── Search with real-time dropdown (portal) ────────────────────────────── */
function Search({ onSelect }: { onSelect: (entry: SearchEntry) => void }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchEntry[]>([]);
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [dropPos, setDropPos]   = useState({ top: 0, left: 0, width: 0 });
  const rowRef                  = useRef<HTMLDivElement>(null);
  const inputPillRef            = useRef<HTMLDivElement>(null);
  const dropRef                 = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* Recalculate portal position */
  const updatePos = useCallback(() => {
    if (!inputPillRef.current) return;
    const r = inputPillRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + 6, left: r.left, width: r.width });
  }, []);

  /* Close on outside click */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        rowRef.current?.contains(t) === false &&
        dropRef.current?.contains(t) === false
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* Update position on scroll / resize while open */
  useEffect(() => {
    if (!open) return;
    const handle = () => updatePos();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => { window.removeEventListener("scroll", handle, true); window.removeEventListener("resize", handle); };
  }, [open, updatePos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const trimmed = val.trim();
    if (trimmed.length >= 1) {
      setResults(searchSections(trimmed));
      updatePos();
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSelect = (entry: SearchEntry) => {
    onSelect(entry);
    setOpen(false);
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setResults(searchSections(trimmed));
    updatePos();
    setOpen(true);
    inputRef.current?.focus();
  };

  const dropdown = mounted && open && (
    <div
      ref={dropRef}
      style={{
        position: "fixed",
        top: dropPos.top,
        left: dropPos.left,
        width: dropPos.width,
        zIndex: 9999,
        background: "var(--card)",
        border: "1px solid rgba(210,207,203,0.12)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        animation: "fade-up 150ms ease-out both",
      }}
    >
      {results.length > 0 ? (
        <>
          <div
            className="flex items-center px-4 py-2"
            style={{ borderBottom: "1px solid rgba(210,207,203,0.08)" }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-col" style={{ maxHeight: 320, overflowY: "auto" }}>
            {results.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => handleSelect(entry)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(210,207,203,0.06)]"
                style={{ borderTop: i > 0 ? "1px solid rgba(210,207,203,0.06)" : undefined }}
              >
                <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                <span className="flex-1 min-w-0 text-[14px] leading-5 text-foreground truncate">
                  {entry.displayTitle}
                </span>
                <FeatureBadge label={entry.feature} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="px-4 py-3 text-[14px] text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );

  return (
    <>
      <div ref={rowRef} className="flex items-center gap-2">
        {/* Input pill */}
        <div
          ref={inputPillRef}
          className="flex flex-1 items-center gap-3 rounded-full px-4 py-2 border transition-colors"
          style={{ background: "var(--card)", borderColor: open ? "rgba(45,212,191,0.2)" : "var(--border)" }}
        >
          <SearchIcon size={14} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") setOpen(false); }}
            onFocus={() => { if (results.length > 0) { updatePos(); setOpen(true); } }}
            placeholder="Search a skill, project, topic…"
            className="flex-1 bg-transparent text-[15px] leading-6 text-foreground placeholder:text-muted-foreground/50 outline-none"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); setOpen(false); inputRef.current?.focus(); }}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Search button — full round */}
        <button
          onClick={handleSubmit}
          disabled={!query.trim()}
          className="shrink-0 rounded-full px-4 py-2 text-[14px] font-medium leading-6 transition-all disabled:opacity-30 hover:opacity-90 active:scale-95"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Search
        </button>
      </div>

      {/* Portal dropdown — escapes overflow-y-auto clip */}
      {mounted && createPortal(dropdown, document.body)}
    </>
  );
}

/* ─── History item ────────────────────────────────────────────────────────── */
function HistoryItem({ item, onClick }: { item: HistoryEntry; onClick: () => void }) {
  const time = item.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(210,207,203,0.06)]"
    >
      <History size={12} className="shrink-0 text-muted-foreground" />
      <span className="flex-1 text-[13px] leading-5 text-muted-foreground truncate">{item.displayTitle}</span>
      <FeatureBadge label={item.feature} />
      <span className="shrink-0 text-[11px]" style={{ color: "rgba(210,207,203,0.3)" }}>{time}</span>
    </button>
  );
}

/* ─── Shortcut data ───────────────────────────────────────────────────────── */
const SHORTCUTS: Array<{ id: string; label: string; sections: Section[] }> = [
  { id: "about",        label: "About",        sections: ABOUT_SECTIONS               },
  { id: "skills",       label: "Skills",       sections: SKILLS_SECTIONS              },
  { id: "resume",       label: "Resume",       sections: RESUME_SECTIONS              },
  { id: "testimonials", label: "Testimonials", sections: TESTIMONIALS_SECTIONS        },
  { id: "projects",     label: "Projects",     sections: PROJECTS.map((e) => e.section) },
];

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function LearnContent() {
  const [selected, setSelected]               = useState<SearchEntry | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [history, setHistory]                 = useState<HistoryEntry[]>([]);

  const handleSelect = useCallback((entry: SearchEntry) => {
    setSelected(entry);
    setSelectedFeature(null);
    setHistory((prev) => {
      const without = prev.filter((h) => h.entry.id !== entry.id);
      return [
        { displayTitle: entry.displayTitle, feature: entry.feature, entry, date: new Date() },
        ...without,
      ].slice(0, 12);
    });
  }, []);

  const handleShortcut = useCallback((id: string) => {
    setSelectedFeature((prev) => prev === id ? null : id);
    setSelected(null);
  }, []);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
      <div className="mx-auto max-w-[740px] w-full py-8 px-4 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-[24px] font-semibold leading-[29px] text-foreground"
            style={{ letterSpacing: "-0.5px" }}
          >
            Learn
          </h1>
          <p className="text-[14px] leading-6 text-muted-foreground max-w-[560px]">
            ramble&rsquo;s one stop to learn everything or anything about David Rivas.
          </p>
        </div>

        {/* Shortcut toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {SHORTCUTS.map((s) => {
            const active = selectedFeature === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleShortcut(s.id)}
                className="rounded-lg px-3 py-1 text-[12px] font-medium leading-none transition-colors"
                style={{
                  border: active ? "1px solid rgba(45,212,191,0.35)" : "1px solid var(--border)",
                  background: active ? "rgba(45,212,191,0.08)" : "transparent",
                  color: active ? "var(--brand-teal-400)" : "rgba(210,207,203,0.55)",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Hint text between toggles and search */}
        <p className="text-[13px] leading-5 text-muted-foreground">
          Or type a keyword to search for a specific skill, project, tool or to just learn more about that handsome fella.
        </p>

        {/* Search with inline dropdown */}
        <Search onSelect={handleSelect} />

        {/* Shortcut feature display */}
        {selectedFeature && (() => {
          const shortcut = SHORTCUTS.find((s) => s.id === selectedFeature)!;
          return (
            <div
              className="flex flex-col gap-4 rounded-2xl p-5"
              style={{ background: "rgba(210,207,203,0.03)", border: "1px solid rgba(210,207,203,0.08)", animation: "fade-up 200ms ease-out both" }}
            >
              <div
                className="flex items-center gap-2 pb-3"
                style={{ borderBottom: "1px solid rgba(210,207,203,0.08)" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</span>
                <FeatureBadge label={shortcut.label} />
              </div>
              <StreamEngine key={selectedFeature} sections={shortcut.sections} isStatic />
            </div>
          );
        })()}

        {/* Search result display */}
        {selected && (
          <div
            className="flex flex-col gap-4 rounded-2xl p-5"
            style={{ background: "rgba(210,207,203,0.03)", border: "1px solid rgba(210,207,203,0.08)", animation: "fade-up 200ms ease-out both" }}
          >
            <div
              className="flex items-center gap-2 pb-3"
              style={{ borderBottom: "1px solid rgba(210,207,203,0.08)" }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</span>
              <FeatureBadge label={selected.feature} />
            </div>
            <StreamEngine key={selected.id} sections={[selected.section]} />
          </div>
        )}

        {/* Search history */}
        {history.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              History
            </p>
            {history.map((h, i) => (
              <HistoryItem
                key={`${h.entry.id}-${i}`}
                item={h}
                onClick={() => handleSelect(h.entry)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
