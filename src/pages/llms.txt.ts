import type { APIRoute } from 'astro';
import { fetchBrandContextLite, fetchPublishedLlmsRows } from '@/lib/contentHubDb';
import { hubTypeSegment } from '@/lib/contentHub';

export const prerender = false;

const SITE = 'https://buildforms.so';

export const GET: APIRoute = async () => {
	const im = import.meta.env as Record<string, string | undefined>;
	const brand = await fetchBrandContextLite(im.DATABASE_URL);
	const published = await fetchPublishedLlmsRows(im.DATABASE_URL);

	const lines: string[] = [
		`# ${brand?.name ?? 'BuildForms.so'}`,
		'',
		`> ${brand?.tagline ?? ''}`,
		'',
		brand?.description ?? '',
		'',
		'## Products & Services',
		'',
	];

	if (brand?.services) {
		try {
			const services = JSON.parse(brand.services) as unknown;
			if (Array.isArray(services)) {
				for (const s of services) {
					if (typeof s === 'string' && s.trim()) lines.push(`- ${s.trim()}`);
				}
			}
		} catch {
			/* ignore */
		}
	}

	lines.push('', '## Resources', '');

	for (const item of published) {
		const path = hubTypeSegment[item.type] ?? 'blog';
		const url = `${SITE}/${path}/${item.slug}`;
		const desc = item.blurb || '';
		lines.push(`- [${item.title}](${url}): ${desc}`);
	}

	lines.push('', '## Links', '');
	lines.push(`- Website: ${SITE}`);
	lines.push(`- Resources: ${SITE}/blogs`);

	const body = lines.join('\n');

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
