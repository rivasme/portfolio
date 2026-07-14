import type { Section } from "./section-types";

export const CONTACT_SECTIONS: Section[] = [
  {
    id: "contact-header",
    type: "subheading",
    content: "This site does not expose raw contact fields.",
  },
  {
    id: "contact-body",
    type: "paragraph",
    content: "Consider it a rate limit against spam bots, robocalls, and the occasional crypto DM. {{Linkedin}} is the sanctioned endpoint. It has a login wall, a real human on the other end, and zero patience for \"exciting investment opportunities.\"",
    links: [{ label: "Linkedin", href: "https://www.linkedin.com/in/iamdavidrivas/" }],
  },
  {
    id: "contact-dispatch-note",
    type: "muted",
    content: "Response time varies. He's usually faster than a ticket queue and slower than a Slack ping.",
  },
];
