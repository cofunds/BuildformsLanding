import type { APIRoute } from 'astro';
import { fetchPublishedSitemapRows } from '@/lib/contentHubDb';
import { hubTypeSegment } from '@/lib/contentHub';

export const prerender = false;

const SITE = 'https://buildforms.so';

export const GET: APIRoute = async () => {
	const im = import.meta.env as Record<string, string | undefined>;
	const rows = await fetchPublishedSitemapRows(im.DATABASE_URL);

	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		`  <url><loc>${SITE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
		`  <url><loc>${SITE}/blogs</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
		`  <url><loc>${SITE}/changelog</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
	];

	for (const r of rows) {
		const seg = hubTypeSegment[r.type] ?? 'blog';
		const loc = `${SITE}/${seg}/${encodeURIComponent(r.slug)}`;
		const last = r.updatedAt ? new Date(r.updatedAt) : null;
		const lastmod =
			last && !Number.isNaN(last.getTime()) ? `<lastmod>${last.toISOString()}</lastmod>` : '';
		parts.push(
			`  <url><loc>${loc}</loc>${lastmod}<changefreq>weekly</changefreq><priority>0.8</priority></url>`,
		);
	}

	parts.push('</urlset>');

	return new Response(parts.join('\n'), {
		status: 200,
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=300',
		},
	});
};
