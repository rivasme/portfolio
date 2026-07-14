"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Model {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

export const MODELS: Model[] = [
  {
    id: "tangent",
    name: "Tangent 90°",
    displayName: "Tangent 90°",
    description: "Our flagship. Technically undefined at this point, but confidently so.",
  },
  {
    id: "filibuster",
    name: "Filibuster 24HR",
    displayName: "Filibuster 24HR",
    description: "Best for deep reasoning. Talks through every angle before landing on one.",
  },
  {
    id: "digression",
    name: "Digression 7",
    displayName: "Digression 7",
    description: "Fast, great for everyday chat. Frequently changes the subject.",
  },
  {
    id: "random-walk",
    name: "Random Walk ±1",
    displayName: "Random Walk ±1",
    description: "Smallest and quickest. Every answer's a coin flip, statistically speaking.",
  },
  {
    id: "verbose",
    name: "Verbose -vvv",
    displayName: "Verbose -vvv",
    description: "Most creative. The logic doesn't always follow, but the vibes are immaculate.",
  },
];

export const DEFAULT_MODEL = MODELS[1]; /* Filibuster 24HR */

interface ModelMenuProps {
  selectedId: string;
  onSelect: (model: Model) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export default function ModelMenu({ selectedId, onSelect, onClose, anchorRef }: ModelMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  /* click outside to close */
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

  /* Escape to close */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute bottom-full right-0 mb-2 z-50 w-[260px]",
        "rounded-xl border border-border bg-popover shadow-2xl",
        "overflow-hidden py-1.5",
        "animate-[fade-up_150ms_ease-out]",
      )}
    >
      {MODELS.map((model) => {
        const isSelected = model.id === selectedId;
        return (
          <button
            key={model.id}
            onClick={() => { onSelect(model); onClose(); }}
            className={cn(
              "flex w-full flex-col items-start gap-0.5 px-3.5 py-2.5 text-left transition-colors duration-75",
              "hover:bg-accent",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className={cn("text-[13px] font-medium", isSelected ? "text-foreground" : "text-foreground/80")}>
                {model.name}
              </span>
              {isSelected && (
                <Check size={12} style={{ color: "var(--brand-teal-400)" }} />
              )}
            </div>
            <span className="text-[12px] text-muted-foreground leading-snug">
              {model.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
