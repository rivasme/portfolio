"use client";

import { useState, useEffect, useRef } from "react";
import AppShell from "@/components/shell/app-shell";

/* ─── Icons ────────────────────────────────────────────────────────────────── */
function DocIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CodeBracketsIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}

/* ─── Types ────────────────────────────────────────────────────────────────── */
type ArtifactType = "MD" | "CODE";

interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  hoursAgo: number;
  content: string;
}

/* ─── Markdown renderer ────────────────────────────────────────────────────── */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

function MdContent({ content }: { content: string }) {
  const fg = "var(--foreground)";
  const muted = "var(--muted-foreground)";
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={`ul-${key}`} style={{ margin: "0 0 14px 20px", padding: 0 }}>
        {listItems.map((item, idx) => (
          <li key={idx} style={{ fontSize: 14, lineHeight: 1.65, color: fg, marginBottom: 4 }}>
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith("### ")) {
      flushList(i);
      nodes.push(<h3 key={i} style={{ margin: "20px 0 6px", fontSize: 14, fontWeight: 600, color: fg }}>{t.slice(4)}</h3>);
    } else if (t.startsWith("## ")) {
      flushList(i);
      nodes.push(<h2 key={i} style={{ margin: "24px 0 8px", fontSize: 16, fontWeight: 600, color: fg }}>{t.slice(3)}</h2>);
    } else if (t.startsWith("# ")) {
      flushList(i);
      nodes.push(<h1 key={i} style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: fg }}>{t.slice(2)}</h1>);
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      listItems.push(t.slice(2));
    } else if (t.startsWith("> ")) {
      flushList(i);
      nodes.push(
        <blockquote key={i} style={{
          margin: "12px 0", paddingLeft: 14, fontSize: 14, lineHeight: 1.65,
          borderLeft: "2px solid rgba(210,207,203,0.2)", color: muted,
          fontStyle: "italic",
        }}>
          {renderInline(t.slice(2))}
        </blockquote>
      );
    } else if (t === "---") {
      flushList(i);
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid rgba(210,207,203,0.12)", margin: "20px 0" }} />);
    } else if (t === "") {
      flushList(i);
    } else {
      flushList(i);
      nodes.push(<p key={i} style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.65, color: fg }}>{renderInline(t)}</p>);
    }
  });
  flushList(lines.length);

  return <div>{nodes}</div>;
}

/* ─── Code tokenizer ───────────────────────────────────────────────────────── */
type TokenType = "keyword" | "string" | "comment" | "number" | "fn" | "op" | "plain";

const JS_KEYWORDS = new Set([
  "import","export","default","from","as","const","let","var","function",
  "return","if","else","for","while","do","switch","case","break","continue",
  "new","class","extends","this","typeof","instanceof","true","false","null",
  "undefined","async","await","of","in","void","try","catch","finally","throw",
  "static","get","set","delete","super","with","yield","debugger",
]);

const REACT_APIS = new Set([
  "useState","useEffect","useRef","useMemo","useCallback",
  "useContext","useReducer","useLayoutEffect",
]);

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "#7EC8C8",
  string:  "#9DC09A",
  comment: "rgba(161,157,150,0.42)",
  number:  "#CF9261",
  fn:      "#DBBC7A",
  op:      "rgba(210,207,203,0.5)",
  plain:   "rgba(244,241,234,0.85)",
};

function tokenize(src: string): Array<{ type: TokenType; text: string }> {
  const out: Array<{ type: TokenType; text: string }> = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    // Line comment
    if (ch === "/" && src[i + 1] === "/") {
      const end = src.indexOf("\n", i);
      out.push({ type: "comment", text: end === -1 ? src.slice(i) : src.slice(i, end) });
      i = end === -1 ? src.length : end;
    // Block comment
    } else if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      out.push({ type: "comment", text: end === -1 ? src.slice(i) : src.slice(i, end + 2) });
      i = end === -1 ? src.length : end + 2;
    // Quoted string
    } else if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== ch && src[j] !== "\n") {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ type: "string", text: src.slice(i, j + 1) });
      i = j + 1;
    // Template literal
    } else if (ch === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== "`") {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ type: "string", text: src.slice(i, j + 1) });
      i = j + 1;
    // Identifier / keyword
    } else if (/[A-Za-z_$]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[A-Za-z_$0-9]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const type: TokenType = JS_KEYWORDS.has(word)
        ? "keyword"
        : (REACT_APIS.has(word) || src[j] === "(")
          ? "fn"
          : "plain";
      out.push({ type, text: word });
      i = j;
    // Number
    } else if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[0-9._xXaAbBcCdDeEfF]/.test(src[j])) j++;
      out.push({ type: "number", text: src.slice(i, j) });
      i = j;
    // Operators & punctuation
    } else if (/[=+\-*/<>!&|^~%?:,;.{}()[\]]/.test(ch)) {
      out.push({ type: "op", text: ch });
      i++;
    } else {
      out.push({ type: "plain", text: ch });
      i++;
    }
  }
  return out;
}

function CodeHighlight({ content }: { content: string }) {
  const tokens = tokenize(content);
  return (
    <pre style={{
      margin: 0, padding: "20px 24px",
      fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
      fontSize: 12, lineHeight: 1.7,
      background: "transparent",
      whiteSpace: "pre-wrap", wordBreak: "break-all",
    }}>
      <code>
        {tokens.map((tok, idx) => (
          <span key={idx} style={{ color: TOKEN_COLORS[tok.type] }}>{tok.text}</span>
        ))}
      </code>
    </pre>
  );
}

/* ─── Artifact sheet ───────────────────────────────────────────────────────── */
function ArtifactSheet({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setTimeout(onClose, 200);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 200);
  };

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
          width: "min(580px, 92vw)",
          background: "#1F1E1D",
          borderLeft: "1px solid rgba(210,207,203,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 200ms ease",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", flexShrink: 0,
          borderBottom: "1px solid rgba(210,207,203,0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--foreground)", minWidth: 0 }}>
            {artifact.type === "MD" ? <DocIcon /> : <CodeBracketsIcon />}
            <span style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {artifact.title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99,
              ...(artifact.type === "CODE"
                ? { background: "rgba(90,171,164,0.15)", color: "#5AABA4" }
                : { background: "rgba(210,207,203,0.1)", color: "var(--muted-foreground)" }
              ),
            }}>
              {artifact.type}
            </span>
            <button
              onClick={handleClose}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 6,
                color: "var(--muted-foreground)", display: "flex", alignItems: "center",
                borderRadius: 6,
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {artifact.type === "MD" ? (
            <div style={{ padding: "24px 24px 32px" }}>
              <MdContent content={artifact.content} />
            </div>
          ) : (
            <CodeHighlight content={artifact.content} />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Content strings ──────────────────────────────────────────────────────── */

const COMPLIANCE_TIERING_JSX = `import { useState } from "react";

/**
 * Hithe: Compliance Tiering Visualizer
 * --------------------------------------
 * The IA teardown flagged that Approvals and Compliance tiering, the two
 * flows doing the real regulatory work in this product, didn't carry the
 * visual weight that work should command. They read like secondary settings.
 *
 * This artifact is the fix applied directly: a request's classification
 * and routing path made into the centerpiece, not a buried detail.
 */

const palette = {
  charcoal900: "#1F1E1D",
  charcoal800: "#2A2927",
  charcoal700: "#3D3B38",
  cream100: "#F4F1EA",
  cream200: "#E8E3D8",
  slate400: "#8B8983",
  clay500: "#B8613F",
  red500: "#C0413A",
  amber500: "#C08A3A",
  green500: "#4C7A5E",
};

const tiers = {
  phi: {
    label: "PHI",
    fullLabel: "Protected Health Information",
    color: palette.red500,
    requiresApproval: true,
    baaRequired: true,
    description: "Patient identifiers, diagnoses, treatment records. Routed only to providers with an active BAA on file.",
  },
  pii: {
    label: "PII",
    fullLabel: "Personally Identifiable Information",
    color: palette.amber500,
    requiresApproval: true,
    baaRequired: false,
    description: "Names, emails, account identifiers. Requires reviewer approval before an application can send this tier upstream.",
  },
  public: {
    label: "Public",
    fullLabel: "Public / De-identified",
    color: palette.green500,
    requiresApproval: false,
    baaRequired: false,
    description: "No protected or personal data detected. Routes directly to the configured upstream provider.",
  },
};

const sampleRequests = [
  { id: "req_4471", app: "Intake Assistant", snippet: "Patient reports persistent lower back pain since...", tier: "phi" },
  { id: "req_4472", app: "Scheduling Bot", snippet: "Please confirm appointment for jane.doe@email.com", tier: "pii" },
  { id: "req_4473", app: "FAQ Widget", snippet: "What are your office hours on weekends?", tier: "public" },
];

export default function ComplianceTiering() {
  const [selectedTier, setSelectedTier] = useState("phi");
  const [activeRequest, setActiveRequest] = useState(sampleRequests[0]);

  const tier = tiers[activeRequest.tier];

  return (
    <div
      style={{
        background: palette.charcoal900,
        color: palette.cream100,
        fontFamily: "system-ui, sans-serif",
        padding: "32px",
        borderRadius: "12px",
        maxWidth: "720px",
      }}
    >
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: palette.slate400, marginBottom: "4px" }}>
        Hithe
      </div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 600 }}>
        Compliance tiering, given the visual weight it earns
      </h3>
      <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: palette.cream200, lineHeight: 1.5, maxWidth: "560px" }}>
        Every request through the gateway gets classified before it's allowed to route
        upstream. The audit found this flow under-weighted in the original product.
        Here, it's the centerpiece.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {sampleRequests.map((req) => (
          <button
            key={req.id}
            onClick={() => setActiveRequest(req)}
            style={{
              flex: 1,
              textAlign: "left",
              background: activeRequest.id === req.id ? palette.charcoal700 : palette.charcoal800,
              border: \`1px solid \${activeRequest.id === req.id ? tiers[req.tier].color : "#3D3B38"}\`,
              borderRadius: "8px",
              padding: "10px 12px",
              cursor: "pointer",
              color: palette.cream100,
            }}
          >
            <div style={{ fontSize: "11px", color: palette.slate400, marginBottom: "4px" }}>{req.app}</div>
            <div style={{ fontSize: "12px", color: palette.cream200 }}>
              {req.snippet.length > 38 ? req.snippet.slice(0, 38) + "..." : req.snippet}
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          background: palette.charcoal800,
          borderRadius: "10px",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ textAlign: "center", flex: "0 0 auto" }}>
          <div style={{ fontSize: "10px", color: palette.slate400, marginBottom: "6px" }}>REQUEST</div>
          <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: palette.charcoal700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            📄
          </div>
        </div>

        <Arrow />

        <div style={{ textAlign: "center", flex: "0 0 auto" }}>
          <div style={{ fontSize: "10px", color: palette.slate400, marginBottom: "6px" }}>CLASSIFIED AS</div>
          <div
            style={{
              width: "88px",
              height: "64px",
              borderRadius: "8px",
              background: \`\${tier.color}22\`,
              border: \`2px solid \${tier.color}\`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "15px",
              color: tier.color,
            }}
          >
            {tier.label}
          </div>
        </div>

        <Arrow />

        <div style={{ textAlign: "center", flex: "0 0 auto" }}>
          <div style={{ fontSize: "10px", color: palette.slate400, marginBottom: "6px" }}>APPROVAL</div>
          <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: palette.charcoal700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
            {tier.requiresApproval ? "🔒" : "✓"}
          </div>
          <div style={{ fontSize: "10px", color: palette.slate400, marginTop: "4px" }}>
            {tier.requiresApproval ? "Required" : "Not needed"}
          </div>
        </div>

        <Arrow />

        <div style={{ textAlign: "center", flex: "1 1 auto" }}>
          <div style={{ fontSize: "10px", color: palette.slate400, marginBottom: "6px" }}>UPSTREAM ROUTE</div>
          <div style={{ borderRadius: "8px", background: palette.charcoal700, padding: "10px 12px", fontSize: "12px" }}>
            {tier.baaRequired ? "BAA-registered providers only" : "Standard provider pool"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "16px",
          background: \`\${tier.color}15\`,
          border: \`1px solid \${tier.color}\`,
          borderRadius: "8px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: "13px", color: tier.color, marginBottom: "4px" }}>
          {tier.fullLabel}
        </div>
        <div style={{ fontSize: "12px", color: palette.cream200, lineHeight: 1.5 }}>
          {tier.description}
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ color: "#8B8983", fontSize: "16px", flex: "0 0 auto" }}>→</div>
  );
}`;

const ODDS_SIMULATOR_JSX = `import { useState, useMemo } from "react";

/**
 * Sole Lucky: Odds Simulator
 * --------------------------
 * The core product insight from the Sole Lucky case study wasn't the
 * raffle mechanic itself, every competitor has one. It was that the
 * raffle mechanic had no visible fairness signal, which is what the
 * competitive audit found breaks user trust across the category.
 *
 * This demo makes the points-based odds system tangible: entries alone
 * give you a shot, but consistent participation compounds your odds
 * over time, and the math is visible instead of hidden behind a black box.
 */

const palette = {
  charcoal900: "#1F1E1D",
  charcoal800: "#2A2927",
  clay500: "#B8613F",
  cream100: "#F4F1EA",
  cream200: "#E8E3D8",
  slate400: "#8B8983",
  green500: "#4C7A5E",
};

function calculateTickets(streak) {
  const base = 1;
  const loyalty = Math.min(streak * 0.5, 5);
  return base + loyalty;
}

export default function OddsSimulator() {
  const [streak, setStreak] = useState(0);
  const [poolSize, setPoolSize] = useState(4000);
  const [winnersCount, setWinnersCount] = useState(50);

  const yourTickets = calculateTickets(streak);
  const estimatedTotalTickets = poolSize * calculateTickets(streak > 3 ? 1.5 : 0.5);

  const odds = useMemo(() => {
    const chance = (yourTickets / estimatedTotalTickets) * winnersCount;
    return Math.min(chance * 100, 100);
  }, [yourTickets, estimatedTotalTickets, winnersCount]);

  return (
    <div
      style={{
        background: palette.charcoal900,
        color: palette.cream100,
        fontFamily: "system-ui, sans-serif",
        padding: "32px",
        borderRadius: "12px",
        maxWidth: "640px",
      }}
    >
      <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: palette.slate400, marginBottom: "4px" }}>
        Sole Lucky
      </div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 600 }}>
        Points-based odds, made visible
      </h3>
      <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: palette.cream200, lineHeight: 1.5, maxWidth: "480px" }}>
        Every competitor reviewed in the audit runs a raffle. None of them show you why
        your odds are what they are. This model rewards showing up consistently, and
        shows the math instead of hiding it.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: palette.cream200, marginBottom: "8px" }}>
            Your entry streak: <strong>{streak}</strong> raffles
          </label>
          <input
            type="range" min="0" max="10" value={streak}
            onChange={(e) => setStreak(Number(e.target.value))}
            style={{ width: "100%", accentColor: palette.clay500 }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: palette.cream200, marginBottom: "8px" }}>
            Total entrants: <strong>{poolSize.toLocaleString()}</strong>
          </label>
          <input
            type="range" min="500" max="10000" step="500" value={poolSize}
            onChange={(e) => setPoolSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: palette.clay500 }}
          />
        </div>
      </div>

      <div
        style={{
          background: palette.charcoal800,
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: palette.slate400, marginBottom: "4px" }}>Your tickets in this drop</div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>{yourTickets.toFixed(1)}</div>
          <div style={{ fontSize: "11px", color: palette.slate400, marginTop: "2px" }}>
            1 base + {(yourTickets - 1).toFixed(1)} loyalty
          </div>
        </div>

        <div style={{ width: "1px", height: "48px", background: "#3D3B38" }} />

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: palette.slate400, marginBottom: "4px" }}>Estimated odds this drop</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: palette.green500 }}>
            {odds < 1 ? odds.toFixed(2) : odds.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px", fontSize: "12px", color: palette.slate400, lineHeight: 1.6 }}>
        Loyalty tickets cap at +5, so streaks build real odds without ever guaranteeing
        a win, no one gets an automatic pair, but showing up consistently is worth
        something concrete and visible, which is the trust signal the category was missing.
      </div>
    </div>
  );
}`;

const TOKEN_SYSTEM_DEMO_JSX = `import { useState } from "react";

/**
 * Token System Demo
 * ------------------
 * A working demonstration of the Primitive -> Semantic -> Component
 * token architecture described in the token-architecture case study.
 *
 * The point of this artifact: change a semantic token, watch every
 * component consuming that role update at once. This is the fix for
 * the organism-level drift problem, made visible instead of described.
 */

const primitives = {
  clay500: "#B8613F",
  clay600: "#9C4F32",
  clay700: "#7A3D26",
  charcoal900: "#1F1E1D",
  charcoal800: "#2A2927",
  charcoal700: "#3D3B38",
  cream100: "#F4F1EA",
  cream200: "#E8E3D8",
  slate400: "#8B8983",
  red500: "#C0413A",
  green500: "#4C7A5E",
};

const semanticOptions = {
  "accent-primary": {
    label: "Accent / Primary",
    options: { "clay500": primitives.clay500, "clay600": primitives.clay600, "clay700": primitives.clay700 },
    current: "clay500",
  },
  "surface-base": {
    label: "Surface / Base",
    options: { "charcoal900": primitives.charcoal900, "charcoal800": primitives.charcoal800 },
    current: "charcoal900",
  },
  "surface-raised": {
    label: "Surface / Raised",
    options: { "charcoal800": primitives.charcoal800, "charcoal700": primitives.charcoal700 },
    current: "charcoal800",
  },
  "text-primary": {
    label: "Text / Primary",
    options: { "cream100": primitives.cream100, "cream200": primitives.cream200 },
    current: "cream100",
  },
  "border-subtle": {
    label: "Border / Subtle",
    options: { "slate400": primitives.slate400, "charcoal700": primitives.charcoal700 },
    current: "slate400",
  },
};

const componentMap = {
  "button-primary-bg": "accent-primary",
  "button-primary-text": "text-primary",
  "card-bg": "surface-raised",
  "card-border": "border-subtle",
  "card-text": "text-primary",
  "input-bg": "surface-base",
  "input-border": "border-subtle",
  "input-text": "text-primary",
};

export default function TokenSystemDemo() {
  const [semantics, setSemantics] = useState(
    Object.fromEntries(
      Object.entries(semanticOptions).map(([key, val]) => [key, val.current])
    )
  );
  const [showDrift, setShowDrift] = useState(false);

  const resolve = (semanticKey) => {
    const primitiveKey = semantics[semanticKey];
    return semanticOptions[semanticKey].options[primitiveKey];
  };

  const componentStyle = (componentKey) => resolve(componentMap[componentKey]);

  const handleChange = (semanticKey, primitiveKey) => {
    setSemantics((prev) => ({ ...prev, [semanticKey]: primitiveKey }));
  };

  return (
    <div
      style={{
        background: primitives.charcoal900,
        color: primitives.cream100,
        fontFamily: "system-ui, sans-serif",
        padding: "32px",
        borderRadius: "12px",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "32px",
        minHeight: "480px",
      }}
    >
      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: primitives.slate400, marginBottom: "4px" }}>
          Layer 2
        </div>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>
          Semantic tokens
        </h3>

        {Object.entries(semanticOptions).map(([key, config]) => (
          <div key={key} style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "13px", color: primitives.cream200, marginBottom: "6px" }}>
              {config.label}
            </label>
            <select
              value={semantics[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              style={{
                width: "100%",
                background: primitives.charcoal800,
                color: primitives.cream100,
                border: \`1px solid \${primitives.slate400}\`,
                borderRadius: "6px",
                padding: "6px 8px",
                fontSize: "13px",
              }}
            >
              {Object.entries(config.options).map(([primKey]) => (
                <option key={primKey} value={primKey}>{primKey}</option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={() => setShowDrift(!showDrift)}
          style={{
            marginTop: "12px",
            width: "100%",
            background: "transparent",
            color: primitives.slate400,
            border: \`1px dashed \${primitives.slate400}\`,
            borderRadius: "6px",
            padding: "8px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {showDrift ? "Hide" : "Show"} what happens without Layer 3
        </button>
      </div>

      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: primitives.slate400, marginBottom: "4px" }}>
          Layer 3
        </div>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 600 }}>
          Components consuming those tokens
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "12px", color: primitives.slate400, marginBottom: "8px" }}>Button</div>
            <button
              style={{
                background: componentStyle("button-primary-bg"),
                color: componentStyle("button-primary-text"),
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Primary action
            </button>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: primitives.slate400, marginBottom: "8px" }}>Card</div>
            <div
              style={{
                background: componentStyle("card-bg"),
                border: \`1px solid \${componentStyle("card-border")}\`,
                color: componentStyle("card-text"),
                borderRadius: "10px",
                padding: "16px",
                width: "200px",
                fontSize: "13px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>Card title</div>
              <div style={{ color: primitives.slate400, fontSize: "12px" }}>Supporting detail text</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: primitives.slate400, marginBottom: "8px" }}>Input</div>
            <input
              placeholder="Placeholder text"
              readOnly
              style={{
                background: componentStyle("input-bg"),
                border: \`1px solid \${componentStyle("input-border")}\`,
                color: componentStyle("input-text"),
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
                width: "160px",
              }}
            />
          </div>
        </div>

        {showDrift && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(192, 65, 58, 0.1)",
              border: \`1px solid \${primitives.red500}\`,
              borderRadius: "8px",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: primitives.red500 }}>Without a component layer:</strong>{" "}
            Claude Code has no explicit instruction for how these semantic tokens should
            combine on a new composition. It infers from visual proximity instead, which
            produces plausible-looking results that quietly drift from the actual system
            logic. That drift compounds across every new screen. The component layer above
            removes the guess by mapping semantic tokens directly to explicit component
            states, so there's nowhere left to infer from.
          </div>
        )}
      </div>
    </div>
  );
}`;

const DESIGN_SYSTEM_FILE_STRUCTURE_MD = `# Design System File Structure: Splitting Variable Collections

## The Question Behind This Decision

When setting up a personal token system on top of a duplicated community Figma file, one structural question comes up early: should every token type live in a single Primitives collection, or should collections be split by category. This isn't a purely aesthetic choice. It's driven by a real constraint in how Figma handles modes.

## The Constraint

Figma limits the number of modes a variable collection can support, and that limit is tied to plan tier. A Starter plan allows a single mode per collection. Paid plans unlock more. Light and Dark mode switching, which most token systems rely on for color, consumes part of that mode budget per collection.

## Why Splitting by Category Solves This

If every token type, color, radius, spacing, typography, shadow, sits inside one undivided Primitives collection, then the entire collection is bound by whatever mode limit applies to it, even though most of those token types have nothing to do with Light and Dark mode at all. Radius and spacing values don't change between light and dark. Bundling them in with color wastes mode budget on token types that never needed multiple modes in the first place.

Splitting collections by category means only the collections that actually need Light and Dark modes, the color-related ones, consume that budget. Mode-agnostic token types like radius, spacing, and typography scale get consolidated into their own single-mode collections, since fragmenting those further provides no real benefit.

## Applying This at Both Layers

This split applies at both the Primitive and Semantic layers, not just one. Color-related collections stay separate at both levels because they need modes at both levels. Mode-agnostic collections stay consolidated at both levels for the same reason: there's no upside to splitting something that never needed to vary by mode.

## Why This Is Worth Documenting

This is a small decision that's easy to get wrong quietly. A team that doesn't think about mode budget upfront can end up boxed in later, needing to add a mode to a collection that's already at its plan-tier limit, which forces a disruptive restructure well after a system is already in use. Planning the collection split around actual mode needs, rather than around an instinctive one-collection-for-everything default, avoids that problem before it starts.`;

const GUARDRAILS_RESEARCH_MD = `# Guardrails Research: How Other Teams Structure Tokens

## Why This Research Happened

Before rebuilding the token system at Dais, the work started with a review of how other AI-forward companies structure their design tokens in shipped, publicly inspectable code. The goal wasn't to copy anyone's system. It was to understand what a token architecture looks like once a team has actually had to make it hold up under AI-driven iteration, rather than only under human designers hand-authoring components one at a time.

## Who Was Studied

Companies using AI to iterate on design in code, or running automated testing against live UI, particularly ones with publicly inspectable component libraries or open design systems.

## The Pattern Found

Nearly every team studied had gone a step further than shadcn's defaults. Where shadcn ships raw, structural placeholder tokens, most of these teams had defined real component-level semantics: actual purpose-mapped tokens rather than undifferentiated primitives.

But almost none of them had taken the next step of simplifying that layer. Most still defined state and style semantics separately per component, button hover, card hover, and input focus each getting their own independent definition, rather than sharing a single definition across every component that plays the same functional role. That meant their semantic layer was more complete than shadcn's default, but not meaningfully easier for a model to reason about at scale. A model still had to learn dozens of near-identical, individually-named tokens instead of one shared role definition.

## Why This Distinction Matters for AI-Assisted Work

A human designer can hold "these five components all behave the same way in a hover state" in their head without needing that to be written down as a single shared token. A model can't reliably do that inference on its own, and asking it to infer consistency across dozens of separately-named tokens is exactly the kind of gap that produces drift.

## Honest Framing

The role-based, shared-semantics approach isn't a novel invention. It's a well-established pattern in systems like Carbon and Polaris. What this research confirmed was that it wasn't showing up consistently in Tailwind and shadcn based systems at the companies studied, which meant there was a real gap worth closing, not a genuinely new idea worth overselling.`;

const GUARDRAILS_VALIDATION_MD = `# Guardrails Validation Method

## The Problem With Trusting a Skill File on Sight

Writing a skill file that constrains what Claude Code can generate is only half the work. The other half is proving it actually holds up before it touches production, since a guardrail that looks correct on paper can still fail the moment it meets a real, messy screen request. Three separate skill files were built at Dais, one each for PoC, product UI, and marketing UI, and each one went through the same validation loop before rollout.

## The Four Stages

**1. Build in an isolated repo branch.** No skill file went straight into the main working environment. Each one lived in its own branch first, so a failure during testing couldn't touch anything already in production.

**2. Stress-test against real mockup scenarios.** Rather than testing with simple, ideal cases, each skill file was pushed against a range of realistic screen requests, the kind of ambiguous or novel composition that actually causes drift in practice, not the easy cases that would pass regardless of whether the guardrails worked.

**3. Compare output against the existing Figma source of truth.** Every generated result got checked directly against the actual design system files, not against a general sense of whether it "looked right." This is the step that catches subtle drift, a component that's visually close but resolves to the wrong token underneath.

**4. Iterate until results were consistent and predictable.** A single clean pass wasn't the bar. The bar was repeatable, predictable output across multiple stress-test rounds, since a skill file that works once but drifts on the second or third attempt hasn't actually solved the problem.

## Why This Order Matters

Testing in isolation first, then against real scenarios, then against the actual source of truth, catches different failure types at different stages. Isolation testing catches whether the skill file breaks anything structurally. Scenario testing catches whether it handles the actual range of requests it'll face. Source-of-truth comparison catches whether "looks right" and "is actually right" have quietly diverged, which is the exact failure mode that caused the original two-layer token system to drift in the first place.

## Scope Note

This methodology was applied to all three skill files, but adoption across the organization was still at an early stage when the initiative ended due to a round of layoffs, before full engineer-level testing across all three surfaces was completed.`;

const HITHE_COMPETITIVE_AUDIT_MD = `# Hithe: Competitive Audit

## Who Was Reviewed

- **Portkey**
- **LiteLLM**
- **TrueFoundry**
- **Kong AI Gateway**

These are the closest functional peers to Hithe: LLM gateway and proxy products that sit between client applications and upstream model providers, handling routing, metering, and in some cases governance.

## Where Hithe's Positioning Differs

Most gateway products in this category are built first for developer flexibility, fast integration, broad model support, low-friction routing, with compliance and governance treated as a feature layered on top rather than the organizing principle. Hithe's target customer is the inverse of that. Regulated-industry tenants need HIPAA and PHI handling to be the default assumption baked into the product's structure, not an optional configuration a developer has to remember to turn on.

That distinction shapes what "good" looks like for the product. A developer-first gateway can get away with a lighter-weight approvals and audit trail, since its buyer is optimizing for speed of integration. A compliance-first gateway can't, because its buyer is optimizing for defensibility: being able to prove, after the fact, exactly what happened, who approved it, and how sensitive data was tiered and handled.

## What This Means for the IA

The competitive set made clear that Approvals and Compliance tiering aren't secondary features for a product positioned this way, they're the actual product differentiation. A generic gateway UI pattern, borrowed from a developer-first competitor, would undersell the part of Hithe that regulated buyers are actually paying for. That finding directly informed the structural critique in the IA teardown: those flows need more visual weight than they currently carry, not less.

## Scope Note

This audit supports a mock case study built around a product that was never completed. The comparison reflects publicly available positioning and functionality for the competitor products, used to sharpen the reasoning behind Hithe's structure, not a claim about Hithe's actual market performance.`;

const HITHE_IA_TEARDOWN_MD = `# Hithe: IA Teardown

## What Hithe Is

Hithe is an LLM gateway, a proxy layer sitting between client applications and upstream model providers (OpenAI, Anthropic, Azure OpenAI). It meters traffic, enforces governance and compliance controls, and provides auditability on top of API usage. The target customer is a regulated-industry tenant, with HIPAA and PHI handling treated as a first-class concern rather than an add-on.

This teardown started as a self-directed audit following an early discovery conversation about the product, and continued independently as a way to reverse-engineer the system's structure from the screens themselves.

## Core Objects in the System

- **Applications**: the client-facing integrations a tenant runs through Hithe
- **Subscriptions**: the rate and budget bundles a tenant offers to its own downstream consumers
- **Users**: accounts operating within a tenant
- **Approvals**: a two-actor review gate for configuration changes
- **Audit log**: a record of domain-level state changes
- **Audit traffic**: per-request API logs, distinct from the domain audit log above

## Dashboards

Three dashboards surfaced consistently across the screens:

- **Cost**: upstream provider spend, what the tenant is paying the model providers
- **Plan Usage**: the tenant's own consumption against their Hithe subscription
- **Compliance**: PHI, PII, and public data tiering, plus BAA registry status

## Structural Issues Found

**Billing vocabulary collision.** Cost and Plan Usage are two opposite-direction billing surfaces, upstream spend versus the tenant's own plan consumption, but the language used across both screens didn't clearly distinguish which direction of money was being described. That ambiguity compounds fast for a finance-adjacent audience trying to reconcile the two.

**Empty states reading as broken.** Near-total empty states across several screens, with no clear signal that this was pre-launch content rather than a functional gap. An empty screen with no explanation reads as broken software, not as unfinished software, and that distinction matters more in a compliance-sensitive product than in most others.

**An unexplained persistent status.** A "Retrying" tenant status badge appeared with no visible explanation of what it meant, how long it should last, or what action, if any, it required from the user.

**Roadmap sprawl.** Heavy use of "coming soon" labeling across the product blurred the line between what was actually shipped and what was planned, which is a real problem for a product being evaluated by compliance-focused buyers who need to know exactly what exists today.

**Safety-critical flows under-weighted visually.** Approvals and Compliance tiering are the two flows doing the actual regulatory heavy lifting for this product, and neither carried the visual weight that heavy lifting should command. They read, visually, like secondary settings rather than the core trust mechanism of the entire product.

## Scope Note

This audit and the mock case study built from it are a speculative exercise. The underlying product was never completed, and the teardown reflects an independent structural analysis, not a validated usability study with real users or stakeholders.`;

const HITHE_PERSONAS_MD = `# Hithe: Personas

Hithe's mock personas were built to represent the two roles most likely to actually touch a compliance-oriented LLM gateway day to day: the person building on top of it, and the person accountable for what it's allowed to do.

---

## Priya

A developer or technical integrator working inside a regulated-industry tenant (healthcare, legal, financial services). Priya's job is to get an application talking to an upstream model provider through Hithe without personally becoming a compliance expert in the process.

**What she needs**
- Clear, fast confirmation of whether an integration is compliant before she builds on top of it
- Predictable behavior from Subscriptions and rate limits so her application doesn't silently degrade
- Enough visibility into Audit traffic to debug her own integration without needing to escalate every question

**Where the product currently falls short for her:** ambiguous billing language between Cost and Plan Usage makes it hard for her to reason about whether a spike in her application's behavior is a budget problem or a provider-cost problem.

---

## Marcus

A compliance or security-adjacent stakeholder, likely a CISO or compliance lead, responsible for being able to answer, at any point, exactly what data moved through the system, who approved what, and whether tiering was correctly applied.

**What he needs**
- Approvals to carry real visual and structural weight, since this is the flow he's ultimately accountable for
- Compliance tiering (PHI, PII, public) to be legible at a glance, not buried in a secondary settings view
- A audit log that reads as defensible documentation, not just a raw activity feed

**Where the product currently falls short for him:** the same issue the IA teardown surfaced independently, Approvals and Compliance tiering are the flows doing the real regulatory work in this product, and neither one visually communicates that weight.

---

## Why Two Personas, Not One

Priya and Marcus want different things from the same screens. Priya wants speed and clarity to keep building. Marcus wants rigor and legibility to keep the organization defensible. A gateway product built only for one of them fails the other, and a regulated-industry buyer needs both roles satisfied to actually adopt the product.

## Scope Note

Priya and Marcus are mock personas built for a speculative case study. They represent plausible user roles based on the product's positioning and the structural audit findings, not real interview subjects or validated research participants.`;

const RAMBLE_BUILD_NOTES_MD = `# Building ramble

## What ramble Is

ramble is this portfolio, built as a fake AI chatbot interface styled after real products like Claude and ChatGPT. A side nav lists projects the way a real chat product lists past conversations. Clicking one produces a full case study rendered as if it were a chat response. A separate set of entries in that same nav are jokes, short, absurd exchanges that use real technical language rather than generic humor.

Building the site this way is itself a design decision worth documenting, since the format is doing real work: it's a live demonstration of interaction design and content structuring, not just a novelty wrapper around a normal portfolio.

## Content Schema

Every case study is built from a Markdown file with YAML frontmatter, using a consistent schema so each project can be treated as structured data rather than a one-off page:

- title
- company
- oneliner
- timeline
- platform
- role
- tools
- heroImage
- slug

Keeping this schema consistent across every project means new case studies can be added without re-deciding the structure each time, and it keeps the "chat response" rendering logic simple, since every project's content arrives in the same predictable shape.

## Rendering Rules for Images

A real chat interface doesn't render every image identically, and matching that behavior mattered for ramble to actually feel like a real product rather than a static page pretending to be one. The rule that emerged: single-purpose images, a hero shot, one structural diagram, one transitional image, render full-width and standalone. Sets of same-purpose images, multiple screens documenting the same interface, render as a grid instead, two-up or three-up depending on the count. Treating every image as an identical full-width block would have flattened that distinction and made the site feel like a document instead of a chat.

## Template Order

Every case study follows the same section order: Introduction, The Goal, The Challenge, The Process, The Research, then surface-specific sections particular to that project, then Going Forward. Going Forward itself has a fixed internal layout: Impact and Next Steps sit side by side, and What I Learned spans the full width below both. Consistency here isn't just visual tidiness, it means a reader who's gotten used to one case study already knows how to navigate the next one.

## Why the Jokes Matter

The humor entries in the side nav aren't filler. They're doing the same job the real case studies do, showing how I think, just through a different lens. The comedic approach leans on real technical meaning rather than broad absurdist humor, ELI5 requests for design jargon, forced-choice scenarios built from actual industry concepts, because a joke that only works if you already understand the underlying concept is a better filter for the right audience than a joke that works for anyone. It signals fluency and personality in the same breath.

## Honest Scope Note

ramble is an ongoing build. Sections of it, including some case studies, are still being assembled and refined rather than finished and static.`;

const RAMBLE_JOKE_PROMPTS_MD = `# Designing the ramble Joke Prompts

## Why a Fake Chatbot Portfolio Needs Jokes at All

A side nav full of case studies proves competence. It doesn't prove personality, and it doesn't prove an eye for tone, which matters just as much in product design work as visual or systems skill does. The joke entries in ramble's nav exist to cover that gap, sitting alongside the real case studies as a different kind of evidence: this person understands the material well enough to play with it.

## The Selection Process

The joke prompts went through an actual editorial pass rather than getting written once and left alone. A larger brainstormed list got narrowed down to six, chosen specifically because each one leans on a different flavor of the same underlying comedic mechanism, technical or design jargon colliding with an everyday, ELI5, or absurd framing. Repetition of the same joke shape across all six would have undercut the effect, so variety in the setup type mattered as much as the individual punchlines.

## Why Specificity Beats Broad Absurdity

The comedic sensibility driving these prompts favors wordplay and setups grounded in real technical meaning over generic absurdist humor. A joke that works for anyone, regardless of whether they understand design tokens or REST APIs or agentic workflows, isn't actually demonstrating anything about the person who wrote it. A joke that only lands if you understand the underlying concept does two things at once: it's genuinely funnier to the audience it's aimed at, and it quietly filters for exactly the kind of reader a hiring manager or fellow designer would be, someone fluent enough in the field to get the reference without it being explained.

## Keeping Joke Density in Check

Short and punchy was the standing rule for every response, not because the material couldn't support more, but because a joke that overstays its length stops feeling like wit and starts feeling like an essay explaining itself. The instinct to keep checking density, asking whether any individual response needed adjusting after a full pass, mattered more than getting each one perfect on the first attempt.

## What This Section Is Doing in the Portfolio

Documenting the reasoning behind the humor, rather than just letting the jokes sit in the nav unexplained, mirrors exactly what the rest of ramble does with the real case studies: showing the thinking behind a decision, not just the decision itself. The joke prompts aren't separate from the portfolio's design philosophy. They're an application of it to a different kind of content.`;

const SOLE_LUCKY_COMPETITIVE_AUDIT_MD = `# Sole Lucky: Competitive Audit

Before touching the design of Sole Lucky, the first step was looking at how the existing resale and raffle apps actually behave for the people using them, not just what they claim in marketing copy.

## Who Was Reviewed

- **StockX**: resale marketplace, bid/ask model
- **GOAT**: resale marketplace, fixed pricing with authentication service
- **eBay**: general marketplace, auction and fixed price, no sneaker-specific raffle mechanic
- **Foot Locker**: retail raffle access through its app, no resale layer

## What Came Up Consistently

Across the raffle-style apps, the same complaint surfaced again and again: users report opaque odds and suspect bots are working the system in ways they can't see or verify. Nobody trusts that a loss just means bad luck. The apps that avoid the raffle problem entirely, like GOAT's fixed pricing, solve trust by removing randomness, but that comes at the cost of paying resale price, which was the exact problem Ryan (see personas) was trying to avoid in the first place.

Foot Locker's raffle access, being tied to actual retail pricing with no entry fee, is closer to the model Sole Lucky needed. But it comes with the tradeoff of clean shopping paired with weak raffle transparency, the same trust gap showing up again in a different app.

## What This Ruled Out

A pure marketplace model (StockX, GOAT, eBay) doesn't solve the actual problem. Those apps are well-built for what they're built for, price discovery and authenticated resale, but none of them are designed to answer the question Sole Lucky exists to answer: how do you give someone a fair shot at retail price without a resale premium standing in the way.

## What This Confirmed

The raffle mechanic itself isn't the weak point across competitors. The transparency around it is. Every raffle-style competitor reviewed had the same trust gap, which meant the actual design problem for Sole Lucky wasn't "build a raffle," it was "build a raffle people believe is fair." That distinction shaped the points-based odds system more than any single feature comparison did.`;

const SOLE_LUCKY_IA_SITEMAP_MD = `# Sole Lucky: Information Architecture

## Why This Came After the Personas, Not Before

The IA work for the Sole Lucky rebuild followed directly from what Ryan and Carlos actually needed, not from a generic sneaker-app template. Carlos needed categories beyond men's represented on the homepage. Ryan needed a raffle entry flow that couldn't lose his place mid-session. Both of those requirements shaped the structure before a single screen got designed.

## Structural Priorities

**Homepage** had to surface multiple categories (men's, women's, kids') rather than defaulting to a single vertical, since a family-shopping user like Carlos was part of the target, not an edge case.

**Raffle entry flow** had to be short and resilient. Every extra step or point of friction is a point where a session can drop, and a dropped session reads to a user like Ryan as the system failing him, not a technical hiccup.

**Odds and points visibility** needed a real home in the IA, not a buried settings page. Since trust in the fairness of the system was the core problem the competitive audit surfaced, the structure had to make that information easy to find, not easy to ignore.

**Checkout** needed to support multiple payment methods as a first-class path, not an afterthought bolted onto a single default method.

## What The Sitemap Prioritizes

The structure separates three concerns that competitor apps tend to blur together: browsing and discovery, raffle entry and odds transparency, and account and payment management. Keeping these as distinct, clearly separated flows rather than nesting raffle mechanics inside general browsing was a direct response to the trust gap identified in the competitive audit. If odds and fairness information is hard to find, it reads as something being hidden, even when it isn't.

## Honest Scope Note

This is a concept rebuild, not a shipped product with real usage data behind it. The IA reflects design reasoning grounded in the personas and competitive research, not validated behavioral data from real users navigating the live app.`;

const SOLE_LUCKY_PERSONAS_MD = `# Sole Lucky: Personas

Two personas anchor the design decisions on Sole Lucky. Both came out of research into how people actually experience sneaker raffle apps: the distrust, the bot problem, the fatigue of clunky checkout flows. Neither is here as a demographic placeholder. Each one ties directly to something that changed in the product because of them.

---

## Ryan

**23, Oklahoma City. Runs his own detail service.**

Ryan buys sneakers for himself, but resale prices keep pushing the releases he actually wants out of reach. He doesn't want an inside connection or a shortcut. He wants a fair shot at retail price.

> "I don't need the hookup, I just want a fair shot at retail price."

**Goals**
- Access releases without paying resale markup
- Trust that the raffle is actually random

**Frustrations**
- Bots dominating high-demand drops
- Getting logged out mid-entry and losing his spot

**Design impact:** Ryan's distrust of the raffle mechanic and his frustration with mid-entry logouts shaped two direct decisions: the points-based odds system, which rewards continued participation instead of treating every entry as an identical coin flip, and the Face ID requirement, which came out of usability testing as a way to keep a session from dropping at the worst possible moment.

---

## Carlos

**42, Bixby, OK. Financial analyst, married, three kids.**

Carlos buys sneakers for the whole household, not just himself, and he has limited patience for a slow or confusing app. He wants to get in, get what he needs, and get out.

> "I want to see what I need, get it, and get out."

**Goals**
- Multiple payment options beyond Apple Pay or Google Pay
- More categories represented on the homepage, not just men's
- Instant alerts when a release he's watching opens

**Frustrations**
- Slow, laggy apps
- The sense that bots have already rigged the outcome before he gets a real chance

**Design impact:** Carlos's need to shop for his whole family drove the homepage expansion to include women's and kids' categories alongside men's. His payment friction directly shaped the multi-card checkout requirement, since a single payment method wasn't going to cover how his household actually buys.

---

## Why Both Mattered Together

Ryan and Carlos want different things from the app on the surface, speed and category range for one, fairness and access for the other, but they share the same underlying requirement: proof that the system isn't gamed against them. Designing for a points-based access model meant every decision had to account for perceived fairness, not just usability. That turned out to be a harder problem than clean UI alone solves.`;

const TOKEN_ARCHITECTURE_MD = `# Token Architecture: Primitive, Semantic, Component

## Context

This is the token system built at Dais to support AI-assisted development through Claude Code. It started as a two-layer system and became three layers after watching where the first version actually broke.

## Layer One: Primitive

Raw values. Hex codes, spacing units, type scale steps. No meaning attached, just the base material everything else pulls from. This layer barely changed once it was set.

## Layer Two: Semantic

Primitives mapped to purpose. A color stops being #1F1E1D and becomes surface-base. A spacing value becomes gap-comfortable. This is the layer that lets a designer or a model reason about intent instead of raw numbers.

Two layers felt like enough at first. It wasn't.

## Where It Broke

Claude Code, connected to the Figma files through MCP, handled atoms and molecules fine. Buttons, inputs, badges, anything small and self-contained resolved correctly against the semantic layer.

The failure showed up at the organism level. Once Claude Code had to compose something novel, a new card layout, a new panel, a new page section, it had no explicit instruction for how those semantic tokens should combine. So it started inferring. It would look at visual proximity, guess at intent, and produce something that looked plausible but didn't match the actual system logic. Multiply that across every new screen and the drift compounds fast, because a model without a defined system will confidently invent one differently every time it's asked.

That's the part that doesn't show up in a typical human design workflow. A person drifts slowly, one judgment call at a time, and another designer usually catches it in review. A model drifts instantly and at volume, and there was no second designer to catch it.

## Layer Three: Component

The fix was adding a component-level layer that mapped semantic tokens directly to component states. Not "primary action color" left for the model to place, but the literal button-hover, button-active, button-disabled values already resolved. Once that existed, Claude Code had nowhere left to guess. The token name told it exactly what to do.

This didn't eliminate the need for review. It reduced drift and rework substantially, since most new compositions now had an explicit answer already sitting in the system rather than requiring inference.

## Why This Matters Beyond One Project

Most teams solve this problem by defining component-level semantics per component, individually. Research into how other AI-forward companies structure their shipped, public token systems found the same pattern: most teams went further than raw primitives, but very few simplified the semantic layer itself into shared functional roles. That's a known, established pattern in systems like Carbon and Polaris, not something invented here, but it wasn't being applied consistently in Tailwind and shadcn based systems at the time.

The honest complication: a shared token layer solves "what value should this role use" cleanly. It does not fully solve "which role does a genuinely novel component belong to." That second question stays closer to an unsolved problem, something closer to agent context than to token architecture, and it's worth being upfront about that limit rather than claiming the system solves everything.`;

/* ─── Artifacts data ───────────────────────────────────────────────────────── */
const ARTIFACTS: Artifact[] = [
  { id: "compliance-tiering",           title: "Compliance Tiering",             type: "CODE", hoursAgo: 1,  content: COMPLIANCE_TIERING_JSX },
  { id: "design-system-file-structure", title: "Design System File Structure",   type: "MD",   hoursAgo: 2,  content: DESIGN_SYSTEM_FILE_STRUCTURE_MD },
  { id: "guardrails-research",          title: "Guardrails Research",            type: "MD",   hoursAgo: 3,  content: GUARDRAILS_RESEARCH_MD },
  { id: "odds-simulator",               title: "Odds Simulator",                 type: "CODE", hoursAgo: 4,  content: ODDS_SIMULATOR_JSX },
  { id: "sole-lucky-personas",          title: "Sole Lucky: Personas",           type: "MD",   hoursAgo: 5,  content: SOLE_LUCKY_PERSONAS_MD },
  { id: "ramble-joke-prompts",          title: "Designing the Joke Prompts",     type: "MD",   hoursAgo: 6,  content: RAMBLE_JOKE_PROMPTS_MD },
  { id: "token-system-demo",            title: "Token System Demo",              type: "CODE", hoursAgo: 7,  content: TOKEN_SYSTEM_DEMO_JSX },
  { id: "hithe-ia-teardown",            title: "Hithe: IA Teardown",             type: "MD",   hoursAgo: 8,  content: HITHE_IA_TEARDOWN_MD },
  { id: "token-architecture",           title: "Token Architecture",             type: "MD",   hoursAgo: 9,  content: TOKEN_ARCHITECTURE_MD },
  { id: "guardrails-validation",        title: "Guardrails Validation Method",   type: "MD",   hoursAgo: 10, content: GUARDRAILS_VALIDATION_MD },
  { id: "hithe-personas",               title: "Hithe: Personas",                type: "MD",   hoursAgo: 11, content: HITHE_PERSONAS_MD },
  { id: "sole-lucky-competitive-audit", title: "Sole Lucky: Competitive Audit",  type: "MD",   hoursAgo: 12, content: SOLE_LUCKY_COMPETITIVE_AUDIT_MD },
  { id: "ramble-build-notes",           title: "Building ramble",                type: "MD",   hoursAgo: 13, content: RAMBLE_BUILD_NOTES_MD },
  { id: "hithe-competitive-audit",      title: "Hithe: Competitive Audit",       type: "MD",   hoursAgo: 14, content: HITHE_COMPETITIVE_AUDIT_MD },
  { id: "sole-lucky-ia-sitemap",        title: "Sole Lucky: IA Sitemap",         type: "MD",   hoursAgo: 16, content: SOLE_LUCKY_IA_SITEMAP_MD },
];

/* ─── Dropdown ─────────────────────────────────────────────────────────────── */
function Dropdown<T extends string>({
  prefix,
  options,
  value,
  onChange,
}: {
  prefix: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const selected = options.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <span className="text-[14px] leading-5 text-muted-foreground">{prefix}</span>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] leading-5 text-foreground border border-border transition-colors hover:bg-[rgba(210,207,203,0.06)]"
        style={{ background: "rgba(210,207,203,0.1)", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
      >
        {selected.label}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[160px] rounded-xl border border-border py-1 shadow-lg"
          style={{ background: "#262421" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="flex w-full items-center justify-between px-3 py-2 text-[13px] leading-5 transition-colors hover:bg-[rgba(210,207,203,0.06)]"
              style={{ color: opt.value === value ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {opt.label}
              {opt.value === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "recent" as const, label: "Recent" },
  { value: "oldest" as const, label: "Oldest" },
  { value: "az"     as const, label: "A → Z"  },
  { value: "za"     as const, label: "Z → A"  },
];

const FILTER_OPTIONS = [
  { value: "all"  as const, label: "All"  },
  { value: "CODE" as const, label: "Code" },
  { value: "MD"   as const, label: "Docs" },
];

export default function ArtifactsPage() {
  const [selected,  setSelected]  = useState<Artifact | null>(null);
  const [sortBy,    setSortBy]    = useState<"recent" | "oldest" | "az" | "za">("recent");
  const [filterBy,  setFilterBy]  = useState<"all" | "CODE" | "MD">("all");

  const displayed = [...ARTIFACTS]
    .filter((a) => filterBy === "all" || a.type === filterBy)
    .sort((a, b) => {
      if (sortBy === "recent") return a.hoursAgo - b.hoursAgo;
      if (sortBy === "oldest") return b.hoursAgo - a.hoursAgo;
      if (sortBy === "az")     return a.title.localeCompare(b.title);
      if (sortBy === "za")     return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <AppShell>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="mx-auto max-w-[740px] w-full py-8 px-4 flex flex-col gap-8">

          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-[24px] font-semibold leading-[29px] text-foreground"
              style={{ letterSpacing: "-0.5px" }}
            >
              Artifacts
            </h1>
            <div className="flex items-center gap-2">
              <Dropdown prefix="Sort: "   options={SORT_OPTIONS}   value={sortBy}   onChange={setSortBy}   />
              <Dropdown prefix="Filter: " options={FILTER_OPTIONS} value={filterBy} onChange={setFilterBy} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {displayed.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="flex flex-col border border-border rounded-2xl overflow-hidden transition-colors duration-100 hover:bg-[rgba(210,207,203,0.06)] text-left"
              >
                <div
                  className="w-full flex items-center justify-center border-b border-border shrink-0"
                  style={{ height: 96, background: "rgba(210,207,203,0.03)", color: "var(--muted-foreground)" }}
                >
                  {a.type === "MD" ? <DocIcon /> : <CodeBracketsIcon />}
                </div>
                <div className="p-3.5 flex flex-col gap-1">
                  <p className="text-[13px] font-medium leading-[1.4] text-foreground line-clamp-2">{a.title}</p>
                  <p className="text-[12px] leading-5 text-muted-foreground">{a.hoursAgo}h ago</p>
                  <span
                    className="inline-flex self-start text-[11px] font-medium px-2 py-0.5 rounded-full mt-0.5"
                    style={a.type === "CODE"
                      ? { background: "rgba(90,171,164,0.15)", color: "#5AABA4" }
                      : { background: "rgba(210,207,203,0.1)", color: "var(--muted-foreground)" }
                    }
                  >
                    {a.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {selected && (
        <ArtifactSheet artifact={selected} onClose={() => setSelected(null)} />
      )}
    </AppShell>
  );
}
