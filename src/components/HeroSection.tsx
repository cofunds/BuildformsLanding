import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Grainient from "./Grainient";
import { trackCTA } from "@/lib/analytics";
import { BOOK_DEMO_EVENT } from "@/constants/book-demo";

const AUDIENCE_PHRASES = [
  "FAST TEAMS",
  "STARTUP FOUNDERS",
  "GROWING STARTUPS",
  "RECRUITERS",
  "TALENT AGENCIES",
  "HIRING MANAGERS"
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
    <section className="relative min-h-[100vh] flex items-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 overflow-hidden">
      {/* Grainient background - dark deep blue */}
      <div className="absolute inset-0 z-0">
        <Grainient
          color1="#162544"
          color2="#1e3a5f"
          color3="#2a4a6e"
          timeSpeed={0.15}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={4}
          warpSpeed={1.5}
          warpAmplitude={60}
          blendAngle={0}
          blendSoftness={0.08}
          rotationAmount={400}
          noiseScale={2}
          grainAmount={0.08}
          grainScale={2}
          grainAnimated={false}
          contrast={1.3}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-left max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/50 mb-4 sm:mb-6 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="shrink-0">The hiring OS for</span>
            <span
              className="inline-block min-w-[12.5rem] sm:min-w-[14.5rem] text-white/90 normal-case tracking-normal font-semibold"
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
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
            Collect structured applications and instantly identify your best candidates.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
            <a
              href="https://beta.buildforms.so/auth"
              onClick={() => trackCTA("Start Hiring Free", "hero")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-foreground font-medium h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-white/90 transition-colors"
            >
              Start Hiring Free
              <ArrowRight size={16} />
            </a>
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
