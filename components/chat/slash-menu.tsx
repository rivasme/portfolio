"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SlashCommand {
  id: string;
  trigger: string;
  label: string;
  desc?: string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { id: "about",                             trigger: "about",                             label: "About",           desc: "More about David Rivas"        },
  { id: "skills",                            trigger: "skills",                            label: "Skills",          desc: "Design & dev capabilities"     },
  { id: "resume",                            trigger: "resume",                            label: "Resume",          desc: "Career history & experience"   },
  { id: "projects",                          trigger: "projects",                          label: "Projects",        desc: "Browse all case studies"       },
  { id: "testimonials",                      trigger: "testimonials",                      label: "Testimonials",    desc: "What people are saying"        },
  { id: "contact",                           trigger: "contact",                           label: "Contact",         desc: "Get in touch with David"       },
  { id: "projects/ramble-ai",                trigger: "projects/ramble-ai",                label: "ramble AI",       desc: "Case study"                    },
  { id: "projects/hithe",                    trigger: "projects/hithe",                    label: "Hithe",           desc: "Case study"                    },
  { id: "projects/design-skills-guardrails", trigger: "projects/design-skills-guardrails", label: "Design Skills",   desc: "Case study"                    },
  { id: "projects/battery-trader",           trigger: "projects/battery-trader",           label: "Battery Trader",  desc: "Case study"                    },
  { id: "projects/sole-lucky",               trigger: "projects/sole-lucky",               label: "Sole Lucky",      desc: "Case study"                    },
];

interface SlashMenuProps {
  query: string;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export default function SlashMenu({ query, onSelect, onClose, anchorRef }: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = SLASH_COMMANDS.filter(
    (c) =>
      query === "" ||
      c.trigger.startsWith(query.toLowerCase()) ||
      c.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % filtered.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[activeIndex]) onSelect(filtered[activeIndex]); }
      else if (e.key === "Escape") { onClose(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [filtered, activeIndex, onSelect, onClose]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose, anchorRef]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={menuRef}
      role="listbox"
      aria-label="Commands"
      className={cn(
        "absolute bottom-full left-0 mb-2 z-50 w-full max-w-[289px]",
        "rounded-xl border border-border bg-popover shadow-2xl",
        "py-1.5 overflow-y-auto max-h-[55vh]",
        "animate-[fade-up_150ms_ease-out]",
      )}
    >
      {filtered.map((cmd, i) => (
        <button
          key={cmd.id}
          role="option"
          aria-selected={i === activeIndex}
          onMouseEnter={() => setActiveIndex(i)}
          onClick={() => onSelect(cmd)}
          className={cn(
            "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-75",
            i === activeIndex
              ? "bg-sidebar-accent text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
          )}
        >
          <FileText size={13} className="shrink-0 opacity-60" />
          <span className="flex flex-col min-w-0">
            <span className="text-[13px] leading-snug">{cmd.label}</span>
            {cmd.desc && (
              <span className="text-[11px] leading-snug" style={{ color: "rgba(210,207,203,0.40)" }}>{cmd.desc}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
