import type { APIRoute } from 'astro';

/** Proxies OG images from the app deployment so meta tags can use buildforms.so URLs. */
export const prerender = false;

const BETA_OG_ORIGIN = 'https://beta.buildforms.so/api/og';

export const GET: APIRoute = async ({ request }) => {
	const src = new URL(request.url);
	const dest = new URL(BETA_OG_ORIGIN);
	dest.search = src.search;

	const res = await fetch(dest, { redirect: 'follow' });

	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': res.headers.get('Content-Type') ?? 'image/png',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	});
};
