import { ABOUT_SECTIONS } from "./about-sections";
import { TESTIMONIALS_SECTIONS } from "./testimonials-sections";
import { SKILLS_SECTIONS } from "./skills-sections";
import { RESUME_SECTIONS } from "./resume-sections";
import { CONTACT_SECTIONS } from "./contact-sections";
import { SOLE_LUCKY_SECTIONS } from "@/components/projects/sole-lucky-sections";
import { BATTERY_TRADER_SECTIONS } from "@/components/projects/battery-trader-sections";
import { DESIGN_SKILLS_SECTIONS } from "@/components/projects/design-skills-sections";
import { HITHE_SECTIONS } from "@/components/projects/hithe-sections";
import { RAMBLE_AI_SECTIONS } from "@/components/projects/ramble-ai-sections";
import type { Section } from "./section-types";

export interface SearchEntry {
  id: string;
  section: Section;
  feature: string;
  displayTitle: string;
  searchText: string;
}

function stripMarkers(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, "$1");
}

function toSearchText(s: Section): string {
  const idWords = s.id.replace(/-/g, " ");
  switch (s.type) {
    case "heading":
    case "label":
    case "subheading":
      return `${idWords} ${s.content}`;
    case "paragraph":
    case "muted":
      return `${idWords} ${stripMarkers(s.content)}`;
    case "list":
      return `${idWords} ${s.label} ${s.items.join(" ")}`;
    case "skill-group":
      return `${idWords} ${s.label} ${s.skills.map((sk) => sk.label).join(" ")}`;
    case "job":
      return `${idWords} ${s.jobTitle} ${s.company} ${s.period} ${s.bullets.join(" ")}`;
    case "avatar-quote":
      return `${idWords} ${s.name} ${s.title} ${s.company} ${s.quote}`;
    case "outro":
      return `${idWords} ${stripMarkers(s.content)}`;
    case "meta":
      return `${idWords} ${s.lines.map((l) => `${l.label} ${l.value}`).join(" ")}`;
    case "table":
      return `${idWords} ${s.label ?? ""} ${s.headers.join(" ")} ${s.rows.flat().join(" ")}`;
    case "callout-stack":
      return `${idWords} ${s.items.map((i) => `${i.label} ${i.body}`).join(" ")} ${s.footer ?? ""}`;
    case "badge-flow":
      return `${idWords} ${s.steps.join(" ")} ${s.result}`;
    case "split":
      return `${idWords} ${s.heading ?? ""} ${s.content}`;
    case "text-gallery":
      return `${idWords} ${s.heading ?? ""} ${s.content}`;
    case "steps":
      return `${idWords} ${s.label ?? ""} ${s.items.join(" ")}`;
    case "persona":
      return `${idWords} ${s.name} ${s.meta} ${s.quote} ${s.goals.join(" ")} ${s.frustrations.join(" ")}`;
    case "code":
      return `${idWords} ${s.label ?? ""} ${s.code}`;
    default:
      return idWords;
  }
}

function toDisplayTitle(s: Section): string {
  switch (s.type) {
    case "heading":
    case "label":
    case "subheading":
      return s.content;
    case "paragraph":
    case "muted": {
      const plain = stripMarkers(s.content);
      return plain.length > 64 ? plain.slice(0, 64) + "…" : plain;
    }
    case "list":
      return s.label;
    case "skill-group":
      return s.label;
    case "job":
      return `${s.jobTitle} · ${s.company}`;
    case "avatar-quote":
      return `${s.name}: ${s.title}`;
    case "outro":
      return "Outro";
    case "meta":
      return "Project Info";
    case "table":
      return s.label ?? `${s.headers[0]} Table`;
    default:
      return s.id;
  }
}

const NON_SEARCHABLE = new Set(["divider", "outro", "image", "image-grid", "token-arch", "split-stack"]);

const SOURCES: Array<{ feature: string; sections: Section[] }> = [
  { feature: "about",        sections: ABOUT_SECTIONS        },
  { feature: "testimonials", sections: TESTIMONIALS_SECTIONS },
  { feature: "skills",       sections: SKILLS_SECTIONS       },
  { feature: "resume",       sections: RESUME_SECTIONS       },
  { feature: "contact",      sections: CONTACT_SECTIONS      },
  { feature: "project",      sections: SOLE_LUCKY_SECTIONS      },
  { feature: "project",      sections: BATTERY_TRADER_SECTIONS  },
  { feature: "project",      sections: DESIGN_SKILLS_SECTIONS   },
  { feature: "project",      sections: HITHE_SECTIONS            },
  { feature: "project",      sections: RAMBLE_AI_SECTIONS        },
];

export const SEARCH_INDEX: SearchEntry[] = SOURCES.flatMap(({ feature, sections }) =>
  sections
    .filter((s) => !NON_SEARCHABLE.has(s.type))
    .map((s) => ({
      id: s.id,
      section: s,
      feature,
      displayTitle: toDisplayTitle(s),
      searchText: toSearchText(s).toLowerCase(),
    }))
);

export function searchSections(query: string): SearchEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return SEARCH_INDEX
    .filter((entry) => terms.every((t) => entry.searchText.includes(t)))
    .slice(0, 20);
}
