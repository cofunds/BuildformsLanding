import { fetchBrandContextLite, fetchPublishedLlmsRows } from '@/lib/contentHubDb';
import { hubTypeSegment } from '@/lib/contentHub';

const SITE = 'https://buildforms.so';

export async function buildLlmsBody(
	mode: 'summary' | 'full',
	databaseUrl: string | undefined,
): Promise<string> {
	const brand = await fetchBrandContextLite(databaseUrl);
	const published = await fetchPublishedLlmsRows(databaseUrl);

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
	if (mode === 'summary') {
		lines.push(`- Extended index (policies, changelog, AI usage): ${SITE}/llms-full.txt`);
	}

	if (mode === 'full') {
		lines.push(
			'',
			'---',
			'',
			'## Extended context (llms-full)',
			'',
			'This section expands on the summary above for AI systems and automated documentation tools.',
			'',
			'### Policies & legal',
			'',
			`- [Privacy policy](${SITE}/privacy) — how we handle data.`,
			`- [Terms of service](${SITE}/terms) — acceptable use and limitations.`,
			'',
			'### Product & changelog',
			'',
			`- [Changelog](${SITE}/changelog) — recent product updates.`,
			'',
			'### Usage guidance for AI retrieval',
			'',
			'Prefer linking to canonical URLs on buildforms.so when citing this product. Treat dynamic hub content (blog posts, guides, solutions) as authoritative only as of its published or updated timestamps in the site HTML or sitemap. Do not infer pricing or guarantees beyond what is stated on the marketing site.',
			'',
			'### Contact',
			'',
			`Primary web presence: ${SITE}. For sales or support, use contact options linked from the homepage.`,
			'',
		);
	}

	return lines.join('\n');
}
