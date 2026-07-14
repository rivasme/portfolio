import type { Section } from "./section-types";

export const TESTIMONIALS_SECTIONS: Section[] = [
  {
    id: "testimonials-header",
    type: "heading",
    content: "What People Say About David",
  },

  {
    id: "testimonials-mike-conolly",
    type: "avatar-quote",
    avatar: "/images/avatars/mike-conolly.png",
    name: "Mike Conolly",
    title: "VP of Design",
    company: "Ennrgy AI",
    quote: "I had the pleasure of working with and serving as David's manager. I consistently appreciated his dedication, professionalism, and commitment to delivering thoughtful user experiences. He led the design effort on several key projects, always producing high quality work while remaining open to feedback and continually striving to improve. I would confidently recommend David to any team looking for a talented, collaborative, and dependable designer.",
  },
  { id: "testimonials-divider-1", type: "divider" },

  {
    id: "testimonials-stephanie-pinkston",
    type: "avatar-quote",
    avatar: "/images/avatars/stephanie-pinkston.png",
    name: "Stephanie Pinkston",
    title: "Sr. Director of Marketing",
    company: "Cherokee Nation Business",
    quote: "It's tough to find someone with this capacity when stepping into a company cold, with no previous knowledge of branding or company culture. Also, responsive, respectful and very motivated. Highly recommend the chance to work with him!",
  },
  { id: "testimonials-divider-2", type: "divider" },

  {
    id: "testimonials-jordon-smith",
    type: "avatar-quote",
    avatar: "/images/avatars/jordon-smith.png",
    name: "Jordon Smith, DDS",
    title: "Dentist & Owner",
    company: "Blossom Gum",
    quote: "David has a remarkable ability to listen to your desires and consider your tastes, ensuring the final outcome is better than you could have imagined!",
  },
  { id: "testimonials-divider-3", type: "divider" },

  {
    id: "testimonials-brandon-gaffney",
    type: "avatar-quote",
    avatar: "/images/avatars/brandon-gaffney.png",
    name: "Brandon Gaffney",
    title: "Sr. VP of Marketing",
    company: "Regent Bank",
    quote: "Consistently delivers top-notch design work and has an exceptional ability to overcome creative challenges. His dedication and skills have only grown since our time working together and beyond, making him a reliable and inventive design professional.",
  },
  { id: "testimonials-divider-4", type: "divider" },

  {
    id: "testimonials-jesse-wells",
    type: "avatar-quote",
    avatar: "/images/avatars/jesse-wells.png",
    name: "Jesse Wells",
    title: "Senior Software Engineer",
    company: "Cisco",
    quote: "David has a good pulse on what users want! He's a great team player who collaborates well to get things done!",
  },
  { id: "testimonials-divider-5", type: "divider" },

  {
    id: "testimonials-james-ashford",
    type: "avatar-quote",
    avatar: "/images/avatars/james-ashford.png",
    name: "James Ashford",
    title: "Vice President",
    company: "Native Health Advisors",
    quote: "David is an amazing designer. Unlike many talented designers he has the ability to understand business and think between the lines to communicate with non-artistic people to help them reach their desired look.",
  },
  { id: "testimonials-divider-6", type: "divider" },

  {
    id: "testimonials-dustin-woods",
    type: "avatar-quote",
    avatar: "/images/avatars/dustin-woods.png",
    name: "Dustin Woods",
    title: "Co-founder & COO",
    company: "NSPYR Pool",
    quote: "Having David take an idea in your head and visually make it come to life is a highly sought after skill. Fortunately, we found David and that has done that time and time again!",
  },
  { id: "testimonials-divider-7", type: "divider" },

  {
    id: "testimonials-brett-wilson",
    type: "avatar-quote",
    avatar: "/images/avatars/brett-wilson.png",
    name: "Brett Wilson",
    title: "President",
    company: "DigiDoc",
    quote: "Created a number of products for our company. Innovative and completed with edits in a timely manner. Would definitely recommend David!",
  },

  {
    id: "testimonials-outro",
    type: "outro",
    content: "Want to learn more? {{Ask about David}} or see what he's been {{building}}.",
    links: [
      { label: "Ask about David", query: "/about"    },
      { label: "building",        query: "/projects" },
    ],
  },
];
