import { defineMiddleware } from 'astro:middleware';
import { tryRespondWithMergedOgShell } from './lib/edgeOgMerge';

/** Long browser + CDN cache for published hub HTML (View Transitions refetch same URLs). Override with CONTENT_HUB_HTTP_CACHE_CONTROL. */
function contentHubHtmlCacheControlHeader(): string {
	const fromEnv = process.env.CONTENT_HUB_HTTP_CACHE_CONTROL?.trim();
	if (fromEnv) return fromEnv;
	return 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000';
}

function isContentHubHtmlCachePath(pathname: string): boolean {
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
	if (!isContentHubHtmlCachePath(pathname)) {
		return response;
	}
	const type = response.headers.get('content-type') ?? '';
	if (!type.includes('text/html')) {
		return response;
	}
	const headers = new Headers(response.headers);
	headers.set('Cache-Control', contentHubHtmlCacheControlHeader());
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
