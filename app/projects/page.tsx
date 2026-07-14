"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/shell/app-shell";

/* ─── Spinner ────────────────────────────────────────────────────────────── */
function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border-[1.5px] animate-spin shrink-0 ${className ?? ""}`}
      style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
    />
  );
}

/* ─── Projects data ──────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    slug: "sole-lucky",
    title: "Sole Lucky",
    description: "A raffle-based sneaker app that replaces resale markup with earned access.",
    updated: "Updated Mar 2023",
    order: 1,
  },
  {
    slug: "battery-trader",
    title: "Battery Trader",
    description: "A web-based, multi-tenant, multi-market ops planning, bidding, and analysis app for battery and renewable site owners.",
    updated: "Updated Mar 2024",
    order: 2,
  },
  {
    slug: "design-skills-guardrails",
    title: "Design Skills & Guardrails System",
    description: "Building AI-readable design systems for Claude Code across product, marketing, and PoC surfaces.",
    updated: "Updated Nov 2025",
    order: 3,
  },
  {
    slug: "hithe",
    title: "Hithe",
    description: "An LLM gateway built for regulated industries, sitting between client applications and upstream model providers to meter, govern, and audit API traffic.",
    updated: "Updated Jun 2026",
    order: 4,
  },
  {
    slug: "ramble-ai",
    title: "ramble AI",
    description: "A portfolio built as a working AI chatbot, because a static case study grid wasn't going to prove the point.",
    updated: "Updated Jul 2026",
    order: 5,
  },
];

type SortKey = "last" | "first";

export default function ProjectsPage() {
  const [sortKey, setSortKey] = useState<SortKey>("last");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const sorted = sortKey === "last"
    ? [...PROJECTS].sort((a, b) => b.order - a.order)
    : [...PROJECTS].sort((a, b) => a.order - b.order);

  const sortLabel = sortKey === "last" ? "Last created" : "First created";

  return (
    <AppShell>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="mx-auto max-w-[740px] w-full py-8 px-4 flex flex-col gap-8">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <h1
              className="text-[18px] lg:text-[24px] font-semibold leading-[22px] lg:leading-[29px] text-foreground"
              style={{ letterSpacing: "-0.5px" }}
            >
              Projects
            </h1>

            <div className="flex items-center gap-4">
              {/* Sort by dropdown */}
              <div ref={dropdownRef} className="relative flex items-center gap-1.5 lg:gap-2">
                <span className="text-[12px] lg:text-[14px] leading-5 text-muted-foreground">Sort by</span>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 lg:gap-1.5 rounded-full px-2.5 py-1 lg:px-3 lg:py-1.5 text-[12px] lg:text-[14px] leading-5 text-foreground border border-border transition-colors hover:bg-[rgba(210,207,203,0.06)]"
                  style={{ background: "rgba(210,207,203,0.1)", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                >
                  {sortLabel}
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`shrink-0 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: "currentColor" }}
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+6px)] z-50 w-[160px] rounded-xl border border-border py-1 shadow-lg"
                    style={{ background: "#262421" }}
                  >
                    {(["last", "first"] as SortKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortKey(key); setDropdownOpen(false); }}
                        className="flex w-full items-center justify-between px-3 py-2 text-[13px] leading-5 transition-colors hover:bg-[rgba(210,207,203,0.06)]"
                        style={{ color: key === sortKey ? "var(--foreground)" : "var(--muted-foreground)" }}
                      >
                        {key === "last" ? "Last created" : "First created"}
                        {key === sortKey && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* New Project — always loading */}
              <div
                className="flex items-center gap-1 lg:gap-1.5 rounded-full px-2.5 py-1 lg:px-3 lg:py-1.5 text-[12px] lg:text-[14px] font-medium leading-5 select-none"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                  opacity: 0.5,
                }}
              >
                <Spinner className="w-3 h-3" />
                New Project
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {sorted.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="flex flex-col p-4 border border-border rounded-2xl min-h-[200px] transition-colors duration-100 hover:bg-[rgba(210,207,203,0.06)]"
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <p className="text-[16px] font-medium leading-[24px] text-foreground">{p.title}</p>
                  <p className="text-[14px] leading-[21px] text-foreground">{p.description}</p>
                </div>
                <p className="text-[12px] leading-5 text-muted-foreground mt-8">{p.updated}</p>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </AppShell>
  );
}
