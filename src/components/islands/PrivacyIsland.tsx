import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>At BuildForms, we collect information you provide when creating your account and workspace - your name, email address, and any form data and responses you create or collect on our platform.</p>
        <h4 className="font-display font-semibold text-foreground mt-4 mb-2">Google Account Data (via OAuth)</h4>
        <p>If you connect your Google account, we access the following with your explicit permission:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>forms.body.readonly</strong> - to read your form structure and questions</li>
          <li><strong>forms.responses.readonly</strong> - to read existing form submissions</li>
          <li><strong>drive.file</strong> - to create and manage spreadsheets that BuildForms creates for syncing submissions</li>
          <li><strong>userinfo.email</strong> - to identify your Google account</li>
        </ul>
        <p className="mt-3">We access Google data only when you explicitly trigger an action - such as importing a form or syncing submissions to a spreadsheet. We do not continuously monitor your Google account, and we can only access files that BuildForms itself creates (via the drive.file scope). We never sell or share your Google data with third parties.</p>
      </>
    ),
  },
  {
    num: "02",
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Provide and operate our form builder platform</li>
        <li>Power AI-driven form creation, editing, and response analysis</li>
        <li>Generate reports and insights from your form submissions</li>
        <li>Enable Google Forms import and Google Sheets export features</li>
        <li>Communicate with you about platform updates</li>
        <li>Improve our services through aggregated, anonymized usage data</li>
      </ul>
    ),
  },
  {
    num: "03",
    title: "Google API Services - Limited Use Disclosure",
    content: (
      <>
        <p>BuildForms' use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>We only request Google data necessary for features you explicitly use</li>
          <li>We do not use Google user data to serve advertisements</li>
          <li>We do not allow humans to read your Google data unless you explicitly request support, or we are required to by law</li>
          <li>We do not use or transfer Google user data for any purpose other than providing and improving BuildForms</li>
        </ul>
      </>
    ),
  },
  {
    num: "04",
    title: "Information Sharing",
    content: (
      <p>We do not sell your personal information or Google data to third parties. We may share aggregate, anonymized usage data to improve our services. We may disclose data if required by law or to protect the rights and safety of our users.</p>
    ),
  },
  {
    num: "05",
    title: "Data Security",
    content: (
      <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. As we are in beta, we continuously improve our security practices.</p>
    ),
  },
  {
    num: "06",
    title: "Beta Platform Notice",
    content: (
      <p>BuildForms is currently in beta. During this phase, we may collect additional usage data to improve the platform. We will always notify you of any significant changes to our data collection practices.</p>
    ),
  },
  {
    num: "07",
    title: "Your Rights",
    content: (
      <>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access and update your personal information</li>
          <li>Disconnect your Google account from BuildForms at any time</li>
          <li>Request deletion of your account and all associated data, including imported Google data</li>
          <li>Control who can view your forms and responses</li>
          <li>Opt out of certain communications</li>
        </ul>
        <p className="mt-3">To exercise these rights, contact us at <a href="mailto:buildforms@googlegroups.com" className="text-foreground underline underline-offset-2 hover:text-foreground/80">buildforms@googlegroups.com</a>.</p>
      </>
    ),
  },
  {
    num: "08",
    title: "Cookies and Tracking",
    content: (
      <p>We use cookies and similar technologies to maintain your session, analyze platform usage, and improve your experience. You can control cookie settings through your browser preferences.</p>
    ),
  },
  {
    num: "09",
    title: "Updates to This Policy",
    content: (
      <p>We may update this Privacy Policy as we develop new features. We will notify you of any material changes and update the "Last Updated" date at the top of this page.</p>
    ),
  },
  {
    num: "10",
    title: "Contact Us",
    content: (
      <>
        <p>If you have questions about this Privacy Policy or how we handle your data - including your Google data - please reach out:</p>
        <div className="mt-3 space-y-1">
          <p><span className="text-muted-foreground">Email</span> <a href="mailto:buildforms@googlegroups.com" className="text-foreground underline underline-offset-2 hover:text-foreground/80 ml-2">buildforms@googlegroups.com</a></p>
          <p><span className="text-muted-foreground">Web</span> <a href="https://www.buildforms.so" className="text-foreground underline underline-offset-2 hover:text-foreground/80 ml-2" target="_blank" rel="noopener noreferrer">https://www.buildforms.so</a></p>
        </div>
      </>
    ),
  },
];

const Privacy = () => {
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
            Privacy Policy
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

export default Privacy;
