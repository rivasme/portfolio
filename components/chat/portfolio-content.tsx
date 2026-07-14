"use client";

interface CaseStudy {
  title: string;
  slug: string;
  company: string;
  description: string;
  meta: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Sole Lucky",
    slug: "sole-lucky",
    company: "Funk Products",
    description: "A raffle-based sneaker app that replaces resale markup with earned access.",
    meta: "iOS · Jan–Mar 2023",
  },
  {
    title: "Battery Trader",
    slug: "battery-trader",
    company: "PCI Energy Solutions",
    description: "A web-based, multi-tenant, multi-market ops planning, bidding, and analysis app for battery and renewable site owners.",
    meta: "SaaS · Sept 2023–Mar 2024",
  },
  {
    title: "Design Skills & Guardrails System",
    slug: "design-skills-guardrails",
    company: "Dais Co.",
    description: "Building AI-readable design systems for Claude Code across product, marketing, and PoC surfaces.",
    meta: "Nov 2025–Mar 2026",
  },
  {
    title: "Hithe",
    slug: "hithe",
    company: "Dais Co.",
    description: "An LLM gateway built for regulated industries, sitting between client applications and upstream model providers to meter, govern, and audit API traffic.",
    meta: "Web · Apr–Jun 2026",
  },
  {
    title: "ramble AI",
    slug: "ramble-ai",
    company: "Personal Project",
    description: "A portfolio built as a working AI chatbot, because a static case study grid wasn't going to prove the point.",
    meta: "Web · Jul 2026",
  },
];

function dispatchProject(slug: string) {
  window.dispatchEvent(new CustomEvent("ramble:project", { detail: { slug } }));
}

function dispatchQuery(title: string) {
  window.dispatchEvent(new CustomEvent("ramble:query", { detail: { query: title } }));
}

function stagger(i: number): React.CSSProperties {
  return {
    animation: "fade-up 280ms ease-out both",
    animationDelay: `${i * 90}ms`,
  };
}

export default function PortfolioContent() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] leading-[26px] text-foreground" style={stagger(0)}>
        Here are David&apos;s product design case studies
      </p>

      <div className="flex flex-col gap-4">
        {CASE_STUDIES.map((cs, i) => (
          <div key={cs.slug} style={stagger(i + 1)}>
            <p className="text-[15px] leading-[26px]">
              <button
                onClick={() =>
          cs.slug === "sole-lucky" || cs.slug === "battery-trader" || cs.slug === "design-skills-guardrails" || cs.slug === "hithe" || cs.slug === "ramble-ai"
            ? dispatchProject(cs.slug)
            : dispatchQuery(cs.title)
        }
                className="font-semibold text-foreground underline underline-offset-2 decoration-white-alpha-30 hover:decoration-foreground transition-colors cursor-pointer"
              >
                {cs.title}
              </button>
              {" "}
              <span className="text-foreground">
                — {cs.company} {cs.description}
              </span>
              {" "}
              <em className="text-muted-foreground">{cs.meta}</em>
            </p>
          </div>
        ))}
      </div>

      <p className="text-[15px] leading-[26px] text-foreground" style={stagger(CASE_STUDIES.length + 1)}>
        Want the full case study for any of these? Just select one.
      </p>
    </div>
  );
}
