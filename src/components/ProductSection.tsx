import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import Grainient from "./Grainient";
import { LayoutList, FileInput, Sparkles, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  /** Product screenshot; when absent, `mockup` is shown instead. */
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  mockup?: ReactNode;
};

const features: Feature[] = [
  {
    icon: LayoutList,
    title: "Create your pipeline",
    desc: "Set up stages, criteria, and workflows in minutes.",
    image: {
      src: "/images/hiring-pipeline.jpg",
      alt: "BuildForms hiring pipeline: candidate submissions with stages, search, and columns.",
      width: 3144,
      height: 2036,
    },
  },
  {
    icon: FileInput,
    title: "Collect applications",
    desc: "Branded forms candidates actually want to fill out.",
    image: {
      src: "/images/collect-applications.jpg",
      alt: "BuildForms application form for collecting candidate details.",
      width: 3144,
      height: 2036,
    },
  },
  {
    icon: Sparkles,
    title: "Evaluate with AI",
    desc: "Instant scoring, summaries, and red flag detection.",
    image: {
      src: "/images/ai-evaluate.jpg",
      alt: "BuildForms AI evaluation for candidate details.",
      width: 3144,
      height: 2036,
    },
  },
  {
    icon: MessageSquare,
    title: "Communicate",
    desc: "Email candidates directly. No more tab juggling.",
    image: {
      src: "/images/communicate.jpg",
      alt: "BuildForms communication for candidate details.",
      width: 3144,
      height: 2036,
    },
  },
];

function FeatureVisual({ feature }: { feature: Feature }) {
  if (feature.image) {
    return (
      <img
        src={feature.image.src}
        alt={feature.image.alt}
        width={feature.image.width}
        height={feature.image.height}
        className="w-full h-auto rounded-md block"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return feature.mockup ?? null;
}

const ProductSection = () => {
  return (
    <section id="features" className="relative section-spacing overflow-hidden">
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

      <div className="relative z-10 max-w-5xl mx-auto section-padding">
        <AnimatedSection className="text-center">
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/50 mb-3">
            Product
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Everything you need to hire.
          </h2>
        </AnimatedSection>

        <div className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
          {features.map((feature) => (
            <AnimatedSection key={feature.title}>
              <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-10 items-center">
                <div className="lg:w-1/2 min-w-0 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white/80 mb-2.5 mx-auto lg:mx-0">
                    <feature.icon size={16} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto lg:mx-0">{feature.desc}</p>
                </div>
                <div className="lg:w-1/3 min-w-0 w-full max-w-xs mx-auto lg:max-w-none">
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="rounded-xl bg-white p-3.5 shadow-lg shadow-black/20 overflow-hidden"
                  >
                    <FeatureVisual feature={feature} />
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
