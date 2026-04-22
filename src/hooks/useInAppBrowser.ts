import { useEffect, useState } from "react";
import { detectInAppBrowser, isAndroidUserAgent } from "@/lib/inAppBrowser";

export type InAppBrowserClientState = {
  ready: boolean;
  isInAppBrowser: boolean;
  isAndroid: boolean;
};

/**
 * Client-only UA detection (initial state matches SSR so crawlers and first paint see normal links).
 */
export function useInAppBrowser(): InAppBrowserClientState {
  const [state, setState] = useState<InAppBrowserClientState>({
    ready: false,
    isInAppBrowser: false,
    isAndroid: false,
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    setState({
      ready: true,
      isInAppBrowser: detectInAppBrowser(ua),
      isAndroid: isAndroidUserAgent(ua),
    });
  }, []);

  return state;
}
