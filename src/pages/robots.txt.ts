import type { APIRoute } from 'astro';

export const prerender = false;

const SITE = 'https://buildforms.so';

/** Crawl rules aligned with seo-engine public hub (API is server-only, not indexed). */
export const GET: APIRoute = () => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /api/',
		'',
		`Sitemap: ${SITE}/sitemap.xml`,
		'',
	].join('\n');

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
