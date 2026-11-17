// Card data for the home page and /case-studies. `status` and `years` come from each case
// study's hero and show under the card ("Live 2025 to now"). `description` is read out to
// screen readers only. The piece of product UI on the card is in CaseStudyThumbnail, keyed by
// `slug`.

export const CASE_STUDIES = [
  {
    slug: "acquia-ai",
    href: "/case-studies/acquia-ai",
    title: "Acquia AI",
    description:
      "AI agents that can publish and delete across a company's sites. I designed how a person stays in charge of them, and built it in the prototype.",
    status: "Live",
    years: "2025 to now",
  },
  {
    slug: "drupal-canvas",
    href: "/case-studies/drupal-canvas",
    title: "Drupal Canvas",
    description:
      "I led the design of Drupal's new page builder and redesigned it from the ground up. It's now on over 13,500 sites.",
    status: "Live",
    years: "2025",
  },
  {
    slug: "acquia-source",
    href: "/case-studies/acquia-source",
    title: "Acquia Source",
    description:
      "I designed the navigation for every Acquia product, and built the 104-route prototype the product team demos from.",
    status: "Live",
    years: "2026 to now",
  },
  {
    slug: "evenui",
    href: "/case-studies/evenui",
    title: "EvenUI",
    description:
      "A desktop app that finds inconsistent UI on any web page and shows how to fix it. I came up with it, designed and built it, and launched it for Mac and Windows.",
    status: "Launched",
    years: "2026",
  },
  {
    slug: "site-studio-cohesion",
    href: "/case-studies/site-studio-cohesion",
    title: "Site Studio",
    description:
      "I helped sell a low-code Drupal builder to a £1m ARR customer, then rebuilt the whole app in React with one other engineer.",
    status: "Shipped",
    years: "2018 to 2025",
  },
  {
    slug: "union-roasted",
    href: "/case-studies/union-roasted",
    title: "Union Roasted",
    description:
      "I designed and built a Shopify site for a UK coffee roaster that didn't want to look like Shopify.",
    status: "Live",
    years: "2018",
  },
];
