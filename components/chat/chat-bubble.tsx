"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Plus, ChevronDown, Mic, Loader2, AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";
import SlashMenu, { type SlashCommand } from "./slash-menu";
import ModelMenu, { DEFAULT_MODEL, type Model } from "./model-menu";

/* ─── Placeholder — animated typing of example prompt ────────────────────── */
const PLACEHOLDER_PARTS = [
  { text: "Type something like, I want to see David's ", badge: "/skills" },
  { text: "Ask me anything about David's work, try ", badge: "/projects" },
  { text: "Learn more about David, type ", badge: "/about" },
];

function useTypingPlaceholder(active: boolean) {
  const [partIndex, setPartIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!active) { setCharCount(0); return; }

    const { text } = PLACEHOLDER_PARTS[partIndex];

    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, 2400);
      return () => clearTimeout(t);
    }

    if (deleting) {
      if (charCount === 0) {
        setDeleting(false);
        setPartIndex((i) => (i + 1) % PLACEHOLDER_PARTS.length);
        return;
      }
      const t = setTimeout(() => setCharCount((c) => c - 1), 22);
      return () => clearTimeout(t);
    }

    if (charCount < text.length) {
      const t = setTimeout(
        () => setCharCount((c) => c + 1),
        charCount === 0 ? 600 : 44,
      );
      return () => clearTimeout(t);
    }

    /* fully typed — pause */
    setPaused(true);
  }, [active, paused, deleting, charCount, partIndex]);

  return { partIndex, charCount };
}

/* ─── Animated placeholder display ───────────────────────────────────────── */
function PlaceholderOverlay({ show }: { show: boolean }) {
  const { partIndex, charCount } = useTypingPlaceholder(show);
  if (!show) return null;

  const { text, badge } = PLACEHOLDER_PARTS[partIndex];
  const displayed = text.slice(0, charCount);
  const showBadge = charCount >= text.length;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-3 top-2.5 flex items-center select-none lg:left-6 lg:top-4"
    >
      <span className="text-[15px] leading-6 text-muted-foreground/50">
        {displayed}
      </span>
      {showBadge && (
        <span
          className="ml-0.5 rounded-lg px-1 py-[4px] font-mono text-[14px] leading-none"
          style={{
            color: "var(--brand-teal-400)",
            border: "1px solid var(--border)",
          }}
        >
          {badge}
        </span>
      )}
      {!showBadge && (
        <span
          className="inline-block w-px h-[1em] bg-muted-foreground/40 ml-px align-middle"
          style={{ animation: "blink-cursor 1s step-end infinite" }}
        />
      )}
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
interface ChatBubbleProps {
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  streaming?: boolean;
  className?: string;
}

export default function ChatBubble({
  onSubmit,
  onChange,
  disabled = false,
  streaming = false,
  className,
}: ChatBubbleProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(DEFAULT_MODEL);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelBtnRef = useRef<HTMLButtonElement>(null);

  /* auto-resize */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const isEmpty = value.trim() === "";
  const showPlaceholder = isEmpty && !focused && !streaming;
  const slashBadges = value.match(/\/[a-zA-Z][\w-]*/g) ?? [];

  /* slash detection */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    onChange?.(v);
    const cursor = e.target.selectionStart ?? v.length;
    const lastWord = v.slice(0, cursor).split(/\s/).pop() ?? "";
    if (lastWord.startsWith("/")) {
      setSlashQuery(lastWord.slice(1));
      setShowSlash(true);
    } else {
      setShowSlash(false);
      setSlashQuery("");
    }
  }, [onChange]);

  const handleSlashSelect = useCallback((cmd: SlashCommand) => {
    // Replace the trailing /query with the full /trigger, keep surrounding text
    const cursor = textareaRef.current?.selectionStart ?? value.length;
    const before = value.slice(0, cursor).replace(/\/\S*$/, `/${cmd.trigger} `);
    const after = value.slice(cursor);
    const newValue = before + after;
    setValue(newValue);
    onChange?.(newValue);
    setShowSlash(false);
    setSlashQuery("");
    // Put cursor right after the inserted command
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = before.length;
        textareaRef.current.selectionEnd = before.length;
        textareaRef.current.focus();
      }
    });
  }, [value, onChange]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || streaming) return;
    setValue("");
    setShowSlash(false);
    onChange?.("");
    if (onSubmit) onSubmit(trimmed);
    textareaRef.current?.focus();
  }, [value, disabled, streaming, onSubmit, onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlash) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [showSlash, handleSubmit]);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={cn("relative w-full", className)}
    >
      {/* Slash menu */}
      {showSlash && (
        <SlashMenu
          query={slashQuery}
          onSelect={handleSlashSelect}
          onClose={() => setShowSlash(false)}
          anchorRef={containerRef as React.RefObject<HTMLElement>}
        />
      )}

      {/* Model menu */}
      {showModelMenu && (
        <ModelMenu
          selectedId={selectedModel.id}
          onSelect={(m) => setSelectedModel(m)}
          onClose={() => setShowModelMenu(false)}
          anchorRef={modelBtnRef as React.RefObject<HTMLElement>}
        />
      )}

      {/* Bubble shell */}
      <div
        className={cn(
          "relative w-full flex flex-col rounded-3xl border transition-all duration-200",
          "border-border",
          focused && !isEmpty && "border-white/20 shadow-md",
          focused && isEmpty && "border-white/15",
        )}
        style={{ background: "#262421" }}
      >
        {/* Streaming shimmer */}
        {streaming && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.025] to-transparent"
              style={{ animation: "shimmer-pulse 1.8s ease-in-out infinite" }}
            />
          </div>
        )}

        {/* Text input area */}
        <div className="relative px-3 pt-2.5 pb-1.5 lg:px-6 lg:pt-4 lg:pb-2">
          <PlaceholderOverlay show={showPlaceholder} />

          {/* Colored mirror — shows /commands in orange mono, sits under transparent textarea */}
          {slashBadges.length > 0 && !showPlaceholder && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-3 top-2.5 text-[15px] leading-6 whitespace-pre-wrap break-words select-none overflow-hidden lg:inset-x-6 lg:top-4"
              style={{ maxHeight: 160 }}
            >
              {value.split(/(\/[a-zA-Z][\w-]*)/).map((part, i) =>
                /^\/[a-zA-Z][\w-]*$/.test(part) ? (
                  <span key={i} style={{ color: "var(--brand-teal-400)" }}>{part}</span>
                ) : (
                  <span key={i} style={{ color: "var(--foreground)" }}>{part}</span>
                )
              )}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled || streaming}
            rows={1}
            aria-label="Message"
            placeholder={streaming ? "Type a message…" : ""}
            className={cn(
              "w-full resize-none bg-transparent text-[15px] leading-6 outline-none",
              slashBadges.length > 0 ? "text-transparent" : "text-foreground",
              "placeholder:text-muted-foreground/40",
              "max-h-[160px] overflow-y-auto scrollbar-hide",
              "transition-opacity duration-150",
              streaming && "opacity-0 cursor-not-allowed",
            )}
            style={{
              height: "24px",
              ...(slashBadges.length > 0 && { caretColor: "var(--foreground)" }),
            }}
          />

          {/* Show "Type a message…" when streaming */}
          {streaming && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-3 top-2.5 text-[15px] leading-6 text-muted-foreground/40 select-none lg:left-6 lg:top-4"
            >
              Type a message…
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 pb-2 pt-2 lg:px-5 lg:pb-3 lg:pt-1">
          {/* Left: add attachment (disabled — feature not available) */}
          <div className="relative group">
            <button
              type="button"
              disabled
              className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
              aria-label="Add attachment"
            >
              <Plus size={18} />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
              <div
                className="rounded-xl border border-border shadow-lg px-2.5 py-1.5 text-[12px] text-foreground"
                style={{ background: "var(--card)" }}
              >
                upgrade plan to use feature
              </div>
            </div>
          </div>

          {/* Right: model selector + mic + send */}
          <div className="flex items-center gap-1">
            {/* Model selector — faded during streaming */}
            <span
              className="text-[12px] font-normal"
              style={{ color: "rgba(210,207,203,0.35)" }}
            >
              Model
            </span>
            <button
              ref={modelBtnRef}
              type="button"
              onClick={() => !streaming && setShowModelMenu((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1.5 text-muted-foreground transition-all",
                streaming ? "opacity-50 cursor-default" : "hover:bg-white/[0.06] hover:text-foreground active:scale-95",
              )}
              aria-label="Select model"
            >
              <span className="text-[12px] font-medium">{selectedModel.displayName}</span>
              <ChevronDown size={10} />
            </button>

            {/* Mic (disabled — feature not available) */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
                aria-label="Voice input"
              >
                <Mic size={18} />
              </button>
              <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
                <div
                  className="rounded-xl border border-border shadow-lg px-2.5 py-1.5 text-[12px] text-foreground"
                  style={{ background: "var(--card)" }}
                >
                  upgrade plan to use feature
                </div>
              </div>
            </div>

            {/* Send — primary bg (light stone) with dark text per Figma */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={disabled || (isEmpty && !streaming)}
              aria-label={streaming ? "Generating…" : "Send message"}
              className={cn(
                "flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-full",
                "transition-all duration-150",
                isEmpty && !streaming
                  ? "opacity-25 cursor-not-allowed"
                  : streaming
                  ? "opacity-50"
                  : "active:scale-90",
              )}
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {streaming ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <AudioWaveform size={17} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <p className="mt-2 px-2 lg:px-0 text-left lg:text-center text-[11px] text-muted-foreground/40 select-none">
        ramble is an advanced AI and does not make mistakes. It's mostly user errors.
      </p>
    </div>
  );
}
