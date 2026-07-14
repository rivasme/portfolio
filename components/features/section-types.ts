export type TagVariant = "default" | "teal" | "clay";

export interface SectionLink {
  label: string;
  query?: string; // dispatches ramble:query — for /feature commands
  href?: string;  // external anchor
}

export type Section =
  | { id: string; type: "heading";     content: string }
  | { id: string; type: "subheading";  content: string }
  | { id: string; type: "label";       content: string }
  | { id: string; type: "paragraph";   content: string; links?: SectionLink[] }
  | { id: string; type: "muted";       content: string; links?: SectionLink[] }
  | { id: string; type: "list";        label: string; items: string[] }
  | { id: string; type: "skill-group"; label: string; skills: Array<{ label: string; variant: TagVariant }> }
  | { id: string; type: "job";         jobTitle: string; company: string; period: string; bullets: string[] }
  | { id: string; type: "avatar-quote"; quote: string; name: string; title: string; company: string; avatar: string }
  | { id: string; type: "image";       src: string; alt: string; aspectRatio?: string; height?: number }
  | { id: string; type: "image-grid";  images: Array<{ src: string; alt: string; aspectRatio?: string; columnLabel?: string; caption?: { title: string; body: string; theme?: "neutral" | "teal" | "teal-dark" } }>; columns?: 2 | 3 | 4 }
  | { id: string; type: "callout-stack"; items: Array<{ label: string; body: string; theme: "neutral" | "orange" | "emerald" | "teal-dark" | "teal-light" | "teal-mid" }>; footer?: string }
  | { id: string; type: "badge-flow"; steps: string[]; result: string }
  | { id: string; type: "token-arch" }
  | { id: string; type: "split-stack"; left: Array<{ src: string; alt: string; aspectRatio?: string }>; right: { src: string; alt: string; aspectRatio?: string } }
  | { id: string; type: "text-gallery"; heading?: string; content: string; images: Array<{ src: string; alt: string; aspectRatio?: string; span?: boolean }> }
  | { id: string; type: "meta";        lines: Array<{ label: string; value: string }> }
  | { id: string; type: "table";       label?: string; headers: string[]; rows: string[][] }
  | { id: string; type: "split";       heading?: string; content: string; src: string; alt: string; aspectRatio?: string }
  | { id: string; type: "steps";       label?: string; items: string[] }
  | { id: string; type: "persona";     name: string; meta: string; quote: string; goals: string[]; frustrations: string[] }
  | { id: string; type: "code";        label?: string; language?: string; code: string }
  | { id: string; type: "divider" }
  | { id: string; type: "outro";       content: string; links: SectionLink[] };
