import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackCTA } from "@/lib/analytics";
import { BOOK_DEMO_EVENT } from "@/constants/book-demo";
import { APP_AUTH_HREF } from "@/constants/app-urls";
import { ExternalAppLink } from "@/components/ExternalAppLink";
import { MarketingGradientBackdrop } from "@/components/MarketingGradientBackdrop";

const AUDIENCE_PHRASES = [
  "FAST TEAMS",
  "STARTUP FOUNDERS",
  "GROWING STARTUPS",
  "RECRUITERS",
  "TALENT AGENCIES",
  "HIRING MANAGERS",
] as const;

const ROTATE_MS = 3200;

const HeroSection = () => {
  const openBookDemo = () => {
    window.dispatchEvent(new CustomEvent(BOOK_DEMO_EVENT));
  };
  const [audienceIndex, setAudienceIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAudienceIndex((i) => (i + 1) % AUDIENCE_PHRASES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
      <MarketingGradientBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto w-full section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/50 mb-4 sm:mb-6 flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1">
            <span className="shrink-0">The hiring OS for</span>
            <span
              className="inline-block min-w-[12.5rem] sm:min-w-[5rem] text-white/90 normal-case tracking-normal font-semibold"
              aria-live="polite"
              aria-atomic="true"
            >
              <span
                key={AUDIENCE_PHRASES[audienceIndex]}
                className="inline-block animate-hero-audience-pop"
              >
                {AUDIENCE_PHRASES[audienceIndex]}
              </span>
            </span>
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Set up your hiring
            <br />
            <span className="text-white/50">system in minutes</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
            Collect structured applications and instantly identify your best
            candidates.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <ExternalAppLink
              href={APP_AUTH_HREF}
              onClick={() => trackCTA("Start Hiring Free", "hero")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-foreground font-medium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-white/90 transition-colors"
            >
              Start Hiring Free
              <ArrowRight size={16} />
            </ExternalAppLink>
            <button
              type="button"
              onClick={() => {
                trackCTA("See How It Works", "hero");
                openBookDemo();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 text-white font-medium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-white/10 transition-colors"
            >
              See How It Works
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
