import AnimatedSection from "./AnimatedSection";
import Grainient from "./Grainient";
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
      className="relative section-spacing min-h-[50vh] overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#162544"
          color2="#1e3a5f"
          color3="#2a4a6e"
          timeSpeed={0.1}
          colorBalance={0}
          warpStrength={0.8}
          warpFrequency={3}
          warpSpeed={1}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.08}
          rotationAmount={400}
          noiseScale={2}
          grainAmount={0.06}
          grainScale={2}
          grainAnimated={false}
          contrast={1.2}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
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
