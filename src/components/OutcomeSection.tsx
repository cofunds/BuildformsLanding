import AnimatedSection from "./AnimatedSection";

const OutcomeSection = () => {
  return (
    <section className="section-spacing section-padding bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            From hundreds of applicants to a clear shortlist — faster.
          </h2>
          <p className="mt-6 text-lg opacity-70 max-w-xl mx-auto leading-relaxed">
            BuildForms compresses weeks of hiring chaos into a focused, AI-assisted workflow. Spend time deciding, not sorting.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default OutcomeSection;
