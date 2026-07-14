import type { Section } from "./section-types";

export const SKILLS_SECTIONS: Section[] = [
  {
    id: "skills-header",
    type: "heading",
    content: "David's Skills",
  },
  {
    id: "skills-product-design",
    type: "skill-group",
    label: "Product Design",
    skills: [
      { label: "UX Strategy & Research",        variant: "default" },
      { label: "Wireframing & Prototyping",      variant: "default" },
      { label: "Brand Identity & Rebrands",      variant: "default" },
      { label: "Design Systems & Tokens",        variant: "default" },
    ],
  },
  {
    id: "skills-ai-native",
    type: "skill-group",
    label: "AI-Native Work",
    skills: [
      { label: "AI Product Design",              variant: "teal" },
      { label: "Agentic AI Workflows",           variant: "teal" },
      { label: "AI-Assisted Design Workflows",   variant: "teal" },
      { label: "Claude Code",                    variant: "teal" },
    ],
  },
  {
    id: "skills-tools",
    type: "skill-group",
    label: "Tools",
    skills: [
      { label: "Figma",                          variant: "default" },
      { label: "Shadcn / Tailwind",              variant: "default" },
      { label: "React / Next.js",                variant: "default" },
      { label: "GitLab",                         variant: "default" },
    ],
  },
  {
    id: "skills-other",
    type: "skill-group",
    label: "Other",
    skills: [
      { label: "Cross-Functional Collaboration", variant: "default" },
      { label: "Bilingual (English / Spanish)",  variant: "default" },
    ],
  },
  {
    id: "skills-currently-learning",
    type: "skill-group",
    label: "Currently Learning",
    skills: [
      { label: "Agentic UX",                         variant: "clay" },
      { label: "Figma Dev Mode & Code Connect",       variant: "clay" },
      { label: "Token Automation",                    variant: "clay" },
      { label: "AI Evaluation & Prompt Design",       variant: "clay" },
      { label: "Multi-Agent Orchestration",           variant: "clay" },
      { label: "React / Next.js Fluency",             variant: "clay" },
    ],
  },
  {
    id: "skills-certifications",
    type: "muted",
    content: "Google UX Design Certificate coursework via Coursera — covering UX research, wireframing, prototyping, and high-fidelity design.",
  },
  {
    id: "skills-outro",
    type: "outro",
    content: "See these in action across {{his projects}}, or read {{his resume}}.",
    links: [
      { label: "his projects", query: "/projects" },
      { label: "his resume",   query: "/resume"   },
    ],
  },
];
