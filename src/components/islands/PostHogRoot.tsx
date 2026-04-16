import { useEffect } from 'react';
import posthog from 'posthog-js';

const INIT_KEY = '__buildforms_posthog_init';

/**
 * Initializes PostHog once for MPA navigations (full page loads).
 */
export function PostHogRoot() {
	useEffect(() => {
		const token = import.meta.env.PUBLIC_POSTHOG_TOKEN;
		const host = import.meta.env.PUBLIC_POSTHOG_HOST;
		if (!token || typeof window === 'undefined') return;
		if ((window as unknown as Record<string, boolean>)[INIT_KEY]) return;

		posthog.init(token, {
			api_host: host || 'https://us.i.posthog.com',
			defaults: '2026-01-30',
			capture_pageview: true,
		});
		(window as unknown as Record<string, boolean>)[INIT_KEY] = true;
	}, []);

	return null;
}
