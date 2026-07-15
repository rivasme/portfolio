"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Equal, ArrowUpRight } from "lucide-react";
import type { Section, SectionLink, TagVariant } from "./section-types";

/* ─── Word-stream hook ────────────────────────────────────────────────────── */
const PARA_MS  = 55;
const QUOTE_MS = 35;

function useWordStream(
  text: string,
  active: boolean,
  msPerWord: number,
  onComplete?: () => void,
) {
  const words   = useMemo(() => text.split(" "), [text]);
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const cbRef   = useRef(onComplete);
  cbRef.current = onComplete;

  useEffect(() => {
    if (!active) return;
    if (count >= words.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        const id = setTimeout(() => cbRef.current?.(), 80);
        return () => clearTimeout(id);
      }
      return;
    }
    const id = setTimeout(() => setCount((c) => c + 1), msPerWord);
    return () => clearTimeout(id);
  }, [active, count, words.length, msPerWord]);

  return { streamed: words.slice(0, count).join(" "), done: count >= words.length };
}

/* ─── Streaming cursor ────────────────────────────────────────────────────── */
function Cursor() {
  return (
    <span
      className="inline-block w-px h-[1.1em] bg-foreground/70 ml-0.5 align-middle"
      style={{ animation: "blink-cursor 0.9s step-end infinite" }}
    />
  );
}

/* ─── Inline link/button renderer  {{label}} → a or button ───────────────── */
function Inline({ text, links, teal }: { text: string; links?: SectionLink[]; teal?: boolean }) {
  if (!links?.length) return <>{text}</>;
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  const linkCls = teal
    ? "text-[var(--brand-teal-400)] underline underline-offset-2 decoration-[var(--brand-teal-400)]/40 hover:decoration-[var(--brand-teal-400)] transition-colors"
    : "underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground transition-colors";
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\{\{(.+)\}\}$/);
        if (!m) return <span key={i}>{part}</span>;
        const lbl  = m[1];
        const link = links.find((l) => l.label === lbl);
        if (!link) return <span key={i}>{lbl}</span>;
        if (link.href) {
          return (
            <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {lbl}
            </a>
          );
        }
        if (link.query) {
          const q = link.query;
          return (
            <button key={i}
              onClick={() => window.dispatchEvent(new CustomEvent("ramble:query", { detail: { query: q } }))}
              className={linkCls}>
              {lbl}
            </button>
          );
        }
        return <span key={i}>{lbl}</span>;
      })}
    </>
  );
}

/* ─── Shared appear animation ─────────────────────────────────────────────── */
const FADE: React.CSSProperties = { animation: "fade-up 220ms ease-out both" };

/* ─── Block components ────────────────────────────────────────────────────── */

function HeadingBlock({ content, active, onComplete }: { content: string; active: boolean; onComplete: () => void }) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 160);
    return () => clearTimeout(id);
  }, [active]);
  return <h1 className="text-[20px] font-semibold leading-[28px] text-foreground" style={FADE}>{content}</h1>;
}

function SubheadingBlock({ content, active, onComplete }: { content: string; active: boolean; onComplete: () => void }) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return <p className="text-[15px] font-semibold leading-6 text-foreground" style={FADE}>{content}</p>;
}

function LabelBlock({ content, active, onComplete }: { content: string; active: boolean; onComplete: () => void }) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground" style={FADE}>
      {content}
    </p>
  );
}

function ParagraphBlock({ content, links, active, isStatic, onComplete }: {
  content: string; links?: SectionLink[]; active: boolean; isStatic: boolean; onComplete: () => void;
}) {
  const plain = useMemo(() => content.replace(/\{\{([^}]+)\}\}/g, "$1"), [content]);
  const hasLinks = !!links?.length;
  const { streamed, done } = useWordStream(plain, !isStatic && active, PARA_MS, onComplete);

  const showRich = isStatic || (hasLinks && done);

  return (
    <p className="text-[15px] leading-[26px] text-foreground">
      {showRich ? <Inline text={content} links={links} /> : streamed}
      {!isStatic && active && !done && <Cursor />}
    </p>
  );
}

function MutedBlock({ content, links, active, onComplete }: {
  content: string; links?: SectionLink[]; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 160);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <p className="text-[13px] leading-5 text-muted-foreground" style={FADE}>
      <Inline text={content} links={links} />
    </p>
  );
}

function ListBlock({ label, items, active, isStatic, onComplete }: {
  label: string; items: string[]; active: boolean; isStatic: boolean; onComplete: () => void;
}) {
  const [visible, setVisible] = useState(() => isStatic ? items.length : 0);
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;

  useEffect(() => {
    if (!active || isStatic) return;
    if (visible >= items.length) {
      const id = setTimeout(() => cbRef.current(), 140);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setVisible((v) => v + 1), visible === 0 ? 0 : 100);
    return () => clearTimeout(id);
  }, [active, isStatic, visible, items.length]);

  const count = isStatic ? items.length : visible;

  return (
    <div className="flex flex-col gap-2" style={FADE}>
      {label && <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">{label}</p>}
      <ul className="flex flex-col gap-1" style={{ paddingLeft: 18 }}>
        {items.slice(0, count).map((item, i) => (
          <li key={i} className="text-[14px] leading-6 text-foreground"
              style={{ listStyle: "disc", animation: active && !isStatic ? "fade-up 200ms ease-out both" : undefined }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AvatarQuoteBlock({ quote, name, title, company, avatar, active, isStatic, onComplete }: {
  quote: string; name: string; title: string; company: string; avatar: string;
  active: boolean; isStatic: boolean; onComplete: () => void;
}) {
  const [avatarVisible, setAvatarVisible] = useState(isStatic);
  const [quoteActive,   setQuoteActive]   = useState(false);
  const [quoteDone,     setQuoteDone]     = useState(false);
  const [attrVisible,   setAttrVisible]   = useState(isStatic);
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;

  useEffect(() => {
    if (!active) return;
    setAvatarVisible(true);
    const t = setTimeout(() => setQuoteActive(true), 100);
    return () => clearTimeout(t);
  }, [active]);

  const handleQuoteDone = useCallback(() => setQuoteDone(true), []);

  const { streamed } = useWordStream(quote, quoteActive, QUOTE_MS, handleQuoteDone);

  useEffect(() => {
    if (!quoteDone) return;
    const t1 = setTimeout(() => setAttrVisible(true), 120);
    const t2 = setTimeout(() => cbRef.current(), 380);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [quoteDone]);

  const displayed  = isStatic ? quote : streamed;
  const showCursor = !isStatic && quoteActive && !quoteDone;
  const showAttr   = isStatic || attrVisible;

  return (
    <div className="flex gap-3">
      {(isStatic || avatarVisible) && (
        <div className="shrink-0 mt-1" style={!isStatic ? FADE : undefined}>
          <Image src={avatar} alt={name} width={28} height={28}
                 className="rounded-full object-cover" style={{ width: 28, height: 28 }} />
        </div>
      )}
      <div className="flex flex-col gap-1.5 min-w-0">
        {(isStatic || avatarVisible) && (
          <p className="text-[15px] leading-[1.65] text-foreground italic">
            &ldquo;{displayed}{showCursor && <Cursor />}&rdquo;
          </p>
        )}
        {showAttr && (
          <p className="text-[13px] leading-4 text-muted-foreground"
             style={attrVisible && !isStatic ? FADE : undefined}>
            <span className="font-medium text-foreground">{name}</span>
            {" · "}{title}, {company}
          </p>
        )}
      </div>
    </div>
  );
}

function SkillTag({ text, variant = "default" }: { text: string; variant?: TagVariant }) {
  const styles: Record<TagVariant, React.CSSProperties> = {
    default: { background: "rgba(210,207,203,0.07)", color: "rgba(244,241,234,0.75)", border: "1px solid rgba(210,207,203,0.1)" },
    teal:    { background: "rgba(90,171,164,0.12)",  color: "#5AABA4",               border: "1px solid rgba(90,171,164,0.2)"  },
    clay:    { background: "rgba(184,97,63,0.1)",    color: "#C08A6B",               border: "1px solid rgba(184,97,63,0.2)"   },
  };
  return (
    <span style={{ ...styles[variant], fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 99 }}>
      {text}
    </span>
  );
}

function SkillGroupBlock({ label, skills, active, onComplete }: {
  label: string; skills: Array<{ label: string; variant: TagVariant }>; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 200);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-2" style={FADE}>
      <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => <SkillTag key={s.label} text={s.label} variant={s.variant} />)}
      </div>
    </div>
  );
}

function JobBlock({ jobTitle, company, period, bullets, active, onComplete }: {
  jobTitle: string; company: string; period: string; bullets: string[]; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 200);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-2" style={FADE}>
      <div className="flex flex-col gap-0.5">
        <p className="text-[14px] font-semibold leading-5 text-foreground">{jobTitle}</p>
        <p className="text-[12px] leading-5 text-muted-foreground">{company} · {period}</p>
      </div>
      <ul className="flex flex-col gap-1" style={{ paddingLeft: 18 }}>
        {bullets.map((b, i) => (
          <li key={i} className="text-[13px] leading-[1.65] text-foreground" style={{ listStyle: "disc" }}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function DividerBlock({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 60);
    return () => clearTimeout(id);
  }, [active]);
  return <div className="h-px" style={{ background: "rgba(210,207,203,0.08)", ...FADE }} />;
}

function OutroBlock({ content, links }: { content: string; links: SectionLink[] }) {
  return (
    <p className="text-[15px] leading-[26px] text-foreground" style={FADE}>
      <Inline text={content} links={links} teal />
    </p>
  );
}

function ImageBlock({ src, alt, aspectRatio, height, active, onComplete }: {
  src: string; alt: string; aspectRatio?: string; height?: number; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="w-full rounded-xl object-cover"
      style={{ ...FADE, aspectRatio, height }}
    />
  );
}

function parseRatio(aspectRatio?: string): number {
  if (!aspectRatio) return 1;
  const [w, h] = aspectRatio.split("/").map(Number);
  return w && h && h > 0 ? w / h : 1;
}

function ImageGridBlock({ images, columns, active, onComplete }: {
  images: Array<{ src: string; alt: string; aspectRatio?: string; columnLabel?: string; caption?: { title: string; body: string; theme?: "neutral" | "teal" | "teal-dark" } }>; columns?: 2 | 3 | 4; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);

  if (columns) {
    return (
      <div style={{ ...FADE, display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 12 }}>
        {images.map((img, i) => {
          const cap = img.caption;
          const capBg = cap?.theme === "teal" ? "#2dd4bf" : cap?.theme === "teal-dark" ? "#042f2e" : "rgba(210,207,203,0.07)";
          const capFg = cap?.theme === "teal" ? "#134e4a" : cap?.theme === "teal-dark" ? "#5eead4" : "var(--foreground)";
          const capBodyFg = cap?.theme === "teal" ? "rgba(19,78,74,0.7)" : cap?.theme === "teal-dark" ? "rgba(94,234,212,0.7)" : "rgba(210,207,203,0.55)";
          return (
            <div key={i} className="flex flex-col items-center">
              {img.columnLabel && (
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 8, width: "100%", textAlign: "center" }}>
                  {img.columnLabel}
                </p>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full rounded-xl object-cover" style={{ aspectRatio: img.aspectRatio }} />
              {cap && (
                <>
                  <div style={{ width: 1, height: 40, background: "var(--border)" }} />
                  <div style={{ background: capBg, borderRadius: 8, padding: "8px", textAlign: "center", width: "100%" }}>
                    <p style={{ fontWeight: 600, fontSize: 12, lineHeight: "16px", color: capFg }}>{cap.title}</p>
                    <p style={{ fontSize: 12, lineHeight: "16px", color: capBodyFg, marginTop: 2 }}>{cap.body}</p>
                  </div>
                  {/* spacer pushes connector to cell bottom so it aligns with token-arch top */}
                  <div style={{ flex: 1 }} />
                  <div style={{ width: 1, height: 24, background: "var(--border)" }} />
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-4" style={{ ...FADE, alignItems: "flex-start" }}>
      {images.map((img, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className="min-w-0 rounded-xl object-cover"
          style={{ flex: `${parseRatio(img.aspectRatio)} 1 0`, aspectRatio: img.aspectRatio }}
        />
      ))}
    </div>
  );
}

const CALLOUT_COLORS: Record<string, { bg: string; fg: string; bodyFg: string }> = {
  neutral:      { bg: "rgba(210,207,203,0.08)", fg: "var(--foreground)",   bodyFg: "rgba(210,207,203,0.55)"  },
  orange:       { bg: "#431407",                fg: "#fb923c",             bodyFg: "rgba(251,146,60,0.65)"   },
  emerald:      { bg: "#022c22",                fg: "#34d399",             bodyFg: "rgba(52,211,153,0.65)"   },
  "teal-dark":  { bg: "#042f2e",                fg: "#2dd4bf",             bodyFg: "rgba(45,212,191,0.65)"   },
  "teal-light": { bg: "#99f6e4",                fg: "#042f2e",             bodyFg: "rgba(4,47,46,0.65)"      },
  "teal-mid":   { bg: "#0f766e",                fg: "#ccfbf1",             bodyFg: "rgba(204,251,241,0.65)"  },
};

function CalloutStackBlock({ items, footer, active, onComplete }: {
  items: Array<{ label: string; body: string; theme: string }>; footer?: string; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="flex flex-col items-center w-full" style={FADE}>
      {items.map((item, i) => {
        const c = CALLOUT_COLORS[item.theme] ?? CALLOUT_COLORS.neutral;
        return (
          <div key={i} className="w-full flex flex-col">
            <div style={{ background: c.bg, borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
              <p style={{ fontWeight: 600, fontSize: 16, lineHeight: "24px", color: c.fg }}>{item.label}</p>
              <p style={{ fontSize: 14, lineHeight: "20px", color: c.bodyFg, marginTop: 2 }}>{item.body}</p>
            </div>
            {i < items.length - 1 && (
              <div className="self-center" style={{ width: 1, height: 40, background: "var(--border)" }} />
            )}
          </div>
        );
      })}
      {footer && (
        <>
          <div style={{ width: 1, height: 40, background: "var(--border)" }} />
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "8px 20px" }}>
            <p style={{ fontSize: 14, lineHeight: "20px", color: "rgba(210,207,203,0.55)", textAlign: "center" }}>{footer}</p>
          </div>
        </>
      )}
    </div>
  );
}

function MetaBlock({ lines, active, onComplete }: {
  lines: Array<{ label: string; value: string }>; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-1.5 text-[15px] leading-[25px] text-foreground" style={FADE}>
      {lines.map((line) => (
        <p key={line.label}>
          <span className="font-semibold">{line.label}:</span>{" "}{line.value}
        </p>
      ))}
    </div>
  );
}

function isColorValue(v: string) {
  const t = v.trim();
  return /^#[0-9A-Fa-f]{3,8}$/.test(t) || /^rgba?\s*\(/.test(t);
}

function TableCell({ value, bold }: { value: string; bold: boolean }) {
  const color = isColorValue(value);
  return (
    <span className={`inline-flex items-center gap-2 ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
      {color && (
        <span
          className="inline-block w-3.5 h-3.5 rounded-full shrink-0 border"
          style={{ background: value.trim(), borderColor: "rgba(210,207,203,0.2)" }}
        />
      )}
      {value}
    </span>
  );
}

function TableBlock({ label, headers, rows, active, onComplete }: {
  label?: string; headers: string[]; rows: string[][]; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-2" style={FADE}>
      {label && <p className="text-[15px] font-semibold leading-6 text-foreground">{label}</p>}
      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}
                  className="px-4 py-2.5 text-left font-medium text-[11px] uppercase tracking-wider"
                  style={{ color: "rgba(210,207,203,0.5)", background: "rgba(210,207,203,0.04)", borderBottom: "1px solid rgba(210,207,203,0.10)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}
                    className="px-4 py-3 align-top"
                    style={{ borderBottom: "1px solid rgba(210,207,203,0.06)" }}>
                    <TableCell value={cell} bold={ci === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Minimal hand-rolled syntax color pass (no external highlighter dep) ─── */
const TS_KEYWORDS = new Set([
  "function", "const", "let", "var", "return", "if", "else", "new", "import", "from",
  "export", "default", "interface", "type", "extends", "void", "null", "undefined",
  "true", "false", "typeof", "as",
]);
const TS_HOOKS = new Set(["useState", "useEffect", "useMemo", "useRef", "useCallback", "useContext", "useReducer"]);

function highlightCode(code: string): React.ReactNode[] {
  const tokenRe = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|([A-Za-z_$][\w$]*)|([^\s\w]+)|(\s+)/g;
  const nodes: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = tokenRe.exec(code))) {
    const [, comment, str, num, ident, punct, ws] = match;
    const text = comment ?? str ?? num ?? ident ?? punct ?? ws ?? "";
    let color = "rgba(244,241,234,0.85)";
    let fontStyle: React.CSSProperties["fontStyle"];
    if (comment)                          { color = "rgba(210,207,203,0.4)"; fontStyle = "italic"; }
    else if (str)                         { color = "#C08A6B"; }
    else if (num)                         { color = "#34d399"; }
    else if (ident && TS_HOOKS.has(ident)) { color = "#2DD4BF"; }
    else if (ident && TS_KEYWORDS.has(ident)) { color = "#FDBA74"; }
    else if (punct)                       { color = "rgba(210,207,203,0.55)"; }
    nodes.push(<span key={key++} style={{ color, fontStyle }}>{text}</span>);
  }
  return nodes;
}

function CodeBlock({ label, language, code, active, onComplete }: {
  label?: string; language?: string; code: string; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-2" style={FADE}>
      {label && <p className="text-[13px] font-semibold leading-5 text-foreground">{label}</p>}
      <div className="w-full overflow-x-auto rounded-xl border border-border" style={{ background: "rgba(210,207,203,0.03)" }}>
        {language && (
          <div className="px-4 py-1.5 text-[11px] uppercase tracking-wider"
               style={{ color: "rgba(210,207,203,0.4)", borderBottom: "1px solid rgba(210,207,203,0.08)" }}>
            {language}
          </div>
        )}
        <pre className="px-4 py-3 text-[12.5px] leading-[1.7] font-mono text-foreground/90 whitespace-pre">
          <code>{highlightCode(code)}</code>
        </pre>
      </div>
    </div>
  );
}

function SplitBlock({ heading, content, src, alt, aspectRatio, active, onComplete }: {
  heading?: string; content: string; src: string; alt: string; aspectRatio?: string;
  active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 120);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex gap-5 items-start" style={FADE}>
      <div className="flex flex-col gap-2 min-w-0" style={{ flex: "1 1 0" }}>
        {heading && <p className="text-[15px] font-semibold leading-6 text-foreground">{heading}</p>}
        <p className="text-[14px] leading-[26px] text-foreground">{content}</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="rounded-xl object-cover min-w-0" style={{ flex: "0 0 44%", aspectRatio }} />
    </div>
  );
}

function StepsBlock({ label, items, active, onComplete }: {
  label?: string; items: string[]; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 150);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-3" style={FADE}>
      {label && <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">{label}</p>}
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold leading-none"
              style={{ background: "rgba(45,212,191,0.12)", color: "var(--brand-teal-400)" }}
            >
              {i + 1}
            </span>
            <span className="text-[14px] leading-6 text-foreground pt-0.5">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaBlock({ name, meta, quote, goals, frustrations, active, onComplete }: {
  name: string; meta: string; quote: string; goals: string[]; frustrations: string[];
  active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 150);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div className="flex flex-col gap-4 rounded-2xl p-5" style={{ ...FADE, background: "rgba(210,207,203,0.03)", border: "1px solid rgba(210,207,203,0.08)" }}>
      <div className="flex flex-col gap-0.5">
        <p className="text-[15px] font-semibold leading-5 text-foreground">{name}</p>
        <p className="text-[13px] leading-5 text-muted-foreground">{meta}</p>
      </div>
      <p className="text-[14px] leading-6 italic" style={{ color: "rgba(244,241,234,0.85)" }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Goals</p>
          <ul className="flex flex-col gap-1" style={{ paddingLeft: 16 }}>
            {goals.map((g, i) => (
              <li key={i} className="text-[13px] leading-5 text-foreground" style={{ listStyle: "disc" }}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Frustrations</p>
          <ul className="flex flex-col gap-1" style={{ paddingLeft: 16 }}>
            {frustrations.map((f, i) => (
              <li key={i} className="text-[13px] leading-5 text-foreground" style={{ listStyle: "disc" }}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini table used inside TokenArchBlock ──────────────────────────────── */
function MiniTable({ headers, rows }: {
  headers: [string, string];
  rows: Array<{ label: string; color: string }>;
}) {
  const borderColor = "rgba(210,207,203,0.10)";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}` }}>
        {headers.map((h) => (
          <div key={h} style={{ flex: 1, padding: "4px 6px", fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)" }}>{h}</div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", borderBottom: i < rows.length - 1 ? `1px solid ${borderColor}` : undefined }}>
          <div style={{ flex: 1, padding: "6px 6px", fontSize: 12, color: "var(--foreground)" }}>{row.label}</div>
          <div style={{ flex: 1, padding: "6px 6px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: row.color, border: "1px solid rgba(210,207,203,0.15)", flexShrink: 0 }} />
            <span style={{ display: "inline-block", width: 40, height: 8, borderRadius: 4, background: "rgba(210,207,203,0.18)", flexShrink: 0 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BadgeFlowBlock({ steps, result, active, onComplete }: {
  steps: string[]; result: string; active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);

  const iconColor = "rgba(210,207,203,0.4)";
  const items: React.ReactNode[] = [];
  steps.forEach((step, i) => {
    items.push(
      <span key={`s${i}`} className="rounded-lg px-2.5 py-1 text-[13px] font-semibold leading-none"
        style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
        {step}
      </span>
    );
    items.push(<ArrowRight key={`a${i}`} size={11} aria-hidden style={{ color: iconColor }} />);
  });
  items.push(<Equal key="eq" size={11} aria-hidden style={{ color: iconColor }} />);
  items.push(
    <span key="result" className="rounded-lg px-2.5 py-1 text-[13px] font-semibold leading-none"
      style={{ background: "var(--brand-teal-950)", color: "var(--brand-teal-400)" }}>
      {result}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-2" style={FADE}>
      {items}
    </div>
  );
}

function TokenArchBlock({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div style={{ ...FADE, marginTop: -16 }}>
      {/* 3 connector lines — same grid as image-grid (repeat(3,1fr) gap:12) so centers align */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 1, height: 24, background: "var(--border)" }} />
          </div>
        ))}
      </div>
      {/* Card */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-teal-400)", marginBottom: 4 }}>
          Token Architecture
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, lineHeight: "24px", color: "var(--foreground)" }}>
          Primitive / Semantic / Component
        </p>
        <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--muted-foreground)", marginTop: 2, marginBottom: 14 }}>
          Shared foundation layers
        </p>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, background: "var(--secondary)", borderRadius: 10, padding: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Primitive</p>
            <MiniTable
              headers={["Color", "Value"]}
              rows={[
                { label: "950", color: "#10100E" },
                { label: "900", color: "#191715" },
                { label: "800", color: "#262421" },
                { label: "700", color: "#3D3936" },
              ]}
            />
          </div>
          <div style={{ flex: 1, background: "var(--secondary)", borderRadius: 10, padding: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Semantic</p>
            <MiniTable
              headers={["Type", "Value"]}
              rows={[
                { label: "Surface",    color: "rgba(255,255,255,0.04)" },
                { label: "Card",       color: "rgba(210,207,203,0.06)" },
                { label: "Foreground", color: "#F6F5F4" },
                { label: "Link",       color: "#2DD4BF" },
              ]}
            />
          </div>
        </div>
        <div style={{ background: "var(--secondary)", borderRadius: 10, padding: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Component</p>
          <MiniTable
            headers={["Button", "Value"]}
            rows={[
              { label: "Background", color: "rgba(45,212,191,0.12)" },
              { label: "Border",     color: "rgba(45,212,191,0.25)" },
              { label: "Icon",       color: "#2DD4BF" },
              { label: "Label",      color: "#2DD4BF" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function SplitStackBlock({ left, right, active, onComplete }: {
  left: Array<{ src: string; alt: string; aspectRatio?: string }>;
  right: { src: string; alt: string; aspectRatio?: string };
  active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div style={{ ...FADE, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minHeight: 480 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        {left.map((img, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={i} src={img.src} alt={img.alt}
            className="rounded-xl"
            style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover" }} />
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={right.src} alt={right.alt}
        className="rounded-xl"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function TextGalleryBlock({ heading, content, images, active, onComplete }: {
  heading?: string; content: string; images: Array<{ src: string; alt: string; aspectRatio?: string; span?: boolean }>;
  active: boolean; onComplete: () => void;
}) {
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => cbRef.current(), 100);
    return () => clearTimeout(id);
  }, [active]);
  return (
    <div style={{ ...FADE, display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 0", minWidth: 0 }}>
        {heading && (
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: "24px", color: "var(--foreground)", marginBottom: 6 }}>{heading}</p>
        )}
        <p style={{ fontSize: 14, lineHeight: "22px", color: "var(--muted-foreground)" }}>{content}</p>
      </div>
      <div style={{ flex: "1 1 0", minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {images.map((img, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={i} src={img.src} alt={img.alt}
            className="rounded-xl"
            style={{ gridColumn: img.span ? "1 / -1" : undefined, width: "100%", aspectRatio: img.aspectRatio, objectFit: "cover", display: "block" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Block dispatcher ────────────────────────────────────────────────────── */
function Block({ section, active, isStatic, onComplete }: {
  section: Section; active: boolean; isStatic: boolean; onComplete: () => void;
}) {
  switch (section.type) {
    case "heading":
      return <HeadingBlock     content={section.content} active={active} onComplete={onComplete} />;
    case "subheading":
      return <SubheadingBlock  content={section.content} active={active} onComplete={onComplete} />;
    case "label":
      return <LabelBlock       content={section.content} active={active} onComplete={onComplete} />;
    case "paragraph":
      return <ParagraphBlock   content={section.content} links={section.links} active={active} isStatic={isStatic} onComplete={onComplete} />;
    case "muted":
      return <MutedBlock       content={section.content} links={section.links} active={active} onComplete={onComplete} />;
    case "list":
      return <ListBlock        label={section.label} items={section.items} active={active} isStatic={isStatic} onComplete={onComplete} />;
    case "skill-group":
      return <SkillGroupBlock  label={section.label} skills={section.skills} active={active} onComplete={onComplete} />;
    case "job":
      return <JobBlock         jobTitle={section.jobTitle} company={section.company} period={section.period} bullets={section.bullets} active={active} onComplete={onComplete} />;
    case "avatar-quote":
      return <AvatarQuoteBlock quote={section.quote} name={section.name} title={section.title} company={section.company} avatar={section.avatar} active={active} isStatic={isStatic} onComplete={onComplete} />;
    case "image":
      return <ImageBlock       src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} height={section.height} active={active} onComplete={onComplete} />;
    case "image-grid":
      return <ImageGridBlock   images={section.images} columns={section.columns} active={active} onComplete={onComplete} />;
    case "meta":
      return <MetaBlock        lines={section.lines} active={active} onComplete={onComplete} />;
    case "table":
      return <TableBlock       label={section.label} headers={section.headers} rows={section.rows} active={active} onComplete={onComplete} />;
    case "split":
      return <SplitBlock       heading={section.heading} content={section.content} src={section.src} alt={section.alt} aspectRatio={section.aspectRatio} active={active} onComplete={onComplete} />;
    case "steps":
      return <StepsBlock       label={section.label} items={section.items} active={active} onComplete={onComplete} />;
    case "persona":
      return <PersonaBlock     name={section.name} meta={section.meta} quote={section.quote} goals={section.goals} frustrations={section.frustrations} active={active} onComplete={onComplete} />;
    case "callout-stack":
      return <CalloutStackBlock items={section.items} footer={section.footer} active={active} onComplete={onComplete} />;
    case "badge-flow":
      return <BadgeFlowBlock steps={section.steps} result={section.result} active={active} onComplete={onComplete} />;
    case "token-arch":
      return <TokenArchBlock active={active} onComplete={onComplete} />;
    case "split-stack":
      return <SplitStackBlock left={section.left} right={section.right} active={active} onComplete={onComplete} />;
    case "text-gallery":
      return <TextGalleryBlock heading={section.heading} content={section.content} images={section.images} active={active} onComplete={onComplete} />;
    case "code":
      return <CodeBlock         label={section.label} language={section.language} code={section.code} active={active} onComplete={onComplete} />;
    case "divider":
      return <DividerBlock active={active} onComplete={onComplete} />;
    case "outro":
      return <OutroBlock content={section.content} links={section.links} />;
    default:
      return null;
  }
}

/* ─── StreamEngine ────────────────────────────────────────────────────────── */
export default function StreamEngine({
  sections,
  isStatic = false,
}: {
  sections: Section[];
  isStatic?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const advance = useCallback(() => setActiveIndex((i) => i + 1), []);
  const visibleCount = Math.min(activeIndex + 1, sections.length);

  if (isStatic) {
    return (
      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <Block key={s.id} section={s} active={false} isStatic onComplete={() => {}} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.slice(0, visibleCount).map((s, i) => (
        <Block
          key={s.id}
          section={s}
          active={i === activeIndex}
          isStatic={false}
          onComplete={advance}
        />
      ))}
    </div>
  );
}
