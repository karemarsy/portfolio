export type Role = {
  id: string;
  years: string;
  company: string;
  title: string;
  summary: string;
  bullets: string[];
  defaultOpen?: boolean;
};

export const experienceIntro =
  "Eight years building and leading frontend work at a company I co-founded, a year of independent work, and now full stack financial systems.";

export const roles: Role[] = [
  {
    id: "adfinance",
    years: "May 2026 to now",
    company: "ADFinance Rwanda",
    title: "Senior Full Stack Software Developer, Kigali",
    summary:
      "I build and maintain enterprise applications for financial organisations and government institutions, working with product managers, designers and QA throughout the development cycle.",
    bullets: [
      "Full stack applications with React, Next.js, NestJS, Prisma and PostgreSQL",
      "Secure REST APIs and third-party integrations",
      "Role-based access control with Keycloak",
      "Unit and integration tests, CI/CD pipelines",
      "Docker containers deployed on AWS",
    ],
    defaultOpen: true,
  },
  {
    id: "independent",
    years: "Feb 2025 to Apr 2026",
    company: "Independent",
    title: "Freelance and personal projects",
    summary:
      "After Octan I worked on my own: freelance projects, software for an NGO, and products of my own, while going deeper into full stack development.",
    bullets: [
      "Personal Finance Assistant, a personal project",
      "Jukar, built for the Jukar NGO",
      "Glowell, a personal e-commerce project",
    ],
  },
  {
    id: "octan",
    years: "Sep 2016 to Jan 2025",
    company: "Octan Group",
    title: "Co-Founder, Head of Frontend and Senior Frontend Developer, Kigali",
    summary:
      "I co-founded Octan Group and led its frontend work, working directly with international clients to turn business requirements into software.",
    bullets: [
      "Led frontend development on more than 20 web applications for clients in Europe and Africa",
      "Managed and mentored the frontend team, ran code reviews",
      "React, Vue.js, Next.js, TypeScript and Shopify",
      "Responsive design, accessibility and reusable components",
    ],
  },
  {
    id: "auca",
    years: "Graduated 2019",
    company: "AUCA",
    title: "BSc in Information Technology, Networks and Communication Systems",
    summary:
      "Adventist University of Central Africa, Kigali. I studied while co-founding and building Octan Group.",
    bullets: ["BSc in Information Technology", "Major in Networks and Communication Systems"],
  },
];
