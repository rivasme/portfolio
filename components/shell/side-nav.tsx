"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type LucideIcon,
  Plus, Monitor, Layers, BookOpen, Radio, CircleHelp,
  MessageSquare, ChevronDown, Bell, CircleUser, Rocket, ArrowRight, PanelLeft, Info, History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MonolithModal from "./monolith-modal";
import ShortcutsModal from "./shortcuts-modal";
import AboutPopover from "./about-popover";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const NAV_ITEMS: Array<
  | { id: string; label: string; icon: LucideIcon; href: string; newChat: true }
  | { id: string; label: string; icon: LucideIcon; href: string; badge?: string; external?: true }
  | { id: string; label: string; icon: LucideIcon; shortcuts: true }
> = [
  { id: "new-chat",  label: "New chat",  icon: Plus,        href: "/",           newChat: true },
  { id: "projects",  label: "Projects",  icon: Monitor,     href: "/projects" },
  { id: "artifacts", label: "Artifacts", icon: Layers,       href: "/artifacts" },
  { id: "learn",     label: "Learn",     icon: BookOpen,    href: "/learn" },
  { id: "dispatch",  label: "Dispatch",  icon: Radio,       href: "https://www.linkedin.com/in/iamdavidrivas/", badge: "Linkedin", external: true },
  { id: "shortcuts", label: "Help",      icon: CircleHelp,  shortcuts: true },
];


function histTs(h: number, m: number): Date {
  return new Date(2026, 6, 5, h, m, 0, 0); // July 5 2026
}

const HISTORY = [
  { id: "h1", title: "who is json? is he a celebrity or something?",
    userTime: histTs(9, 14),  assistantTime: histTs(9, 15) },
  { id: "h2", title: "explain design tokens to me like I'm 5",
    userTime: histTs(11, 27), assistantTime: histTs(11, 28) },
  { id: "h3", title: "is hallucination when the AI lies or when I haven't slept in 30 hours?",
    userTime: histTs(13, 43), assistantTime: histTs(13, 44) },
  { id: "h4", title: "what's a design sprint? do I need running shoes?",
    userTime: histTs(15, 51), assistantTime: histTs(15, 52) },
  { id: "h5", title: "is 'kill the process' a threat? should I call someone?",
    userTime: histTs(17, 58), assistantTime: histTs(17, 59) },
  { id: "h6", title: "REST api, is that where I go when I'm tired?",
    userTime: histTs(20, 14), assistantTime: histTs(20, 15) },
];

/* ─── History item ────────────────────────────────────────────────────────── */
function HistoryItem({ title, onSelect }: {
  title: string;
  onSelect?: () => void;
}) {
  const router = useRouter();
  const handleClick = () => {
    onSelect?.();
    if (window.location.pathname !== "/") router.push("/");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("ramble:query", { detail: { query: title } }));
    }, window.location.pathname !== "/" ? 200 : 0);
  };
  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-1.5 text-left hover:bg-[rgba(210,207,203,0.06)]"
      style={{ color: "#a19d96" }}
    >
      <MessageSquare size={14} className="shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-[14px] leading-none">{title}</span>
    </button>
  );
}

/* ─── SideNav ─────────────────────────────────────────────────────────────── */
export default function SideNav({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const isCollapsed = collapsed ?? false;
  const router = useRouter();

  const asideRef = useRef<HTMLElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [monolithOpen, setMonolithOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (!historyOpen) return;
    const handle = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [historyOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Outer wrapper */}
      <aside
        ref={asideRef}
        className={cn(
          "h-dvh shrink-0 flex",
          "fixed inset-y-0 left-0 z-40 w-[260px]",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0 lg:p-2",
          "lg:transition-[width] lg:duration-200 lg:ease-out lg:will-change-[width]",
          isCollapsed ? "lg:w-[72px]" : "lg:w-[260px]",
        )}
        aria-label="Primary navigation"
      >
        {/* Inner card */}
        <div
          className={cn(
            "flex h-full w-full flex-col overflow-hidden",
            "lg:rounded-lg rounded-r-xl",
          )}
          style={{
            background: "#262421",
            border: "1px solid var(--border)",
          }}
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div
            className={cn(
              "flex shrink-0 items-center py-2",
              isCollapsed ? "px-2 justify-center" : "px-4 justify-between",
            )}
          >
            {/* Logo — expanded only */}
            {!isCollapsed && (
              <Link
                href="/"
                aria-label="ramble — home"
                className="flex items-center justify-center rounded-md p-1 transition-opacity hover:opacity-70 active:opacity-50"
              >
                <Image
                  src="/ramble-logo.png"
                  alt="ramble"
                  width={21}
                  height={21}
                  className="h-[21px] object-contain"
                  style={{ width: "auto" }}
                  priority
                />
              </Link>
            )}

            {/* Collapse toggle — desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg transition-colors active:scale-95 hover:bg-[rgba(210,207,203,0.06)]"
              style={{ color: "rgba(210,207,203,0.7)" }}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft size={14} />
            </button>
          </div>

          {/* ── Nav body ──────────────────────────────────────────────── */}
          <nav
            className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ paddingTop: "16px" }}
          >
            {/* Primary nav items */}
            <div
              className={cn(
                "flex flex-col gap-2",
                isCollapsed ? "items-center px-2" : "px-2",
              )}
            >
              {NAV_ITEMS.map((item) => {
                const sharedClassName = cn(
                  "flex items-center gap-2 rounded-md transition-colors duration-100 hover:bg-[rgba(210,207,203,0.06)] text-left",
                  isCollapsed ? "h-8 w-8 justify-center" : "h-8 w-full px-3",
                );
                const NavIcon = item.icon;
                const icon = "newChat" in item && item.newChat ? (
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      background: "var(--secondary)",
                      borderColor: "var(--border)",
                      color: "rgba(210,207,203,0.7)",
                    }}
                  >
                    <Plus size={10} />
                  </span>
                ) : (
                  <NavIcon size={14} className="shrink-0" aria-hidden />
                );
                const label = !isCollapsed && (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[14px] leading-5 font-normal">
                      {item.label}
                    </span>
                    {"badge" in item && item.badge && (
                      <span
                        className="shrink-0 rounded-lg px-1 py-0.5 text-[10px] font-normal leading-none"
                        style={{
                          background: "var(--brand-teal-950)",
                          color: "var(--brand-teal-400)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                );

                if ("newChat" in item && item.newChat) {
                  return (
                    <button
                      key={item.id}
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("ramble:newchat"));
                        if (window.location.pathname !== "/") router.push("/");
                        onClose?.();
                      }}
                      className={sharedClassName}
                      style={{ color: "#a19d96" }}
                    >
                      {icon}{label}
                    </button>
                  );
                }

                if ("shortcuts" in item && item.shortcuts) {
                  return (
                    <button
                      key={item.id}
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => { setShortcutsOpen(true); onClose?.(); }}
                      className={sharedClassName}
                      style={{ color: "#a19d96" }}
                    >
                      {icon}{label}
                    </button>
                  );
                }

                if ("external" in item && item.external) {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => onClose?.()}
                      className={sharedClassName}
                      style={{ color: "#a19d96" }}
                    >
                      {icon}{label}
                    </a>
                  );
                }

                if (!("href" in item)) return null;
                return (
                  <Link
                    key={item.id}
                    href={(item as { href: string }).href}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => onClose?.()}
                    className={sharedClassName}
                    style={{ color: "#a19d96" }}
                  >
                    {icon}{label}
                  </Link>
                );
              })}

            </div>

            {/* History section */}
            {isCollapsed ? (
              /* Collapsed: icon button + popover */
              <div ref={historyRef} className="relative flex flex-col items-center px-2 mt-4">
                <button
                  title="Chat history"
                  onClick={() => setHistoryOpen((v) => !v)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100",
                    historyOpen
                      ? "bg-[rgba(210,207,203,0.08)] text-foreground"
                      : "text-[#a19d96] hover:bg-[rgba(210,207,203,0.06)]",
                  )}
                >
                  <History size={14} aria-hidden />
                </button>
                {historyOpen && (
                  <div
                    className="absolute left-full top-0 ml-2 z-50 flex flex-col rounded-xl overflow-hidden"
                    style={{
                      background: "#262421",
                      border: "1px solid var(--border)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                      width: 240,
                      animation: "fade-up 150ms ease-out both",
                    }}
                  >
                    <p
                      className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider select-none"
                      style={{ color: "#8a847a", borderBottom: "1px solid var(--border)" }}
                    >
                      History
                    </p>
                    <div className="flex flex-col py-1">
                      {HISTORY.map((h) => (
                        <HistoryItem key={h.id} title={h.title} onSelect={() => { setHistoryOpen(false); onClose?.(); }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Expanded: inline list */
              <div className="mt-12 flex flex-col gap-2 px-1">
                <p
                  className="px-3 text-[12px] font-normal leading-4 select-none"
                  style={{ color: "#8a847a" }}
                >
                  History
                </p>
                <div className="flex flex-col gap-1">
                  {HISTORY.map((h) => (
                    <HistoryItem key={h.id} title={h.title} onSelect={() => onClose?.()} />
                  ))}
                </div>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />
          </nav>

          {/* ── Bottom ─────────────────────────────────────────────────── */}
          <div className="shrink-0 flex flex-col gap-2 pb-2">
            {/* Monolith button */}
            <div className={cn("px-2", isCollapsed && "flex justify-center")}>
              <button
                onClick={() => setMonolithOpen(true)}
                title="Monolith Plan"
                className={cn(
                  "group flex items-center gap-2 rounded-md transition-colors duration-150",
                  isCollapsed ? "h-8 w-8 justify-center" : "w-full px-2 py-[5.5px]",
                )}
                style={{ background: "rgba(20,184,166,0.10)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.10)")}
              >
                <Rocket size={14} className="shrink-0" aria-hidden style={{ color: "var(--brand-teal-400)" }} />
                {!isCollapsed && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0 items-start">
                      <span className="text-[12px] font-medium leading-4 truncate" style={{ color: "var(--brand-teal-400)" }}>
                        Monolith Plan!
                      </span>
                      <span className="text-[12px] font-normal leading-4" style={{ color: "var(--brand-teal-400)" }}>
                        Learn more!
                      </span>
                    </div>
                    <ArrowRight size={12} className="shrink-0" aria-hidden style={{ color: "var(--brand-teal-400)" }} />
                  </>
                )}
              </button>
            </div>

            {/* About ramble AI — mobile/tablet only */}
            <div className={cn("lg:hidden px-2 relative", isCollapsed && "flex justify-center")}>
              <button
                onClick={() => setAboutOpen((v) => !v)}
                title="About ramble AI"
                className={cn(
                  "flex items-center gap-2 rounded-md transition-colors duration-100 text-left",
                  isCollapsed ? "h-8 w-8 justify-center" : "h-8 w-full px-3",
                  aboutOpen
                    ? "bg-[rgba(210,207,203,0.08)] text-foreground"
                    : "text-[#a19d96] hover:bg-[rgba(210,207,203,0.06)]",
                )}
              >
                <Info size={14} className="shrink-0" aria-hidden />
                {!isCollapsed && (
                  <span className="text-[14px] leading-5 font-normal">about ramble AI</span>
                )}
              </button>
              {aboutOpen && <AboutPopover onClose={() => setAboutOpen(false)} anchor="center" />}
            </div>

            {/* Separator */}
            <div className="h-px w-full" style={{ background: "var(--border)" }} />

            {/* Profile row — px-2 outer matches nav section container */}
            <div className={cn("px-2", isCollapsed && "flex justify-center")}>
            <div
              className={cn(
                "flex items-center px-3 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-[rgba(210,207,203,0.06)]",
                isCollapsed && "justify-center",
              )}
            >
              {!isCollapsed ? (
                <>
                  {/* David Rivas button */}
                  <div className="flex flex-1 items-center gap-1 min-w-0">
                    <button
                      className="flex items-center gap-1.5 rounded-full px-2 py-0.5 transition-colors"
                      style={{ color: "#a29d95" }}
                    >
                      <span className="text-[14px] font-normal leading-4 whitespace-nowrap">
                        David Rivas
                      </span>
                      <ChevronDown size={10} />
                    </button>
                    <span
                      className="text-[12px] font-normal leading-4 whitespace-nowrap"
                      style={{ color: "#2dd4bf" }}
                    >
                      Ultra Plan
                    </span>
                  </div>

                  {/* Bell button */}
                  <button
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-[rgba(210,207,203,0.06)]"
                    style={{ color: "rgba(210,207,203,0.5)" }}
                    aria-label="Notifications"
                  >
                    <Bell size={12} />
                  </button>
                </>
              ) : (
                /* Collapsed: user icon */
                <button
                  title="David Rivas"
                  className="flex h-6 w-6 items-center justify-center rounded-sm"
                  style={{
                    background: "rgba(210,207,203,0.1)",
                    border: "1px solid var(--border)",
                    color: "rgba(210,207,203,0.7)",
                  }}
                >
                  <CircleUser size={12} />
                </button>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* ── Monolith modal ────────────────────────────────────────────── */}
        {monolithOpen && <MonolithModal onClose={() => setMonolithOpen(false)} />}

        {/* ── Shortcuts modal ───────────────────────────────────────────── */}
        {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}

      </aside>
    </>
  );
}
