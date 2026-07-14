import type { Section } from "./section-types";

export const ABOUT_SECTIONS: Section[] = [
  {
    id: "about-introduction",
    type: "heading",
    content: "About David Rivas",
  },
  {
    id: "about-background",
    type: "paragraph",
    content: "David is a product designer based in Oklahoma with over a decade of experience across UX strategy, product design, brand, and design systems. He likes owning the whole picture — not just the screens, but the strategy behind them and the systems that hold them together.",
  },
  {
    id: "about-dais",
    type: "paragraph",
    content: "For the past year and a half he was the sole product designer at Dais, an AI agentic orchestration company, responsible for everything design touched: product UX, brand, and the infrastructure underneath it. He built a three-layer token system on Tailwind and shadcn, then extended it into structured skill files and guardrails that helped Claude Code generate on-brand UI by default, cutting most of the rework that comes from AI drift. He also led a full company rebrand, from visual identity through a rebuilt marketing site.",
  },
  {
    id: "about-before-dais",
    type: "paragraph",
    content: "Before that, he spent three years at PCI Energy Solutions co-building their design system and leading UX across multiple SaaS products, three years as Creative Director for a multi-brand dental group, and eight years working his way up to Creative Marketing Director at PhoneDoctors.",
  },
  {
    id: "about-bilingual-ai",
    type: "paragraph",
    content: "He's bilingual, self-taught, and genuinely fascinated by how much a single designer can build when AI is a real part of the workflow — not just a buzzword attached to it.",
  },
  {
    id: "about-next",
    type: "paragraph",
    content: "Right now he's looking for what's next: a product design role at a company building something worth paying attention to in AI — ideally somewhere he gets to keep doing all of it: strategy, product, brand, and systems.",
  },
  {
    id: "about-contact-note",
    type: "muted",
    content: "If you'd like to get in touch or see his resume, reach out on {{LinkedIn}}. He keeps email and phone off the site to avoid spambots.",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/iamdavidrivas/" }],
  },
  {
    id: "about-likes",
    type: "list",
    label: "What he likes",
    items: [
      "Hanging with his family",
      "Playing piano / keyboards",
      "Producing music",
      "Designing new products",
      "AI & ML education",
      "Collecting / building LEGO",
    ],
  },
  {
    id: "about-learning",
    type: "list",
    label: "What he's learning",
    items: [
      "Agentic UX",
      "Figma Dev Mode & Code Connect",
      "Token automation",
      "AI evaluation & prompt design",
      "Multi-agent orchestration patterns",
      "React / Next.js fluency",
    ],
  },
  {
    id: "about-outro",
    type: "outro",
    content: "Read what {{colleagues say}} about working with David, or take a look at {{his skills}}. Ready to connect? {{Here's how.}}",
    links: [
      { label: "colleagues say", query: "/testimonials" },
      { label: "his skills",     query: "/skills"       },
      { label: "Here's how.",    query: "/contact"      },
    ],
  },
];
