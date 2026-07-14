/* Pre-scripted chatbot responses for the portfolio */

export interface Response {
  match: (input: string) => boolean;
  text: string;
}

const responses: Response[] = [
  /* ── History conversations ──────────────────────────────────────────────── */
  {
    match: (s) => /who is json|json.*celebrity|celebrity.*json/i.test(s),
    text: `JSON isn't a celebrity, but he's had more relationships than one. Every API, every config file, every app on your phone has been with him at some point. No last name. No vowels wasted. Just curly braces and commitment issues.`,
  },
  {
    match: (s) => /design token.*like.*5|explain.*design token|design token.*five|token.*crayon/i.test(s),
    text: `Imagine your favorite crayon is called "blue." Now imagine grown-ups renamed it "color-primary-500" so nobody's feelings get hurt when marketing wants to change it to teal next year. That's a design token. Same crayon, more meetings.`,
  },
  {
    match: (s) => /hallucination.*lie|ai.*lies|slept.*30|30.*hours|hallucination.*sleep/i.test(s),
    text: `Technically both. Mine happens when I'm confident and wrong. Yours happens when you're confident, wrong, and also see your cat walk through a wall. Get some sleep.`,
  },
  {
    match: (s) => /design sprint.*running|running shoes|design sprint/i.test(s),
    text: `No running shoes, just running out of patience by Wednesday. Five days, one whiteboard, and a group of people agreeing to disagree until Friday when someone finally says "what if we just made the button bigger."`,
  },
  {
    match: (s) => /kill.*process.*threat|kill the process|threat.*call someone/i.test(s),
    text: `No need to call anyone, it's just Ctrl+C for your computer. Though if you say it out loud in a crowded coworking space, don't be surprised if someone looks over.`,
  },
  {
    match: (s) => /rest.*api.*tired|rest api|representational state|get.*post.*put/i.test(s),
    text: `Sort of. REST stands for Representational State Transfer, but emotionally it stands for "please stop calling me, I have nothing left to GET, POST, or PUT."`,
  },
  {
    match: (s) => /\/work|case stud|show.*work|portfolio/i.test(s),
    text: `Here's a look at my case studies:\n\n• **Hithe** — An LLM gateway for regulated industries at Dais Co. I designed the full product UX from zero, including a token metering dashboard, audit log interface, and client management flows.\n\n• **Design Skills & Guardrails System** — I built an AI-readable design system that helped Claude Code generate on-brand UI by default, cutting most of the manual rework from AI drift.\n\n• **Battery Trader** — A multi-tenant web app for battery and renewable site owners to plan, bid, and analyze energy market operations.\n\n• **Sole Lucky** — A raffle-based sneaker app that replaces resale markup with earned access.\n\nClick any title in the sidebar to dive in, or ask me about a specific one.`,
  },
  {
    match: (s) => /hithe|llm.*gateway|gateway/i.test(s),
    text: `Hithe is an LLM gateway I designed at Dais Co. for regulated industries.\n\nIt sits between client applications and upstream model providers to meter, govern, and audit API traffic. The design challenge was making a deeply technical infrastructure product feel navigable — quota dashboards, per-client token budgets, audit logs, and provider routing all in a single coherent UI.\n\nI built this from scratch as the sole designer, including the design system tokens, component library, and product strategy sessions with the engineering team.`,
  },
  {
    match: (s) => /design.*skill|guardrail|skill.*file|design.*system.*dais/i.test(s),
    text: `The Design Skills & Guardrails System was probably the most meta project I've ever worked on.\n\nI built structured skill files and guardrails that helped Claude Code generate on-brand UI by default — three separate layers tuned for product UI, marketing, and proof-of-concept surfaces. The system cut most of the rework that comes from AI drift, with a final review from me before anything shipped.\n\nThis site you're looking at right now is built using a version of that same approach.`,
  },
  {
    match: (s) => /battery|pci|energy|trader/i.test(s),
    text: `Battery Trader is a web-based, multi-tenant ops planning and bidding app I designed at PCI Energy Solutions.\n\nSite owners use it to plan battery dispatch strategies, submit bids into energy markets, and analyze performance data across multiple sites. The main design challenge was representing dense time-series data and market windows in a way operators could act on quickly under time pressure.\n\nI co-built the PCI design system alongside this project over about 3 years.`,
  },
  {
    match: (s) => /sole|lucky|sneak|raffle|funk/i.test(s),
    text: `Sole Lucky — Funk Products · iOS · Jan–Mar 2023\nRole: UX Research, Product Design, Brand & UI System\n\nIntroduction\n\nSole Lucky reimagines how people get access to limited sneaker releases. Instead of competing against bots and resellers on the secondary market, users enter raffles for a chance to buy at retail price. A points system rewards repeat participation with better odds over time.\n\nThe Goal\n\nDesign an app where users feel like they're getting a fair shot at exclusive releases — not just another chance to lose to automated buying.\n\nThe Challenge\n\nSneaker raffles have a trust problem. Most platforms don't explain how winners are chosen, bots dominate high-demand drops, and resale prices push casual fans out of the market entirely. The design challenge was building a raffle experience transparent enough that users could trust the odds, wrapped in a UI clean enough to compete with retail-grade apps.\n\nThe Research\n\nCompetitive audit — after evaluating StockX, GOAT, eBay, and Foot Locker, David pulled the strengths and weaknesses of each and used them to Sole Lucky's advantage.\n\nSurvey — 20 participants, covering screener questions, pain points, and open feedback. Three things came up constantly: resale markup pricing people out, bots rigging the system, and apps logging users out mid-raffle.\n\nUser Personas\n\nRyan McClure, 23, Oklahoma City — "I don't need the hookup, I just want a fair shot at retail price." His frustration with bots and login drops directly shaped the points-based odds system and the Face ID requirement.\n\nCarlos, 42, Bixby OK — "I want to see what I need, get it, and get out." His need for family-wide shopping drove the homepage expansion to include women's and kids' categories, and his payment frustration shaped the multi-card checkout requirement.\n\nDesign Validation\n\nEarly sketches kept the design anchored to a fast, low-friction entry flow. Wireframes translated that into screen-level decisions. One round of usability testing surfaced four key changes: add Face ID for login and purchases, support multiple payment cards beyond Apple/Google Pay, let users browse before signup, and expand the homepage beyond men's releases.\n\nBrand & UI System\n\nTypography: Turret Road for display and headlines only — logo, section titles, hero moments. JetBrains Mono for all UI body, labels, and functional data: prices, sizes, points, entry counts, deadlines. The mono face makes numeric data feel deliberate and legible, reinforcing an agile product feel over lifestyle-brand polish.\n\nHigh Fidelity\n\nThe final designs added expanded homepage categories and the points-based reward system. The more you participate, the better your raffle odds — a direct answer to users who felt the system was rigged against them.\n\nImpact\n\nSole Lucky gives users like Ryan a fair, bot-resistant shot at retail-priced releases, and gives users like Carlos a faster, family-friendly shopping experience with the payment flexibility he needed.\n\nWhat David Learned\n\nDesigning for a points-based access system meant every product decision had to account for perceived fairness, not just usability. Both personas needed to trust that the raffle mechanic itself wasn't rigged — and that's a harder design problem than clean UI alone solves.\n\nNext steps: build a responsive companion site for desktop, run a usability round focused on whether the points system feels transparent, and revisit the competitive audit periodically as resale and raffle apps evolve their models.`,
  },
  {
    match: (s) => /\/about|about.*you|about.*david|who are you|background|experience/i.test(s),
    text: `I'm David Rivas — a product designer based in Oklahoma with over 13 years of experience.\n\nI like owning the whole picture: not just the screens, but the strategy behind them and the systems that hold them together.\n\nMost recently I was the sole designer at Dais, an AI agentic orchestration company. Before that, three years at PCI Energy Solutions, three years as Creative Director for a dental group, and eight years working up to Creative Marketing Director at PhoneDoctors.\n\nI'm bilingual, self-taught, and genuinely fascinated by how much a single designer can build when AI is a real part of the workflow.\n\nIf you want to connect, find me on LinkedIn — I keep my email off the site to avoid spambots.`,
  },
  {
    match: (s) => /contact|email|reach|hire|linkedin|resume/i.test(s),
    text: `Best way to reach me is LinkedIn — I'm at linkedin.com/in/iamdavidrivas\n\nI keep my email off the public site to avoid spambots. If you're looking to connect about a role or project, a message there works great. I check it regularly.`,
  },
  {
    match: () => true, /* fallback */
    text: `Good question — I'm a portfolio chatbot so my knowledge is limited to David's work and background.\n\nTry asking about a specific case study, or type / to see what I can help you explore.`,
  },
];

export function getResponse(input: string): string {
  const match = responses.find((r) => r.match(input));
  return match?.text ?? responses[responses.length - 1].text;
}
