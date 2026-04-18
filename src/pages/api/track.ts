import type { APIRoute } from 'astro';
import { persistAnalyticsEvents } from '@/lib/contentHubDb';

export const prerender = false;

const MAX_BODY_BYTES = 256_000;

/**
 * POST /api/track — batch analytics from the content hub (same contract as seo-engine).
 * Always returns 200 so tracking never breaks the page.
 */
export const POST: APIRoute = async ({ request }) => {
	const ua = request.headers.get('user-agent') ?? '';
	const im = import.meta.env as Record<string, string | undefined>;

	try {
		const text = await request.text();
		if (text.length > MAX_BODY_BYTES) {
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		let body: unknown;
		try {
			body = JSON.parse(text) as unknown;
		} catch {
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const events: unknown[] = Array.isArray((body as { events?: unknown }).events)
			? ((body as { events: unknown[] }).events ?? [])
			: (body as { event?: string }).event
				? [body]
				: [];

		await persistAnalyticsEvents(events, ua, im.DATABASE_URL);

		return new Response(JSON.stringify({ ok: true, count: events.length }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
