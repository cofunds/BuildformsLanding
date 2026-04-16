import posthog from "posthog-js";
import { getLandingSectionMeta } from "@/lib/landingSections";

export function trackCTA(buttonName: string, location: string) {
  posthog?.capture("cta_clicked", { button_name: buttonName, location });
}

export function trackSectionView(
  sectionId: string,
  options?: { intersectionRatio?: number }
) {
  const meta = getLandingSectionMeta(sectionId);
  posthog?.capture("section_viewed", {
    section_id: sectionId,
    section_title: meta?.title ?? sectionId,
    section_headline: meta?.headline,
    section_index: meta?.order,
    ...(options?.intersectionRatio != null && {
      intersection_ratio: Number(options.intersectionRatio.toFixed(3)),
    }),
  });
}

export function trackFAQOpen(question: string) {
  posthog?.capture("faq_question_opened", { question });
}

export function trackNavClick(label: string) {
  posthog?.capture("nav_link_clicked", { label });
}
