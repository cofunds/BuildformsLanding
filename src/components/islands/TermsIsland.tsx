import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const sections = [
  {
    num: "01",
    title: "Acceptance of Terms",
    content: (
      <p>By accessing and using BuildForms, you accept and agree to be bound by these Terms of Service. BuildForms is an AI-powered form builder platform that helps teams create, collect, and analyze form responses. If you do not agree to these terms, please do not use the platform.</p>
    ),
  },
  {
    num: "02",
    title: "Beta Service Notice",
    content: (
      <>
        <p>BuildForms is currently in beta. We are continuously shipping updates, fixes, and new features. During this phase, you may encounter:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Bugs or unexpected behavior</li>
          <li>Temporary outages or downtime</li>
          <li>Changes or removal of features without prior notice</li>
          <li>Limitations in data export or portability</li>
        </ul>
        <p className="mt-3">We appreciate your patience and feedback during this phase. Your input directly shapes the product.</p>
      </>
    ),
  },
  {
    num: "03",
    title: "User Accounts",
    content: (
      <p>You may create workspaces and build forms on our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately if you suspect any unauthorized use.</p>
    ),
  },
  {
    num: "04",
    title: "Acceptable Use",
    content: (
      <>
        <p>You agree to use BuildForms only for lawful purposes. You may not use our platform to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Post false, misleading, or deceptive content</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Distribute spam or malicious content via forms</li>
        </ul>
      </>
    ),
  },
  {
    num: "05",
    title: "Content and Intellectual Property",
    content: (
      <p>You retain ownership of all content you submit to BuildForms - including your forms, questions, and response data. By using the platform, you grant us a limited license to store, display, and process your content solely for the purpose of providing our services to you.</p>
    ),
  },
  {
    num: "06",
    title: "Google Integration",
    content: (
      <p>When you connect your Google account, you authorize BuildForms to read your Google Forms structure and responses, and to create and manage spreadsheet files on your behalf for syncing submissions. BuildForms can only access files it creates - not your existing Google Drive files. Full details are described in our Privacy Policy. You may revoke this access at any time through your Google account settings or from within BuildForms.</p>
    ),
  },
  {
    num: "07",
    title: "Privacy",
    content: (
      <p>Your privacy is important to us. Please review our <a href="/privacy" className="text-foreground underline underline-offset-2 hover:text-foreground/80">Privacy Policy</a> to understand how we collect, use, and protect your information - including data accessed via Google APIs.</p>
    ),
  },
  {
    num: "08",
    title: "Limitation of Liability",
    content: (
      <p>BuildForms shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. This is particularly applicable during our beta phase, where the platform is provided "as is" without warranties of any kind.</p>
    ),
  },
  {
    num: "09",
    title: "Modifications",
    content: (
      <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or an in-app notice. Continued use of the service after changes have been posted constitutes your acceptance of the updated terms.</p>
    ),
  },
  {
    num: "10",
    title: "Contact Information",
    content: (
      <>
        <p>If you have any questions about these Terms of Service, please reach out to us:</p>
        <div className="mt-3 space-y-1">
          <p><span className="text-muted-foreground">Email</span> <a href="mailto:buildforms@googlegroups.com" className="text-foreground underline underline-offset-2 hover:text-foreground/80 ml-2">buildforms@googlegroups.com</a></p>
          <p><span className="text-muted-foreground">Web</span> <a href="https://www.buildforms.so" className="text-foreground underline underline-offset-2 hover:text-foreground/80 ml-2" target="_blank" rel="noopener noreferrer">https://www.buildforms.so</a></p>
        </div>
      </>
    ),
  },
];

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto section-padding">
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">Legal</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last Updated: March 17, 2026</p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <div key={section.num} className="flex gap-5 sm:gap-8">
                <span className="font-display text-2xl sm:text-3xl font-bold text-neutral-200 select-none shrink-0 w-8 sm:w-10">
                  {section.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-3">
                    {section.title}
                  </h3>
                  <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed space-y-2">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
