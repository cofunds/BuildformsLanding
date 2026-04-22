import type { ComponentProps, MouseEvent } from "react";
import { useInAppBrowser } from "@/hooks/useInAppBrowser";
import {
  buildAndroidExternalBrowserIntent,
  isAllowedOutboundAppUrl,
} from "@/lib/inAppBrowser";

export type ExternalAppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

/**
 * Primary CTAs to the app/marketing origins: normal `<a>` for real browsers; after mount, in-app
 * UAs get `target="_blank"` + `rel="noopener noreferrer"`, and on Android an intent URL is tried
 * first (same allowed https destination via fallback — no open redirect).
 */
export function ExternalAppLink({
  href,
  onClick,
  target,
  rel,
  ...rest
}: ExternalAppLinkProps) {
  const { ready, isInAppBrowser, isAndroid } = useInAppBrowser();
  const allowed = isAllowedOutboundAppUrl(href);

  const effectiveTarget =
    ready && allowed && isInAppBrowser ? "_blank" : target;
  const effectiveRel =
    ready && allowed && isInAppBrowser ? "noopener noreferrer" : rel;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (!ready || !allowed || !isInAppBrowser || !isAndroid) return;

    const intent = buildAndroidExternalBrowserIntent(href);
    if (!intent) return;

    e.preventDefault();
    window.location.assign(intent);
  }

  return (
    <a
      {...rest}
      href={href}
      target={effectiveTarget}
      rel={effectiveRel}
      onClick={handleClick}
    />
  );
}
