/**
 * In-app browser (embedded WebView) detection for marketing CTAs.
 *
 * Complements app-side handling (e.g. redirecting WebView traffic on `/` to /open-in-browser).
 * Google disallows OAuth in embedded browsers for security; see:
 * https://developers.google.com/identity/protocols/oauth2/policies#secure-browser-handling
 *
 * Heuristics are intentionally broad (social / WebView UAs); false positives route users to
 * target=_blank / external browser, which is safe for our allowlisted HTTPS URLs only.
 */

/** Hostnames we may rewrite or attach intent/fallback handling to (no open redirects). */
export const OUTBOUND_APP_LINK_HOSTS = new Set([
  "beta.buildforms.so",
  "buildforms.so",
  "www.buildforms.so",
]);

export function isOutboundAppLinkHostname(hostname: string): boolean {
  return OUTBOUND_APP_LINK_HOSTS.has(hostname);
}

/**
 * Returns true when `href` is an https URL on an allowed marketing/app host.
 */
export function isAllowedOutboundAppUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (u.protocol !== "https:") return false;
    return isOutboundAppLinkHostname(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Detect common in-app / embedded browsers. Pass `navigator.userAgent` from the client only.
 */
export function detectInAppBrowser(userAgent: string): boolean {
  const ua = userAgent.trim();
  if (!ua) return false;

  // Meta / Facebook family
  if (/\bFBAN\b|\bFBAV\b|FB_IAB|FBAUDIO/i.test(ua)) return true;
  // Instagram, LinkedIn (iOS app token), Line, Snapchat, TikTok, Pinterest
  if (/Instagram/i.test(ua)) return true;
  if (/LinkedInApp/i.test(ua)) return true;
  if (/\bLine\/\d/i.test(ua)) return true;
  if (/Snapchat/i.test(ua)) return true;
  if (/musical_ly|TikTok/i.test(ua)) return true;
  if (/\bPinterest/i.test(ua)) return true;
  if (/MicroMessenger/i.test(ua)) return true;

  // Android WebView (standalone Chrome does not use the "; wv)" token)
  if (/Android/i.test(ua) && /\bwv\b/i.test(ua)) return true;

  // iOS / iPadOS: many in-app browsers omit "Safari/" while real Safari includes it.
  // Exclude full browsers that use WebKit without the Safari substring.
  if (
    /iPhone|iPad|iPod/.test(ua) &&
    /AppleWebKit/.test(ua) &&
    !/Safari\//.test(ua)
  ) {
    if (/\bCriOS\b|\bFxiOS\b|\bEdgiOS\b/.test(ua)) return false;
    return true;
  }

  return false;
}

export function isAndroidUserAgent(userAgent: string): boolean {
  return /Android/i.test(userAgent);
}

/**
 * Android intent URL to ask the system to open an https URL in the default browser / Chrome.
 * - Uses `S.browser_fallback_url` so if no handler is found, the user still lands on the same https URL.
 * - Limitations: some in-app browsers block intents; package-specific intents can fail if that browser
 *   is not installed (fallback URL mitigates). We intentionally do not use arbitrary schemes or hosts.
 *
 * @see https://developer.chrome.com/docs/android/intents/
 */
export function buildAndroidExternalBrowserIntent(
  httpsUrl: string,
): string | null {
  if (!isAllowedOutboundAppUrl(httpsUrl)) return null;

  const u = new URL(httpsUrl);
  const authorityAndPath = `${u.hostname}${u.pathname === "" ? "/" : u.pathname}${u.search}${u.hash}`;
  const fallback = encodeURIComponent(httpsUrl);

  // Prefer Chrome when available; S.browser_fallback_url preserves the exact same destination.
  return `intent://${authorityAndPath}#Intent;scheme=https;package=com.android.chrome;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${fallback};end`;
}
