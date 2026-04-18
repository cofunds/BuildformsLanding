import { defineMiddleware } from 'astro:middleware';
import { tryRespondWithMergedOgShell } from './lib/edgeOgMerge';

/**
 * Hub HTML Cache-Control (Vercel only unless overridden).
 * - CONTENT_HUB_HTTP_CACHE_CONTROL: single header for all hub HTML (advanced override).
 * - CONTENT_HUB_HTTP_CACHE_CONTROL_BLOGS: override for /blogs only.
 * - CONTENT_HUB_HTTP_CACHE_CONTROL_ARTICLES: override for /blog|/guides|/solutions slug pages.
 */
function hubHtmlCacheControlForPath(pathname: string): string | null {
	const globalOverride = process.env.CONTENT_HUB_HTTP_CACHE_CONTROL?.trim();
	if (globalOverride) return globalOverride;

	if (process.env.VERCEL !== '1') {
		return null;
	}

	if (pathname === '/blogs') {
		const o = process.env.CONTENT_HUB_HTTP_CACHE_CONTROL_BLOGS?.trim();
		if (o) return o;
		return 'public, max-age=0, must-revalidate';
	}

	if (
		pathname.startsWith('/blog/') ||
		pathname.startsWith('/guides/') ||
		pathname.startsWith('/solutions/')
	) {
		const o = process.env.CONTENT_HUB_HTTP_CACHE_CONTROL_ARTICLES?.trim();
		if (o) return o;
		return 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600';
	}

	return null;
}

function isContentHubHtmlPath(pathname: string): boolean {
	if (pathname === '/blogs') return true;
	if (pathname.startsWith('/blog/')) return true;
	if (pathname.startsWith('/guides/')) return true;
	if (pathname.startsWith('/solutions/')) return true;
	return false;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const merged = await tryRespondWithMergedOgShell(context.request);
	if (merged) {
		return merged;
	}
	const response = await next();
	if (context.request.method !== 'GET' || response.status !== 200) {
		return response;
	}
	const pathname = context.url.pathname;
	if (!isContentHubHtmlPath(pathname)) {
		return response;
	}
	const type = response.headers.get('content-type') ?? '';
	if (!type.includes('text/html')) {
		return response;
	}

	const cacheControl = hubHtmlCacheControlForPath(pathname);
	if (!cacheControl) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set('Cache-Control', cacheControl);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
