import type { APIRoute } from 'astro';
import { buildLlmsBody } from '@/lib/llmsTxtBody';

export const prerender = false;

export const GET: APIRoute = async () => {
	const im = import.meta.env as Record<string, string | undefined>;
	const body = await buildLlmsBody('full', im.DATABASE_URL);

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
