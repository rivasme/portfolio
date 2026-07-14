"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";
import ChatBubble from "@/components/chat/chat-bubble";
import Message, { type ChatMessage } from "@/components/chat/message";


/* ─── Landing view ───────────────────────────────────────────────────────── */
function LandingView({ onSubmit }: { onSubmit: (v: string) => void }) {
  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden">
      {/* Logo — flex-1 keeps it centered in remaining space above bubble */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-4"
        style={{ animation: "fade-up 300ms ease-out" }}
      >
        <div className="mb-3 flex items-start gap-2">
          <span
            className="font-light leading-none text-[59px] lg:text-[84px]"
            style={{ letterSpacing: "-3px", color: "#C3C0BB" }}
          >
            ramble
          </span>
          <span
            className="mt-2 lg:mt-3 rounded-lg px-1.5 py-0.5 text-[11px] font-semibold leading-none tracking-wider"
            style={{ background: "var(--brand-teal-950)", color: "var(--brand-teal-400)" }}
          >
            AI
          </span>
        </div>
        <p
          className="text-[12px] leading-5 text-center"
          style={{ color: "rgba(210,207,203,0.75)", animation: "fade-up 360ms ease-out" }}
        >
          <span style={{ color: "var(--brand-teal-400)" }}>Tangent 90°</span>
          {" "}access has been extended until July 27, 2026, or until Sol ships, whichever comes first.
        </p>
      </div>

      {/* Chat bubble — pinned to bottom; sits above keyboard when focused */}
      <div
        className="w-full shrink-0 px-3 lg:px-8"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))", animation: "fade-up 380ms ease-out" }}
      >
        <div className="mx-auto max-w-[740px]">
          <ChatBubble onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}

/* ─── Conversation view ──────────────────────────────────────────────────── */
function ConversationView({
  messages,
  streaming,
  onSubmit,
}: {
  messages: ChatMessage[];
  streaming: boolean;
  onSubmit: (v: string) => void;
}) {
  const bottomRef   = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const behavior = isFirstRender.current ? "auto" : "smooth";
    isFirstRender.current = false;
    bottomRef.current?.scrollIntoView({ behavior });
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(dist > 160);
    };
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex h-full flex-col relative">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-[740px] w-full py-8 flex flex-col gap-6 px-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll-to-bottom button — above the chat input, in-flow */}
      {showScrollBtn && (
        <div className="shrink-0 flex justify-center pt-2">
          <button
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-80"
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            <ChevronDown size={12} />
          </button>
        </div>
      )}

      {/* Input — pinned to bottom, safe area on iOS */}
      <div className="shrink-0 px-4 pt-3" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-[740px] w-full">
          <p className="mb-2 text-[12px] leading-5 text-center font-medium" style={{ color: "rgba(210,207,203,1)" }}>
            <span style={{ color: "var(--brand-teal-400)" }}>Tangent 90°</span>
            {" "}access has been extended until July 27, 2026, or until Sol ships, whichever comes first.
          </p>
          <ChatBubble onSubmit={onSubmit} streaming={streaming} />
        </div>
      </div>
    </div>
  );
}

/* ─── Project slug commands (checked before generic /projects) ───────────── */
const PROJECT_SLUG_COMMANDS: Array<{ pattern: RegExp; slug: string }> = [
  { pattern: /^\/projects\/sole-lucky\b/i,               slug: "sole-lucky"               },
  { pattern: /^\/projects\/battery-trader\b/i,           slug: "battery-trader"           },
  { pattern: /^\/projects\/design-skills-guardrails\b/i, slug: "design-skills-guardrails" },
  { pattern: /^\/projects\/hithe\b/i,                    slug: "hithe"                    },
  { pattern: /^\/projects\/ramble-ai\b/i,                slug: "ramble-ai"                },
];

/* ─── Rich command registry (shared by handleSubmit + ramble:query) ─────── */
const RICH_COMMANDS: Array<{ pattern: RegExp; contentType: string }> = [
  { pattern: /^\/projects\b/i,      contentType: "portfolio"    },
  { pattern: /^\/about\b/i,         contentType: "about"        },
  { pattern: /^\/testimonials?\b/i, contentType: "testimonials" },
  { pattern: /^\/skills?\b/i,       contentType: "skills"       },
  { pattern: /^\/resume\b/i,        contentType: "resume"       },
  { pattern: /^\/contact\b/i,       contentType: "contact"      },
];

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function HomeContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const hasMessages = messages.length > 0;

  /* Reset chat when the "New chat" nav item fires the custom event */
  useEffect(() => {
    const handler = () => { setMessages([]); setStreaming(false); };
    window.addEventListener("ramble:newchat", handler);
    return () => window.removeEventListener("ramble:newchat", handler);
  }, []);

  const streamingRef = useRef(false);
  useEffect(() => { streamingRef.current = streaming; }, [streaming]);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed, timestamp: new Date() };
    const assistantId = `a-${Date.now() + 1}`;

    /* Project slug commands — /projects/[slug] */
    const projSlugMatch = PROJECT_SLUG_COMMANDS.find((c) => c.pattern.test(trimmed));
    if (projSlugMatch) {
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: false, contentType: "project" as const, projectSlug: projSlugMatch.slug, timestamp: new Date() }
              : m,
          ),
        );
        setStreaming(false);
      }, 4000 + Math.random() * 1000);
      return;
    }

    /* Rich content commands — thinking delay then staggered reveal */
    const richMatch = RICH_COMMANDS.find((c) => c.pattern.test(trimmed));
    if (richMatch) {
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: false, contentType: richMatch.contentType as ChatMessage["contentType"], timestamp: new Date() }
              : m,
          ),
        );
        setStreaming(false);
      }, 4000 + Math.random() * 1000);
      return;
    }

    /* Unrecognized input — show error after thinking delay */
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, thinking: false, contentType: "error" as const, timestamp: new Date() }
            : m,
        ),
      );
      setStreaming(false);
    }, 4000 + Math.random() * 1000);
  }, [streaming]);

  /* Feature trigger from nav (about / testimonials / skills / resume / contact) */
  useEffect(() => {
    const handler = (e: Event) => {
      const { feature } = (e as CustomEvent<{ feature: string }>).detail;
      if (!feature || streamingRef.current) return;
      const labelMap: Record<string, string> = {
        about: "/about", testimonials: "/testimonials",
        skills: "/skills", resume: "/resume", contact: "/contact",
      };
      const label = labelMap[feature] ?? `/${feature}`;
      const now = Date.now();
      const userMsg: ChatMessage = { id: `u-${now}`, role: "user", content: label, timestamp: new Date() };
      const assistantId = `a-${now}`;
      const thinkingMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
      setMessages((prev) => [...prev, userMsg, thinkingMsg]);
      setStreaming(true);
      streamingRef.current = true;
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: false, contentType: feature as ChatMessage["contentType"], timestamp: new Date() }
              : m,
          ),
        );
        setStreaming(false);
      }, 4000 + Math.random() * 1000);
    };
    window.addEventListener("ramble:feature", handler);
    return () => window.removeEventListener("ramble:feature", handler);
  }, []);

  /* Case study — thinking → staggered section reveal (no duplicate text) */
  useEffect(() => {
    const handler = (e: Event) => {
      const { slug } = (e as CustomEvent<{ slug: string }>).detail;
      if (streamingRef.current) return;

      const title =
        slug === "sole-lucky"               ? "Sole Lucky" :
        slug === "battery-trader"           ? "Battery Trader" :
        slug === "design-skills-guardrails" ? "Design Skills & Guardrails System" :
        slug === "hithe"                    ? "Hithe" :
        slug === "ramble-ai"                ? "ramble AI" :
        slug;
      const now = Date.now();
      const userMsg: ChatMessage = { id: `u-${now}`, role: "user", content: title, timestamp: new Date() };
      const assistantId = `a-${now}`;
      const thinkingMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };

      setMessages((prev) => [...prev, userMsg, thinkingMsg]);
      setStreaming(true);
      streamingRef.current = true;

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: false, contentType: "project", projectSlug: slug, timestamp: new Date() }
              : m,
          ),
        );
        setStreaming(false);
      }, 4000 + Math.random() * 1000);
    };
    window.addEventListener("ramble:project", handler);
    return () => window.removeEventListener("ramble:project", handler);
  }, []);

  /* Other chat queries (non-project links) — stable listener using ref */
  useEffect(() => {
    const handler = (e: Event) => {
      const { query } = (e as CustomEvent<{ query: string }>).detail;
      const trimmed = query?.trim();
      if (!trimmed || streamingRef.current) return;

      const now = Date.now();
      const userMsg: ChatMessage = { id: `u-${now}`, role: "user", content: trimmed, timestamp: new Date() };
      const assistantId = `a-${now + 1}`;

      /* Project slug commands */
      const projSlugMatch = PROJECT_SLUG_COMMANDS.find((c) => c.pattern.test(trimmed));
      if (projSlugMatch) {
        const thinkingMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
        setMessages((prev) => [...prev, userMsg, thinkingMsg]);
        setStreaming(true);
        streamingRef.current = true;
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, thinking: false, contentType: "project" as const, projectSlug: projSlugMatch.slug, timestamp: new Date() }
                : m,
            ),
          );
          setStreaming(false);
        }, 4000 + Math.random() * 1000);
        return;
      }

      /* Route rich commands the same way handleSubmit does */
      const richMatch = RICH_COMMANDS.find((c) => c.pattern.test(trimmed));
      if (richMatch) {
        const thinkingMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
        setMessages((prev) => [...prev, userMsg, thinkingMsg]);
        setStreaming(true);
        streamingRef.current = true;
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, thinking: false, contentType: richMatch.contentType as ChatMessage["contentType"], timestamp: new Date() }
                : m,
            ),
          );
          setStreaming(false);
        }, 4000 + Math.random() * 1000);
        return;
      }

      /* Unrecognized input — show error after thinking delay */
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", thinking: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);
      streamingRef.current = true;
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, thinking: false, contentType: "error" as const, timestamp: new Date() }
              : m,
          ),
        );
        setStreaming(false);
      }, 4000 + Math.random() * 1000);
    };
    window.addEventListener("ramble:query", handler);
    return () => window.removeEventListener("ramble:query", handler);
  }, []);

  if (!hasMessages) {
    return <LandingView onSubmit={handleSubmit} />;
  }

  return (
    <ConversationView
      messages={messages}
      streaming={streaming}
      onSubmit={handleSubmit}
    />
  );
}
