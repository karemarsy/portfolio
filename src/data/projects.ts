export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Colour of the project's card in the deck. */
export type ProjectTone = "basalt" | "hill" | "accent" | "slate" | "mist";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  badge: string;
  description: string;
  tags: string[];
  tone: ProjectTone;
  image?: ProjectImage;
  /** Second screenshot that cross-fades in on hover. */
  hoverImage?: ProjectImage;
  link?: { href: string; label: string };
};

export type WorkGroup = {
  title: string;
  period: string;
  projects: Project[];
};

export const workIntro =
  "Financial systems at ADFinance, work I did independently, and client projects from my years at Octan Group.";

export const workGroups: WorkGroup[] = [
  {
    title: "At ADFinance",
    period: "2026 to now",
    projects: [
      {
        slug: "adfinance",
        title: "ADFinance",
        kind: "Fintech",
        badge: "Professional",
        description:
          "ADFinance is a fintech building core banking, digital channels and regulator-ready reporting for institutions across East and West Africa. I build and maintain enterprise applications across its products, working with product managers, designers and QA throughout the development cycle.",
        tags: ["React", "Next.js", "NestJS", "Prisma", "PostgreSQL", "Keycloak", "Docker", "AWS"],
        tone: "basalt",
        image: {
          src: "/images/work/adfinance.png",
          alt: "ADFinance homepage: core banking for Africa’s growth, built around the ADBanking Quantum core ledger",
          width: 1400,
          height: 906,
        },
        link: { href: "https://www.adfinance.co", label: "Visit adfinance.co" },
      },
    ],
  },
  {
    title: "Independent work",
    period: "2025 to 2026",
    projects: [
      {
        slug: "personal-finance-assistant",
        title: "Personal Finance Assistant",
        kind: "Personal finance, mobile",
        badge: "Personal project",
        description:
          "A private money app that tells you what you can spend today until payday, checks whether you can afford something, and tracks your savings goals. A rule-based coach answers questions about your spending and understands Kinyarwanda words. Everything stays on the phone.",
        tags: ["React", "Next.js", "Tailwind CSS"],
        tone: "hill",
        image: {
          src: "/images/work/personal-finance-assistant.webp",
          alt: "Three screens of the app: Can I afford it, today’s spending budget, and savings goals",
          width: 1400,
          height: 1050,
        },
        hoverImage: {
          src: "/images/work/personal-finance-assistant-alt.webp",
          alt: "",
          width: 1400,
          height: 1050,
        },
      },
      {
        slug: "jukar",
        title: "Jukar",
        kind: "Non-profit",
        badge: "Built for an NGO",
        description:
          "A website for Jukar, a family-led initiative in Rwanda that helps children from families facing hardship, and children who have lost their parents, go to school and keep learning. It shares the mission, the work and the stories behind it, and gives supporters a clear way to help.",
        tags: ["React", "Next.js", "Tailwind CSS"],
        tone: "accent",
        image: {
          src: "/images/work/jukar.webp",
          alt: "Homepage of the Jukar NGO website",
          width: 1400,
          height: 838,
        },
      },
      {
        slug: "glowell",
        title: "Glowell",
        kind: "E-commerce",
        badge: "Personal project",
        description:
          "An online shop for supplements and skincare, built as a personal project. Each product has its own showcase with details and a price in Rwandan francs, and shoppers can browse by category and add items to their bag as they go.",
        tags: ["React", "Next.js", "Tailwind CSS"],
        tone: "slate",
        image: {
          src: "/images/work/glowell.webp",
          alt: "Glowell shop homepage showing a collagen and vitamin C product",
          width: 1400,
          height: 796,
        },
      },
    ],
  },
  {
    title: "Client work at Octan Group",
    period: "2016 to 2025",
    projects: [
      {
        slug: "dacade",
        title: "Dacade",
        kind: "Education",
        badge: "Client work",
        description:
          "An interactive peer-to-peer learning platform, with responsive interfaces and a modern frontend architecture. Dacade is now a read-only archive.",
        tags: ["React", "Next.js"],
        tone: "mist",
        image: {
          src: "/images/work/dacade.webp",
          alt: "Homepage of the Dacade learning platform",
          width: 1400,
          height: 782,
        },
      },
      {
        slug: "rock-tech-lithium",
        title: "Rock Tech Lithium",
        kind: "Corporate web",
        badge: "Client work",
        description:
          "Reworked the frontend architecture to cut page load times and make the site more responsive.",
        tags: ["Frontend performance"],
        tone: "basalt",
        image: {
          src: "/images/work/rock-tech-lithium.webp",
          alt: "Homepage of the Rock Tech Lithium website",
          width: 1400,
          height: 794,
        },
      },
      {
        slug: "folkdays",
        title: "Folkdays",
        kind: "E-commerce",
        badge: "Client work",
        description:
          "Built and maintained the Shopify store for this fair trade design brand, with custom integrations and performance work. Folkdays now sells through White Label Project’s store.",
        tags: ["Shopify", "Custom integrations"],
        tone: "accent",
        image: {
          src: "/images/work/folkdays.webp",
          alt: "Homepage of the Folkdays website",
          width: 1400,
          height: 818,
        },
      },
    ],
  },
];
