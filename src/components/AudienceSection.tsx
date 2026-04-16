import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";
import { LineShadowText } from "./ui/line-shadow-text";

const audiences = [
  {
    boardTexts: ["STARTUP\nFOUNDERS", "EARLY STAGE\nTEAMS", "FIRST 10\nHIRES"],
    desc: "Hiring your first 10 employees? You don't need an enterprise ATS. You need something fast, smart, and out of the way.",
  },
  {
    boardTexts: ["SMALL\nTEAMS", "GROWING\nORG", "LEAN\nSETUP"],
    desc: "Growing teams share hiring responsibilities. Everyone sees the same pipeline, the same candidates, the same context.",
  },
  {
    boardTexts: ["RECRUITERS", "TALENT\nAGENCIES", "HIRING\nMANAGERS"],
    desc: "Independent recruiters or small agencies managing multiple roles. One tool for all your pipelines — clean and efficient.",
  },
];

function useCycleIndex(length: number, intervalMs: number) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs]);
  return idx;
}

const AudienceSection = () => {
  const cycleIdx = useCycleIndex(audiences[0].boardTexts.length, 6000);

  return (
    <section id="audience" className="section-spacing section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-center">
          Built for teams that move{" "}
          </h2>
          <h2 className="font-display text-6xl font-bold tracking-tight text-foreground text-center">
          <LineShadowText className="italic">Fast</LineShadowText>
          </h2>
        </AnimatedSection>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <TextFlippingBoard
                  text={audience.boardTexts[cycleIdx]}
                  className="w-full"
                />
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">{audience.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
