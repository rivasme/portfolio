"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SlashCommand {
  id: string;
  trigger: string;
  label: string;
  desc?: string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { id: "projects",                          trigger: "projects",                          label: "projects"                          },
  { id: "projects/sole-lucky",               trigger: "projects/sole-lucky",               label: "projects/sole-lucky",               desc: "Sole Lucky"               },
  { id: "projects/battery-trader",           trigger: "projects/battery-trader",           label: "projects/battery-trader",           desc: "Battery Trader"           },
  { id: "projects/design-skills-guardrails", trigger: "projects/design-skills-guardrails", label: "projects/design-skills-guardrails", desc: "Design Skills & Guardrails" },
  { id: "projects/hithe",                    trigger: "projects/hithe",                    label: "projects/hithe",                    desc: "Hithe"                    },
  { id: "projects/ramble-ai",                trigger: "projects/ramble-ai",                label: "projects/ramble-ai",                desc: "ramble AI"                },
  { id: "about",                             trigger: "about",                             label: "about"                             },
  { id: "testimonials",                      trigger: "testimonials",                      label: "testimonials"                      },
  { id: "resume",                            trigger: "resume",                            label: "resume"                            },
  { id: "contact",                           trigger: "contact",                           label: "contact"                           },
  { id: "skills",                            trigger: "skills",                            label: "skills"                            },
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
      c.label.includes(query.toLowerCase()),
  );

  useEffect(() => { setActiveIndex(0); }, [query]);

  /* keyboard nav */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) onSelect(filtered[activeIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [filtered, activeIndex, onSelect, onClose]);

  /* click outside */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose, anchorRef]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={menuRef}
      role="listbox"
      aria-label="Skills"
      className={cn(
        "absolute bottom-full left-0 mb-2 z-50 w-[289px]",
        "rounded-xl border border-border bg-popover shadow-2xl overflow-hidden",
        "py-1.5",
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
          <span
            aria-hidden
            className="shrink-0 text-[13px] leading-none select-none w-4 text-center"
            style={{ fontFamily: '"Font Awesome 7 Pro"', fontWeight: 300 }}
          >
            file-lines
          </span>
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
