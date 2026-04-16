import AnimatedSection from "./AnimatedSection";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

const whyDifferentItems = [
  {
    title: "Form builders",
    description: "Great for collecting data. Terrible for hiring. No evaluation, no communication, no pipeline - you're back to spreadsheets.",
  },
  {
    title: "Enterprise ATS",
    description: "Built for 500-person HR departments. Bloated, expensive, and designed for a workflow you don't have.",
  },
  {
    title: "BuildForms",
    description: "Purpose-built for fast-moving teams. Everything from application to hire in one system - with AI doing the heavy lifting.",
  },
];

const WhyDifferentSection = () => {
  return (
    <section id="why-different" className="section-spacing">
      <div className="max-w-7xl mx-auto section-padding pb-10">
        <AnimatedSection>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            Why BuildForms
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Not another ATS.
          </h2>
        </AnimatedSection>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:items-stretch">
          <AnimatedSection delay={0.08}>
            <div className="relative flex h-full flex-col items-start border border-border p-3 sm:p-4">
              <EvervaultCard text={whyDifferentItems[0].title} className="!aspect-[4/3]" enabled={false} />
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {whyDifferentItems[0].description}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <div className="relative flex h-full flex-col items-start border border-border p-3 sm:p-4">
              <EvervaultCard text={whyDifferentItems[1].title} className="!aspect-[4/3]" enabled={false} />
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {whyDifferentItems[1].description}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.24}>
            <div className="relative flex h-full flex-col items-start border border-border p-3 sm:p-4">
              <Icon className="absolute -left-3 -top-3 h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              <Icon className="absolute -bottom-3 -left-3 h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              <Icon className="absolute -right-3 -top-3 h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
              <Icon className="absolute -bottom-3 -right-3 h-5 w-5 sm:h-6 sm:w-6 text-foreground" />

              <EvervaultCard text={whyDifferentItems[2].title} className="!aspect-[4/3]" />
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {whyDifferentItems[2].description}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
