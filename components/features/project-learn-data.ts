import type { Section } from "./section-types";

export interface ProjectLearnEntry {
  id: string;
  section: Section;
  feature: "project";
  displayTitle: string;
  searchText: string;
}

const PROJECTS: ProjectLearnEntry[] = [
  /* ── Sole Lucky ──────────────────────────────────────────────────────── */
  {
    id: "project-sole-lucky-overview",
    feature: "project",
    displayTitle: "Sole Lucky",
    searchText: "sole lucky sneaker raffle app shoes footwear resale access app mobile ios ux",
    section: {
      id: "project-sole-lucky-overview",
      type: "heading",
      content: "Sole Lucky",
    },
  },
  {
    id: "project-sole-lucky-desc",
    feature: "project",
    displayTitle: "Sole Lucky: sneaker raffle app",
    searchText: "sole lucky sneaker raffle app resale markup earned access limited drops exclusive mobile ux product design user research",
    section: {
      id: "project-sole-lucky-desc",
      type: "paragraph",
      content: "A raffle-based sneaker app that replaces resale markup with earned access. Users accumulate points through engagement to unlock chances at limited drops, shifting the sneaker economy from whoever has the most money to whoever shows up the most.",
    },
  },
  {
    id: "project-sole-lucky-skills",
    feature: "project",
    displayTitle: "Sole Lucky: skills & tools",
    searchText: "sole lucky ux research user testing prototyping figma mobile ios app design brand identity wireframe lo-fi hi-fi",
    section: {
      id: "project-sole-lucky-skills",
      type: "list",
      label: "Sole Lucky: skills & tools",
      items: ["UX Research & User Testing", "iOS Mobile Design", "Lo-Fi / Mid-Fi / Hi-Fi Prototyping", "Brand Identity", "Competitive Audit", "Figma"],
    },
  },

  /* ── Battery Trader ──────────────────────────────────────────────────── */
  {
    id: "project-battery-trader-overview",
    feature: "project",
    displayTitle: "Battery Trader",
    searchText: "battery trader energy renewable ops planning bidding analysis dais energy enterprise web app b2b",
    section: {
      id: "project-battery-trader-overview",
      type: "heading",
      content: "Battery Trader",
    },
  },
  {
    id: "project-battery-trader-desc",
    feature: "project",
    displayTitle: "Battery Trader: energy ops platform",
    searchText: "battery trader dais energy renewable battery storage multi-tenant market ops planning bidding analysis site owners enterprise saas web app ux product design",
    section: {
      id: "project-battery-trader-desc",
      type: "paragraph",
      content: "A web-based, multi-tenant, multi-market ops planning, bidding, and analysis platform for battery and renewable energy site owners. Built for DAIS Energy (David's longest design partnership), the platform handles real-time energy market data, dispatch optimization, and site-level financial analysis across dozens of client accounts.",
    },
  },
  {
    id: "project-battery-trader-skills",
    feature: "project",
    displayTitle: "Battery Trader: skills & tools",
    searchText: "battery trader energy data visualization enterprise ux multi-tenant saas dashboard design systems figma user research stakeholder competitive audit",
    section: {
      id: "project-battery-trader-skills",
      type: "list",
      label: "Battery Trader: skills & tools",
      items: ["Enterprise UX / SaaS Design", "Data Visualization", "Multi-Tenant Architecture Design", "Stakeholder Research", "Competitive Audit", "Design Systems", "Figma"],
    },
  },

  /* ── Design Skills & Guardrails ──────────────────────────────────────── */
  {
    id: "project-design-skills-overview",
    feature: "project",
    displayTitle: "Design Skills & Guardrails",
    searchText: "design skills guardrails system ai claude code design system tokens figma ai-readable",
    section: {
      id: "project-design-skills-overview",
      type: "heading",
      content: "Design Skills & Guardrails System",
    },
  },
  {
    id: "project-design-skills-desc",
    feature: "project",
    displayTitle: "Design Skills & Guardrails: AI design system",
    searchText: "design skills guardrails ai claude code design system tokens semantic ai-readable product marketing poc surfaces drift ai-generated",
    section: {
      id: "project-design-skills-desc",
      type: "paragraph",
      content: "Building AI-readable design systems for Claude Code across product, marketing, and PoC surfaces. A structural solution to AI design drift: rather than reviewing every AI-generated output, David built a token and skill file system that gives Claude Code unambiguous semantic ground truth so the output stays consistent by default.",
    },
  },
  {
    id: "project-design-skills-skills",
    feature: "project",
    displayTitle: "Design Skills & Guardrails: skills & tools",
    searchText: "design systems tokens semantic ai claude code figma guardrails design drift product marketing poc ux documentation",
    section: {
      id: "project-design-skills-skills",
      type: "list",
      label: "Design Skills & Guardrails: skills & tools",
      items: ["Design Systems Architecture", "AI-Readable Token Design", "Claude Code Integration", "Multi-Surface Design (Product / Marketing / PoC)", "Figma", "Design Drift Prevention"],
    },
  },

  /* ── Hithe ───────────────────────────────────────────────────────────── */
  {
    id: "project-hithe-overview",
    feature: "project",
    displayTitle: "Hithe",
    searchText: "hithe llm gateway regulated industries api compliance enterprise ai",
    section: {
      id: "project-hithe-overview",
      type: "heading",
      content: "Hithe",
    },
  },
  {
    id: "project-hithe-desc",
    feature: "project",
    displayTitle: "Hithe: LLM gateway",
    searchText: "hithe llm gateway regulated industries api traffic metering governance audit compliance enterprise client applications upstream model providers",
    section: {
      id: "project-hithe-desc",
      type: "paragraph",
      content: "An LLM gateway built for regulated industries, sitting between client applications and upstream model providers to meter, govern, and audit API traffic. Hithe gives compliance-heavy teams the control layer that AI providers don't: usage limits, audit trails, PII redaction, and role-based model access in one platform.",
    },
  },
  {
    id: "project-hithe-skills",
    feature: "project",
    displayTitle: "Hithe: skills & tools",
    searchText: "hithe llm enterprise api ux design compliance governance saas b2b dashboard developer tools figma",
    section: {
      id: "project-hithe-skills",
      type: "list",
      label: "Hithe: skills & tools",
      items: ["Enterprise SaaS UX", "Developer Tool Design", "Compliance & Governance UX", "API Dashboard Design", "Figma"],
    },
  },

  /* ── ramble AI ───────────────────────────────────────────────────────── */
  {
    id: "project-ramble-ai-overview",
    feature: "project",
    displayTitle: "ramble AI",
    searchText: "ramble ai portfolio chatbot next.js react typescript ai claude",
    section: {
      id: "project-ramble-ai-overview",
      type: "heading",
      content: "ramble AI",
    },
  },
  {
    id: "project-ramble-ai-desc",
    feature: "project",
    displayTitle: "ramble AI: AI portfolio",
    searchText: "ramble ai portfolio chatbot case study next.js react typescript design engineering ai claude streaming chat interface product designer",
    section: {
      id: "project-ramble-ai-desc",
      type: "paragraph",
      content: "A portfolio built as a working AI chatbot, because a static case study grid wasn't going to prove the point. ramble is David's attempt to show, not just tell, what it looks like when a product designer gets deep into AI-native product thinking. Built in Next.js with React 19, streaming chat UI, slash commands, and a design system built for Claude Code from day one.",
    },
  },
  {
    id: "project-ramble-ai-skills",
    feature: "project",
    displayTitle: "ramble AI: skills & tools",
    searchText: "ramble next.js react typescript tailwind ai chatbot streaming design engineering portfolio claude code design systems",
    section: {
      id: "project-ramble-ai-skills",
      type: "list",
      label: "ramble AI: skills & tools",
      items: ["Next.js / React 19", "TypeScript", "Tailwind CSS v4", "AI-Native UX Design", "Streaming Chat Interface", "Design Systems for Claude Code"],
    },
  },
];

export default PROJECTS;
