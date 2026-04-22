import { useInAppBrowser } from "@/hooks/useInAppBrowser";

/**
 * Subtle, client-only hint for embedded browsers (OAuth / full experience).
 * Does not replace normal page content for crawlers — hidden until `useInAppBrowser` runs.
 */
export function InAppBrowserNotice() {
  const { ready, isInAppBrowser } = useInAppBrowser();

  if (!ready || !isInAppBrowser) return null;

  return (
    <p
      className="fixed top-14 sm:top-16 left-0 right-0 z-40 border-b border-amber-200/80 bg-amber-50/95 px-4 py-2 text-center text-xs text-amber-950/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      For Google sign-in and the best experience, open this page in{" "}
      <span className="whitespace-nowrap font-medium">Safari or Chrome</span>
      {" — "}
      <span className="whitespace-nowrap">⋯ menu → Open in browser</span>
    </p>
  );
}
