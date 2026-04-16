import AnimatedSection from "./AnimatedSection";
import { Check } from "lucide-react";

const capabilities = [
  "Create structured hiring pipelines in minutes",
  "Collect applications through branded, shareable forms",
  "Evaluate candidates with AI-powered scoring and summaries",
  "Communicate with candidates directly from the platform",
  "Collaborate with your team — shared notes, ratings, and decisions",
];

const SolutionSection = () => {
  return (
    <section id="solution" className="section-spacing section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            The solution
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
            One platform for the entire hiring workflow.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            BuildForms replaces the patchwork. Everything your team needs to find, evaluate, and hire — in one place.
          </p>
        </AnimatedSection>

        <div className="mt-12 max-w-xl">
          {capabilities.map((cap, i) => (
            <AnimatedSection key={i} delay={i * 0.06}>
              <div className="flex items-start gap-3 py-3">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-primary-foreground" strokeWidth={2.5} />
                </div>
                <p className="text-foreground leading-relaxed">{cap}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
