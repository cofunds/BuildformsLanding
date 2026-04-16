import AnimatedSection from "./AnimatedSection";

const VisionSection = () => {
  return (
    <section className="section-spacing section-padding bg-subtle">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            Vision
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-3xl">
            The future of hiring is AI-native.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            We're building toward a world where AI handles the mechanical work of hiring — screening, summarising, scheduling — so humans can focus on the human part: finding people they actually want to work with.
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            BuildForms is the foundation. Every feature we ship moves hiring closer to what it should be: fast, fair, and focused.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VisionSection;
