import { useEffect } from "react";
import { trackSectionView } from "@/lib/analytics";
import { LANDING_SECTIONS } from "@/lib/landingSections";

export function useSectionTracking() {
  useEffect(() => {
    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            trackSectionView(id, {
              intersectionRatio: entry.intersectionRatio,
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    LANDING_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
