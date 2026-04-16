import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { FileSpreadsheet, Mail, Users, Brain, Clock } from "lucide-react";

const painPoints = [
  { icon: FileSpreadsheet, title: "Scattered applications", desc: "Resumes in email, forms in spreadsheets, notes in Slack - nothing lives in one place." },
  { icon: Brain, title: "Manual screening", desc: "Hours spent reading resumes that could be evaluated in seconds with the right system." },
  { icon: Mail, title: "Fragmented communication", desc: "Candidate emails lost across inboxes, threads, and DMs with no audit trail." },
  { icon: Users, title: "No team alignment", desc: "Hiring decisions made without shared context, scorecards, or visibility." },
  { icon: Clock, title: "Slow time-to-hire", desc: "Great candidates slip away while you juggle five different tools." },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="pt-10 sm:pt-12 pb-24">
      <div className="max-w-7xl mx-auto section-padding">
        <AnimatedSection>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
            The problem
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Hiring today is fragmented.
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Most teams cobble together forms, spreadsheets, email, and chat to manage hiring. It's slow, messy, and costs you great candidates.
          </p>
        </AnimatedSection>

        {/* Bento grid: 3 top + 2 bottom (wider) */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {painPoints.map((point, i) => (
            <AnimatedSection
              key={point.title}
              delay={i * 0.08}
              className={
                i < 3
                  ? "lg:col-span-2"
                  : "lg:col-span-3"
              }
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group relative h-full rounded-[20px] bg-neutral-50 p-2 cursor-default"
                style={{
                  boxShadow: "rgba(17,24,28,0.08) 0 0 0 1px, rgba(17,24,28,0.08) 0 1px 2px -1px, rgba(17,24,28,0.04) 0 2px 4px",
                }}
              >
                <div className="rounded-[16px] bg-white p-5 sm:p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 transition-colors duration-300 group-hover:bg-neutral-900 group-hover:text-white">
                      <point.icon size={18} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-[15px] sm:text-base text-foreground mb-1.5">
                        {point.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
