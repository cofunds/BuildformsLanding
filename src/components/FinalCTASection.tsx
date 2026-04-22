import AnimatedSection from "./AnimatedSection";
import { MarketingGradientBackdrop } from "@/components/MarketingGradientBackdrop";
import { ArrowRight } from "lucide-react";
import { trackCTA } from "@/lib/analytics";
import { BOOK_DEMO_EVENT } from "@/constants/book-demo";
import { APP_AUTH_HREF } from "@/constants/app-urls";
import { ExternalAppLink } from "@/components/ExternalAppLink";

const FinalCTASection = () => {
  const openBookDemo = () => {
    window.dispatchEvent(new CustomEvent(BOOK_DEMO_EVENT));
  };

  return (
    <section
      id="book-a-demo"
      className="relative section-spacing min-h-[50vh] overflow-hidden flex items-center justify-center bg-[#0f172a]"
    >
      <MarketingGradientBackdrop />
      <div className="relative z-10 max-w-7xl mx-auto text-center section-padding">
        <AnimatedSection>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Start hiring without the chaos.
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/50 max-w-xl mx-auto">
            Set up your first pipeline in minutes. No credit card required.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <ExternalAppLink
              href={APP_AUTH_HREF}
              onClick={() => trackCTA("Get Started Free", "final-cta")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-foreground font-medium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-white/90 transition-colors"
            >
              Get Started Free
              <ArrowRight size={16} />
            </ExternalAppLink>
            <button
              type="button"
              onClick={() => {
                trackCTA("Book a Demo", "final-cta");
                openBookDemo();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 text-white font-medium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-white/10 transition-colors"
            >
              Book a Demo
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FinalCTASection;
