"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type LucideIcon, X, ArrowUpRight, Monitor, Layers, BookOpen, Radio } from "lucide-react";

interface ShortcutsModalProps {
  onClose: () => void;
}

const COMMANDS = [
  { cmd: "/projects",     desc: "Browse all case studies" },
  { cmd: "/about",        desc: "More about David Rivas" },
  { cmd: "/skills",       desc: "Design & dev capabilities" },
  { cmd: "/resume",       desc: "Career history & experience" },
  { cmd: "/testimonials", desc: "What people are saying" },
  { cmd: "/contact",      desc: "Get in touch with David" },
];

const PROJECTS = [
  { label: "ramble AI",      cmd: "/projects/ramble-ai",                meta: "Web · July 2026"           },
  { label: "Hithe",          cmd: "/projects/hithe",                    meta: "Web · Apr–Jun 2026"        },
  { label: "Design Skills",  cmd: "/projects/design-skills-guardrails", meta: "Design System · Nov 2025"  },
  { label: "Battery Trader", cmd: "/projects/battery-trader",           meta: "SaaS · Sept 2023–Mar 2024" },
  { label: "Sole Lucky",     cmd: "/projects/sole-lucky",               meta: "iOS · Jan–Mar 2023"        },
];

const PAGES: Array<{ label: string; icon: LucideIcon; desc: string; href?: string }> = [
  { label: "Projects",  icon: Monitor,      desc: "Case study quick links" },
  { label: "Artifacts", icon: Layers,       desc: "Artifacts from case studies" },
  { label: "Learn",     icon: BookOpen,     desc: "Search all portfolio content" },
  { label: "Dispatch",  icon: Radio,        desc: "Connect on LinkedIn", href: "https://www.linkedin.com/in/iamdavidrivas/" },
];

export default function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  if (!mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", animation: "fade-up 180ms ease-out both" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-[660px] overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "var(--accent)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-[14px] font-semibold text-foreground">How to use ramble</p>
            <p className="text-[11px] leading-4 mt-0.5" style={{ color: "rgba(210,207,203,0.45)" }}>
              A quick reference for getting around the portfolio
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-60"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Sections stacked vertically */}
        <div className="flex flex-col">

          {/* Commands */}
          <div className="p-5">
            <div className="px-3 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Chat Commands</p>
              <p className="text-[11px] leading-4 mt-1" style={{ color: "rgba(210,207,203,0.40)" }}>
                Type these in the chatbot to get rich output
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {COMMANDS.map((c) => (
                <div key={c.cmd} className="flex flex-col gap-0.5 rounded-lg px-3 py-2">
                  <span className="font-mono text-[12px] leading-4" style={{ color: "var(--brand-teal-400)" }}>{c.cmd}</span>
                  <span className="text-[11px] leading-4" style={{ color: "rgba(210,207,203,0.50)" }}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="p-5" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="px-3 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Projects</p>
              <p className="text-[11px] leading-4 mt-1" style={{ color: "rgba(210,207,203,0.40)" }}>
                Type a slash command to open a case study
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {PROJECTS.map((p) => (
                <div key={p.label} className="flex flex-col gap-0.5 rounded-lg px-3 py-2">
                  <span className="text-[12px] leading-5" style={{ color: "var(--foreground)" }}>{p.label}</span>
                  <span className="font-mono text-[11px] leading-4" style={{ color: "var(--brand-teal-400)" }}>{p.cmd}</span>
                  <span className="text-[11px] leading-4" style={{ color: "rgba(210,207,203,0.45)" }}>{p.meta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="p-5" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="px-3 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pages</p>
              <p className="text-[11px] leading-4 mt-1" style={{ color: "rgba(210,207,203,0.40)" }}>
                Accessible from the sidebar
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {PAGES.map((p) => {
                const PageIcon = p.icon;
                return p.href ? (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-start gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-[rgba(210,207,203,0.06)]"
                  >
                    <PageIcon size={11} className="shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="flex flex-col gap-0.5 flex-1">
                      <span className="text-[13px] leading-5 flex items-center gap-1" style={{ color: "var(--foreground)" }}>
                        {p.label}
                        <ArrowUpRight size={9} className="text-muted-foreground" />
                      </span>
                      <span className="text-[11px] leading-4" style={{ color: "rgba(210,207,203,0.45)" }}>{p.desc}</span>
                    </span>
                  </a>
                ) : (
                  <div key={p.label} className="flex items-start gap-2.5 rounded-lg px-3 py-2">
                    <PageIcon size={11} className="shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[13px] leading-5" style={{ color: "var(--foreground)" }}>{p.label}</span>
                      <span className="text-[11px] leading-4" style={{ color: "rgba(210,207,203,0.45)" }}>{p.desc}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
