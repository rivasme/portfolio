"use client";

interface CaseStudy {
  title: string;
  slug: string;
  company: string;
  description: string;
  meta: string;
  hero: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "ramble AI",
    slug: "ramble-ai",
    company: "Personal Project",
    description: "A portfolio built as a working AI chatbot, because a static case study grid wasn't going to prove the point.",
    meta: "Web · Jul 2026",
    hero: "/images/ramble/hero.png",
  },
  {
    title: "Hithe",
    slug: "hithe",
    company: "Dais Co.",
    description: "An LLM gateway built for regulated industries, sitting between client applications and upstream model providers to meter, govern, and audit API traffic.",
    meta: "Web · Apr–Jun 2026",
    hero: "/images/hithe/hero-1.png",
  },
  {
    title: "Design Skills & Guardrails System",
    slug: "design-skills-guardrails",
    company: "Dais Co.",
    description: "Building AI-readable design systems for Claude Code across product, marketing, and PoC surfaces.",
    meta: "Nov 2025–Mar 2026",
    hero: "/images/design-skills/hero.png",
  },
  {
    title: "Battery Trader",
    slug: "battery-trader",
    company: "PCI Energy Solutions",
    description: "A web-based, multi-tenant, multi-market ops planning, bidding, and analysis app for battery and renewable site owners.",
    meta: "SaaS · Sept 2023–Mar 2024",
    hero: "/images/battery-trader/hero-1.png",
  },
  {
    title: "Sole Lucky",
    slug: "sole-lucky",
    company: "Funk Products",
    description: "A raffle-based sneaker app that replaces resale markup with earned access.",
    meta: "iOS · Jan–Mar 2023",
    hero: "/images/sole-lucky/hero-1.png",
  },
];

function dispatchProject(slug: string) {
  window.dispatchEvent(new CustomEvent("ramble:project", { detail: { slug } }));
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
          <button
            key={cs.slug}
            onClick={() => dispatchProject(cs.slug)}
            style={stagger(i + 1)}
            className="group flex w-full flex-col overflow-hidden rounded-2xl text-left cursor-pointer transition-colors duration-100 hover:bg-[rgba(210,207,203,0.06)] active:bg-[rgba(210,207,203,0.12)]"
          >
            {/* Full-width hero banner */}
            <div className="w-full aspect-[740/277] overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.hero}
                alt={`${cs.title} preview`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-[15px] leading-[26px] p-3">
              <span className="font-semibold text-foreground">{cs.title}</span>
              {", "}
              <span className="text-foreground">
                {cs.company}. {cs.description}
              </span>
              {" "}
              <em className="text-muted-foreground">{cs.meta}</em>
            </p>
          </button>
        ))}
      </div>

      <p className="text-[15px] leading-[26px] text-foreground" style={stagger(CASE_STUDIES.length + 1)}>
        Want the full case study for any of these? Just select one.
      </p>
    </div>
  );
}
