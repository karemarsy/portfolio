export type StackLayer = {
  name: string;
  tools: string[];
  detail: string;
  /** What happens at this layer during the example payment trace. */
  step: string;
};

export const stackIntro =
  "The seven layers I work across, and the tools I use in each. Open a layer for detail, or follow an example payment through all of them.";

export const stackLayers: StackLayer[] = [
  {
    name: "Interfaces",
    tools: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Material UI", "Figma"],
    detail:
      "Responsive, accessible interfaces built from reusable components, designed in Figma and shipped in React, Next.js or Vue.",
    step: "A customer confirms a payment in a React app",
  },
  {
    name: "State and logic",
    tools: ["TypeScript", "JavaScript", "Redux"],
    detail: "Typed client logic and predictable state, so what people see matches what the server knows.",
    step: "Redux holds the pending payment",
  },
  {
    name: "APIs",
    tools: ["REST", "Express.js", "Postman"],
    detail:
      "Secure REST APIs and third-party integrations, designed and tested before the screens depend on them.",
    step: "A REST request reaches the API",
  },
  {
    name: "Identity",
    tools: ["Keycloak"],
    detail:
      "Authentication and role-based access control with Keycloak, so each person sees only what they should.",
    step: "Keycloak checks the token and the user’s role",
  },
  {
    name: "Services",
    tools: ["Node.js", "NestJS"],
    detail: "Backend services in NestJS and Node.js that keep business rules in one place and easy to test.",
    step: "A NestJS service applies the business rules",
  },
  {
    name: "Data",
    tools: ["PostgreSQL", "MySQL", "Prisma"],
    detail: "Relational data models in PostgreSQL and MySQL, accessed through Prisma.",
    step: "Prisma writes the transaction to PostgreSQL",
  },
  {
    name: "Delivery",
    tools: ["Docker", "AWS", "CI/CD", "Jest", "Git", "GitHub"],
    detail: "Unit and integration tests with Jest, CI/CD pipelines, and Docker containers deployed on AWS.",
    step: "The service, running in Docker on AWS, responds",
  },
];

/** Final step of the trace returns to the interface layer. */
export const traceFinalStep = { layer: 0, text: "The confirmation appears on screen" };
