"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AppShell from "@/components/shell/app-shell";
import BatteryTraderContent from "@/components/projects/battery-trader-content";
import DesignSkillsContent from "@/components/projects/design-skills-content";
import HitheContent from "@/components/projects/hithe-content";
import RambleAiContent from "@/components/projects/ramble-ai-content";

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M6 3L2 7L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const SLUG_MAP: Record<string, { title: string; Component: React.ComponentType<{ isStatic?: boolean }> }> = {
  "battery-trader":           { title: "Battery Trader",                    Component: BatteryTraderContent },
  "design-skills-guardrails": { title: "Design Skills & Guardrails System", Component: DesignSkillsContent },
  "hithe":                    { title: "Hithe",                             Component: HitheContent },
  "ramble-ai":                { title: "Ramble AI",                         Component: RambleAiContent },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const entry = SLUG_MAP[slug];

  return (
    <AppShell>
      <div className="flex-1">
        {/* Sticky breadcrumb — inside the scroll area so it sticks to main's scroll */}
        <div
          className="sticky top-0 z-10"
          style={{ background: "var(--accent)" }}
        >
          <div className="mx-auto max-w-[740px] w-full px-4 py-2.5 flex items-center gap-3">
            <button
              onClick={() => router.push("/projects")}
              className="flex items-center justify-center w-6 h-6 rounded-full text-foreground transition-colors hover:bg-[rgba(210,207,203,0.06)]"
              aria-label="Back to Projects"
            >
              <BackIcon />
            </button>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => router.push("/projects")}
                className="text-[14px] leading-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </button>
              <ChevronRight size={11} className="text-muted-foreground mx-0.5" />
              <span className="text-[14px] leading-5 text-foreground">
                {entry?.title ?? slug}
              </span>
            </nav>
          </div>
        </div>

        {/* Case study content — static, no typewriter */}
        <div className="mx-auto max-w-[740px] w-full py-8 px-4 flex flex-col gap-8">
          {entry ? (
            <entry.Component isStatic />
          ) : (
            <p className="text-[15px] leading-6 text-muted-foreground">Coming soon.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
