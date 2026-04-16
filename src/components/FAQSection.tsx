import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { trackFAQOpen } from "@/lib/analytics";

const faqs = [
  {
    q: "What is an AI hiring tool and how does BuildForms work?",
    a: "BuildForms is an AI-powered hiring platform that helps teams collect structured candidate applications, automatically evaluate them using AI, and identify top applicants instantly. Unlike generic form builders, it's purpose-built for hiring - structuring candidate data for faster, better decision-making.",
  },
  {
    q: "How can I speed up my hiring process for startups?",
    a: "BuildForms eliminates the biggest bottleneck in startup hiring - manual resume screening. You create a structured application flow, share a link, and our AI scores and ranks every applicant against your criteria automatically. Teams go from hundreds of applications to a clear shortlist in minutes, not days.",
  },
  {
    q: "Is BuildForms better than a traditional applicant tracking system (ATS)?",
    a: "Traditional ATS tools focus on tracking candidates through stages. BuildForms focuses on evaluating them - using AI to summarize profiles, score applicants, and surface your best matches. It's built for founders and small teams who need speed and clarity, not the complexity of enterprise HR software.",
  },
  {
    q: "Can I use AI to screen and evaluate job applications automatically?",
    a: "Yes. Once candidates submit their applications through BuildForms, the AI summarizes each profile, scores them against the criteria you set, flags potential concerns, and ranks applicants so you see your strongest candidates first. It replaces hours of manual screening with instant, structured evaluation.",
  },
  {
    q: "What size teams is BuildForms designed for?",
    a: "BuildForms is built for founders and small teams (0-50 people) who are actively hiring but don't need the overhead of enterprise ATS tools. If you're currently juggling spreadsheets, email, and Slack to manage applications, BuildForms replaces all of that with one streamlined system.",
  },
  {
    q: "How do I set up a hiring pipeline with BuildForms?",
    a: "You can set up your first hiring pipeline in minutes. Create a custom application flow with role-specific questions, share the link with candidates, and start receiving structured applications right away. No technical setup, no complex onboarding - just create, share, and hire.",
  },
  {
    q: "How does BuildForms handle candidate communication?",
    a: "BuildForms lets you email candidates directly from the platform - no more switching between tabs, inboxes, and Slack threads. All communication lives alongside candidate data so your entire team has full context and visibility into every conversation.",
  },
  {
    q: "Is BuildForms a form builder for hiring?",
    a: "BuildForms is not a generic form builder. It's a structured intake and evaluation system designed specifically for hiring. While it does let you create application forms, the real value is what happens after - AI-powered evaluation, candidate ranking, team collaboration, and built-in communication that generic form tools can't offer.",
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => {
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen) trackFAQOpen(q);
        }}
        className="flex w-full items-center justify-between gap-4 py-4 sm:py-5 text-left"
      >
        <span className="text-sm sm:text-base font-medium text-foreground">{q}</span>
        <span
          className={`shrink-0 text-muted-foreground text-lg sm:text-xl leading-none select-none transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-4 sm:pb-5 pr-6 sm:pr-8">
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQSection = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "faq-schema";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <section id="faq" className="section-spacing">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-center">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="mt-10 sm:mt-14">
            <AnimatedSection delay={0.06}>
              {faqs.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
