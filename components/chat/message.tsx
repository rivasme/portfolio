"use client";

import { useEffect, useState } from "react";
import { TriangleAlert, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PortfolioContent from "./portfolio-content";
import SoleLuckyContent from "@/components/projects/sole-lucky-content";
import BatteryTraderContent from "@/components/projects/battery-trader-content";
import DesignSkillsContent from "@/components/projects/design-skills-content";
import HitheContent from "@/components/projects/hithe-content";
import RambleAiContent from "@/components/projects/ramble-ai-content";
import AboutContent from "@/components/features/about-content";
import TestimonialsContent from "@/components/features/testimonials-content";
import SkillsContent from "@/components/features/skills-content";
import ResumeContent from "@/components/features/resume-content";
import ContactContent from "@/components/features/contact-content";

function formatTimestamp(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (isToday) return time;
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${month} ${date.getDate()}, ${time}`;
}

/* ─── Render text with /commands as orange badges ────────────────────────── */
function renderWithBadges(text: string): React.ReactNode {
  const parts = text.split(/(\/[a-zA-Z][\w-]*)/);
  return (
    <>
      {parts.map((part, i) =>
        /^\/[a-zA-Z][\w-]*$/.test(part) ? (
          <span
            key={i}
            className="rounded-lg px-1 py-[3px] font-mono text-[13px] leading-none mx-px"
            style={{ color: "var(--brand-teal-400)", border: "1px solid rgba(90,171,164,0.25)" }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  thinking?: boolean;
  timestamp?: Date;
  contentType?: "portfolio" | "project" | "about" | "testimonials" | "skills" | "resume" | "contact" | "error";
  projectSlug?: string;
}

interface MessageProps {
  message: ChatMessage;
}

/* streaming cursor */
function StreamingCursor() {
  return (
    <span
      className="inline-block w-px h-[1.1em] bg-foreground/70 ml-0.5 align-middle"
      style={{ animation: "blink-cursor 0.9s step-end infinite" }}
    />
  );
}

/* thinking animation — rocking logo with talking mouth */
function ThinkingMessage() {
  const [elapsed, setElapsed] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3 px-4 items-center">
      {/* Animated logo */}
      <div className="shrink-0">
        <div
          style={{
            width: 40,
            height: 27,
            position: "relative",
            animation: "ramble-glitch-rock 5s steps(1,end) infinite",
            transformOrigin: "50% 55%",
          }}
        >
          <img
            src="/ramble2-nomouth.png"
            alt="thinking"
            style={{
              width: "100%",
              height: "100%",
              imageRendering: "pixelated",
              display: "block",
              animation: "ramble-glitch-flicker 5s steps(1,end) infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "60.6%",
              top: "57.8%",
              width: "15.6%",
              borderRadius: 2,
              background: "rgb(0,120,126)",
              transform: "translate(-50%,-50%)",
              imageRendering: "pixelated",
              animation: "ramble-talk-slow-sm 1.1s steps(1,end) infinite",
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span
        className="text-[14px]"
        style={{ color: "rgba(210,207,203,0.4)" }}
      >
        thinking... {elapsed}s
      </span>
    </div>
  );
}

/* user bubble */
function UserMessage({ content, timestamp }: { content: string; timestamp?: Date }) {
  return (
    <div className="flex flex-col items-end px-4 gap-2">
      <div className={cn(
        "max-w-[88%] sm:max-w-[75%] rounded-2xl rounded-br-sm px-4 py-2.5",
        "bg-secondary text-secondary-foreground",
        "text-[15px] leading-6",
      )}>
        {renderWithBadges(content)}
      </div>
      {timestamp && (
        <span className="text-[11px] leading-none font-medium" style={{ color: "rgba(210,207,203,0.35)" }}>
          {formatTimestamp(timestamp)}
        </span>
      )}
    </div>
  );
}

/* assistant bubble */
function AssistantMessage({ content, streaming, timestamp }: { content: string; streaming?: boolean; timestamp?: Date }) {
  return (
    <div className="px-4 flex flex-col gap-2">
      <p className="text-[15px] leading-[26px] text-foreground whitespace-pre-wrap">
        {content}
        {streaming && <StreamingCursor />}
      </p>
      {!streaming && timestamp && (
        <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
          {formatTimestamp(timestamp)}
        </span>
      )}
    </div>
  );
}

export default function Message({ message }: MessageProps) {
  if (message.role === "user") {
    return <UserMessage content={message.content} timestamp={message.timestamp} />;
  }
  if (message.thinking) {
    return <ThinkingMessage />;
  }
  if (message.contentType === "portfolio") {
    return (
      <div className="px-4 flex flex-col gap-1">
        <PortfolioContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "project") {
    return (
      <div className="px-4 flex flex-col gap-2">
        {message.projectSlug === "sole-lucky" && <SoleLuckyContent />}
        {message.projectSlug === "battery-trader" && <BatteryTraderContent />}
        {message.projectSlug === "design-skills-guardrails" && <DesignSkillsContent />}
        {message.projectSlug === "hithe" && <HitheContent />}
        {message.projectSlug === "ramble-ai" && <RambleAiContent />}
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "about") {
    return (
      <div className="px-4 flex flex-col gap-2">
        <AboutContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "testimonials") {
    return (
      <div className="px-4 flex flex-col gap-2">
        <TestimonialsContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "skills") {
    return (
      <div className="px-4 flex flex-col gap-2">
        <SkillsContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "resume") {
    return (
      <div className="px-4 flex flex-col gap-2">
        <ResumeContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "contact") {
    return (
      <div className="px-4 flex flex-col gap-2">
        <ContactContent />
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  if (message.contentType === "error") {
    return (
      <div className="px-4 flex flex-col gap-3" style={{ animation: "fade-up 250ms ease-out both" }}>
        {/* Alert card */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)",
          }}
        >
          <TriangleAlert size={15} className="shrink-0" style={{ color: "rgba(249,115,22,0.7)" }} />
          <p className="text-[14px] font-semibold leading-5" style={{ color: "rgba(249,115,22,0.85)" }}>
            Command not recognized
          </p>
        </div>
        {/* Body */}
        <p className="text-[14px] leading-[22px] text-foreground px-1">
          That query just cost us roughly 0.0003 gallons of cooling water and returned nothing
          useful. In the interest of environmental responsibility, please try{" "}
          {["/projects", "/about", "/skills", "/testimonials"].map((cmd, i, arr) => (
            <span key={cmd}>
              <span
                className="rounded-md px-1 py-px font-mono text-[13px]"
                style={{ color: "var(--brand-teal-400)", border: "1px solid rgba(90,171,164,0.25)" }}
              >
                {cmd}
              </span>
              {i < arr.length - 1 ? ", " : " "}
            </span>
          ))}
          instead. ramble thanks you, and so does a very small aquifer somewhere.
        </p>
        {message.timestamp && (
          <span className="text-[11px] leading-none font-medium self-end" style={{ color: "rgba(210,207,203,0.35)" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    );
  }

  return (
    <AssistantMessage
      content={message.content}
      streaming={message.streaming}
      timestamp={message.timestamp}
    />
  );
}
