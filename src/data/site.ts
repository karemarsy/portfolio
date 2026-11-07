export const site = {
  name: "Arsene Karema",
  shortName: "A. Karema",
  role: "Senior Full Stack Engineer",
  location: "Kigali, Rwanda",
  timeZone: "Africa/Kigali",
  email: "karemarsy@gmail.com",
  title: "Arsene Karema — Senior Full Stack Engineer, Kigali",
  description:
    "Arsene Karema is a senior full stack engineer in Kigali, Rwanda, building financial software from interface to database.",
  links: {
    linkedin: { label: "karema-arsene", href: "https://www.linkedin.com/in/karema-arsene/" },
    github: { label: "karemarsy", href: "https://github.com/karemarsy" },
  },
} as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
] as const;

/** Sections the navbar watches for its active-link indicator. */
export const trackedSections = ["work", "experience", "about", "stack", "contact"] as const;
