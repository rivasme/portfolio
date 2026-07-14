import type { Section } from "./section-types";

export const RESUME_SECTIONS: Section[] = [
  {
    id: "resume-header-name",
    type: "heading",
    content: "David Rivas",
  },
  {
    id: "resume-header-role",
    type: "muted",
    content: "Lead Product Designer · Broken Arrow, OK · {{LinkedIn}}",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/iamdavidrivas/" }],
  },
  {
    id: "resume-header-focus",
    type: "muted",
    content: "AI-Native Product Design · Design Systems · UX Strategy · Brand & Identity · AI-Assisted Workflows",
  },

  {
    id: "resume-summary-label",
    type: "label",
    content: "Summary",
  },
  {
    id: "resume-summary",
    type: "paragraph",
    content: "Product designer with 10+ years of experience across UX strategy, product design, and brand, comfortable owning the full picture as a founding or sole designer. Most recently led end-to-end product design across four verticals at an AI startup, ran a full company rebrand from concept to launch, and built a token-based design system extended into AI-assisted design-to-code workflows with Claude Code. Equally at home in discovery, high-fidelity UI, and the systems and guardrails that hold a fast-moving product together.",
  },

  {
    id: "resume-experience-label",
    type: "label",
    content: "Experience",
  },
  {
    id: "resume-dais",
    type: "job",
    jobTitle: "Lead Product Designer",
    company: "Dais",
    period: "Mar 2025 – Jun 2026 · Tulsa, OK / Remote",
    bullets: [
      "Owned end-to-end product design as the startup's sole product designer across four planned verticals (Healthcare, Accounting, Financial/Hedge Fund, Government and FOIA).",
      "Translated ambiguous compliance, security, and audit requirements into clear, role-based design direction for CISOs, developers, auditors, and enterprise stakeholders.",
      "Led a full company rebrand from concept through execution, including new visual identity and a redesigned marketing website.",
      "Designed a token-based design system built on shadcn and Tailwind to prevent design drift in AI-assisted development through Claude Code.",
      "Partnered with Claude Code to define a structured skill framework and code-level guardrails for the engineering team, covering product UI, marketing UI, and PoC UI.",
    ],
  },
  {
    id: "resume-pci-energy",
    type: "job",
    jobTitle: "UX Designer",
    company: "PCI Energy Solutions",
    period: "Aug 2022 – Mar 2025 · Norman, OK / Remote",
    bullets: [
      "Co-pioneered the company's design system, establishing scalability and visual cohesion across multiple SaaS products.",
      "Instituted a UX research template that became the team standard, streamlining how user insights were captured and applied.",
      "Led UX efforts across three major SaaS projects, coordinating closely with engineers and product managers to ship successful outcomes.",
      "Translated complex requirements into user flows, wireframes, and prototypes for enterprise SaaS products.",
    ],
  },
  {
    id: "resume-breathe-dentistry",
    type: "job",
    jobTitle: "Creative Director",
    company: "Breathe Modern Dentistry",
    period: "Jul 2019 – Aug 2022 · Broken Arrow, OK",
    bullets: [
      "Owned all creative, UX/UI, and marketing decisions across four entities within the organization.",
      "Directed UX/UI strategy for all brand websites, ensuring consistent and engaging user experiences.",
      "Produced print, digital, and social design work that communicated brand messaging across channels.",
    ],
  },
  {
    id: "resume-phonedoctors",
    type: "job",
    jobTitle: "Creative Marketing Director",
    company: "PhoneDoctors",
    period: "Mar 2011 – Jun 2019 · 8 yrs 4 mos",
    bullets: [
      "Advanced through two internal promotions to Creative Marketing Director, leading teams across UX/UI projects, branding initiatives, and creative direction.",
      "Spearheaded visual design efforts for websites, delivering results across print, digital, and social media platforms.",
      "Worked across graphic design, motion design, video editing, and product photography to elevate brand presence.",
    ],
  },

  {
    id: "resume-skills-label",
    type: "label",
    content: "Skills",
  },
  {
    id: "resume-skills",
    type: "muted",
    content: "AI Product Design · Agentic AI Workflows · UX Strategy & Research · Wireframing & Prototyping · Brand Identity & Rebrands · Design Systems & Tokens · AI-Assisted Design Workflows (Claude Code) · Figma · Shadcn / Tailwind · Cross-Functional Collaboration · Bilingual (English / Spanish)",
  },

  {
    id: "resume-certifications-label",
    type: "label",
    content: "Certifications",
  },
  {
    id: "resume-certifications",
    type: "muted",
    content: "Coursera — Google UX Design Certificate coursework, 2022. Covering: Responsive Web Design · High-Fidelity Designs and Prototypes · UX Research and Test Early Concepts · Wireframes and Low-Fidelity Prototypes · UX Design Process: Empathize, Define, and Ideate · Foundation of User Experience.",
  },

  {
    id: "resume-outro",
    type: "outro",
    content: "See what {{colleagues say}} about working with David, or browse {{his work}}.",
    links: [
      { label: "colleagues say", query: "/testimonials" },
      { label: "his work",       query: "/projects"     },
    ],
  },
];
