import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Content-hub analytics (parity with seo-engine `components/content-hub/Analytics.tsx`).
 * Posts batched events to `/api/track` → `analytics_events` + optional `content.views` bump.
 */

interface TrackEvent {
	event: string;
	path: string;
	contentSlug?: string;
	contentType?: string;
	value?: string;
	sessionId: string;
	referrer?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	deviceType?: string;
	browser?: string;
}

function getSessionId(): string {
	if (typeof window === 'undefined') return '';
	let sid = sessionStorage.getItem('_seo_sid');
	if (!sid) {
		sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		sessionStorage.setItem('_seo_sid', sid);
	}
	return sid;
}

function getUTMParams(): { source?: string; medium?: string; campaign?: string } {
	if (typeof window === 'undefined') return {};
	const params = new URLSearchParams(window.location.search);
	return {
		source: params.get('utm_source') || undefined,
		medium: params.get('utm_medium') || undefined,
		campaign: params.get('utm_campaign') || undefined,
	};
}

function parseContentFromPath(path: string): { slug?: string; type?: string } {
	if (path === '/blogs') return {};
	const blogMatch = path.match(/^\/blog\/([^/]+)/);
	if (blogMatch) return { slug: blogMatch[1], type: 'blog' };
	const guideMatch = path.match(/^\/guides\/([^/]+)/);
	if (guideMatch) return { slug: guideMatch[1], type: 'guide' };
	const solutionMatch = path.match(/^\/solutions\/([^/]+)/);
	if (solutionMatch) return { slug: solutionMatch[1], type: 'landing-page' };
	return {};
}

function useContentHubPathname(): string {
	const [pathname, setPathname] = useState(() =>
		typeof window !== 'undefined' ? window.location.pathname : '',
	);
	useEffect(() => {
		const sync = () => setPathname(window.location.pathname);
		sync();
		document.addEventListener('astro:page-load', sync);
		return () => document.removeEventListener('astro:page-load', sync);
	}, []);
	return pathname;
}

function isContentHubPath(path: string): boolean {
	if (!path) return false;
	return (
		path === '/blogs' ||
		path.startsWith('/blog/') ||
		path.startsWith('/guides/') ||
		path.startsWith('/solutions/')
	);
}

function ContentHubAnalyticsActive({ pathname }: { pathname: string }) {
	const queueRef = useRef<TrackEvent[]>([]);
	const scrollMilestonesRef = useRef<Set<number>>(new Set());
	const timeMilestonesRef = useRef<Set<number>>(new Set());
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number>(Date.now());

	const flush = useCallback(() => {
		if (queueRef.current.length === 0) return;
		const events = [...queueRef.current];
		queueRef.current = [];
		const payload = JSON.stringify({ events });
		if (navigator.sendBeacon) {
			navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
		} else {
			fetch('/api/track', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
				keepalive: true,
			}).catch(() => {});
		}
	}, []);

	const enqueue = useCallback(
		(event: string, value?: string) => {
			const sessionId = getSessionId();
			if (!sessionId) return;
			const utm = getUTMParams();
			const { slug, type } = parseContentFromPath(pathname);
			queueRef.current.push({
				event,
				path: pathname,
				contentSlug: slug,
				contentType: type,
				value,
				sessionId,
				referrer: document.referrer || undefined,
				utmSource: utm.source,
				utmMedium: utm.medium,
				utmCampaign: utm.campaign,
			});
		},
		[pathname],
	);

	useEffect(() => {
		scrollMilestonesRef.current.clear();
		timeMilestonesRef.current.clear();
		startTimeRef.current = Date.now();
		enqueue('page_view');
		return () => {
			const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
			if (seconds > 0) {
				enqueue('time_on_page', `${seconds}s_total`);
			}
			flush();
		};
	}, [pathname, enqueue, flush]);

	useEffect(() => {
		function handleScroll() {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (docHeight <= 0) return;
			const pct = Math.round((scrollTop / docHeight) * 100);
			const milestones = [25, 50, 75, 100];
			for (const m of milestones) {
				if (pct >= m && !scrollMilestonesRef.current.has(m)) {
					scrollMilestonesRef.current.add(m);
					enqueue('scroll', `${m}%`);
				}
			}
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [pathname, enqueue]);

	useEffect(() => {
		const milestones = [10, 30, 60, 120, 300];
		timerRef.current = setInterval(() => {
			const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
			for (const m of milestones) {
				if (elapsed >= m && !timeMilestonesRef.current.has(m)) {
					timeMilestonesRef.current.add(m);
					enqueue('time_on_page', `${m}s`);
				}
			}
		}, 5000);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [pathname, enqueue]);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			const target = (e.target as HTMLElement).closest('a, button');
			if (!target) return;
			if (target.tagName === 'BUTTON' || target.hasAttribute('data-track-cta')) {
				const ctaText =
					target.getAttribute('data-track-cta') ||
					target.textContent?.trim().slice(0, 80) ||
					'button';
				enqueue('cta_click', ctaText);
				return;
			}
			if (target.tagName === 'A') {
				const href = (target as HTMLAnchorElement).href;
				if (!href) return;
				try {
					const url = new URL(href);
					const isInternal = url.hostname === window.location.hostname;
					if (isInternal) {
						enqueue('click', `internal:${url.pathname}`);
					} else {
						enqueue('click', `external:${url.hostname}${url.pathname}`);
					}
				} catch {
					enqueue('click', `internal:${href}`);
				}
			}
		}
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [enqueue]);

	useEffect(() => {
		flushRef.current = setInterval(flush, 5000);
		return () => {
			if (flushRef.current) clearInterval(flushRef.current);
		};
	}, [flush]);

	useEffect(() => {
		function handleBeforeUnload() {
			const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
			if (seconds > 0) {
				enqueue('time_on_page', `${seconds}s_total`);
			}
			enqueue('exit');
			flush();
		}
		function handleVisibilityChange() {
			if (document.visibilityState === 'hidden') {
				flush();
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [enqueue, flush]);

	return null;
}

export default function ContentHubAnalytics() {
	const pathname = useContentHubPathname();
	if (!isContentHubPath(pathname)) return null;
	return <ContentHubAnalyticsActive pathname={pathname} />;
}
