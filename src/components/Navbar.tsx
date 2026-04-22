import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { trackCTA, trackNavClick } from "@/lib/analytics";
import { BOOK_DEMO_EVENT } from "@/constants/book-demo";
import { APP_AUTH_HREF } from "@/constants/app-urls";
import { ExternalAppLink } from "@/components/ExternalAppLink";
import { InAppBrowserNotice } from "@/components/InAppBrowserNotice";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Why BuildForms", href: "#why-different" },
  { label: "FAQ", href: "#faq" },
];

function openBookDemo() {
  window.dispatchEvent(new CustomEvent(BOOK_DEMO_EVENT));
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <InAppBrowserNotice />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 section-padding">
          <a
            href="/"
            className="flex items-center gap-2 font-display font-bold text-lg sm:text-xl tracking-tight text-foreground"
          >
            <img
              src="/logo.png"
              alt="BuildForms"
              width={140}
              height={28}
              className="h-6 sm:h-7 w-auto"
            />
            BuildForms
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => trackNavClick(link.label)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                trackNavClick("Book a Demo");
                openBookDemo();
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 p-0 cursor-pointer font-inherit"
            >
              Book a Demo
            </button>
            <ExternalAppLink
              href={APP_AUTH_HREF}
              onClick={() => trackCTA("Get Started Free", "navbar")}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium h-9 px-4 hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </ExternalAppLink>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-background border-b border-border section-padding pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                trackNavClick("Book a Demo");
                openBookDemo();
              }}
              className="block w-full text-left py-2.5 text-base text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer font-inherit"
            >
              Book a Demo
            </button>
            <div className="pt-2">
              <ExternalAppLink
                href={APP_AUTH_HREF}
                onClick={() => trackCTA("Get Started Free", "navbar-mobile")}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium h-10 px-5 w-full"
              >
                Get Started Free
              </ExternalAppLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
