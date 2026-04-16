/** Single source of truth for scroll-depth section analytics (ids must match DOM `id` on sections). */
export const LANDING_SECTIONS = [
  {
    id: "problem",
    title: "The problem",
    headline: "Hiring today is fragmented.",
    order: 0,
  },
  {
    id: "features",
    title: "Product",
    headline: "Everything you need to hire.",
    order: 1,
  },
  {
    id: "why-different",
    title: "Why BuildForms",
    headline: "Not another ATS.",
    order: 2,
  },
  {
    id: "book-a-demo",
    title: "Book a demo",
    headline: "Start hiring without the chaos.",
    order: 3,
  },
  {
    id: "faq",
    title: "FAQ",
    headline: "Frequently Asked Questions",
    order: 4,
  },
] as const;

export type LandingSectionId = (typeof LANDING_SECTIONS)[number]["id"];

export function getLandingSectionMeta(sectionId: string) {
  return LANDING_SECTIONS.find((s) => s.id === sectionId);
}
