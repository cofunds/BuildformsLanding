/** Shared types and pure helpers for the public content hub (/blogs). */

export const PUBLISHED_CONTENT_TYPES = ['blog', 'guide', 'landing-page'] as const;
export type PublishedContentType = (typeof PUBLISHED_CONTENT_TYPES)[number];

export type HubContentItem = {
	id: number;
	slug: string;
	title: string;
	body: string;
	excerpt: string | null;
	type: string;
	publishedAt: string | null;
};

/** Single post row including optional FAQ JSON-LD source. */
export type HubPostDetail = HubContentItem & { schemaMarkup: string | null };

export type HubHeadingNav = {
	level: number;
	text: string;
	id: string;
};

export type HubFaqEntry = { question: string; answer: string };

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function extractHeadings(html: string): HubHeadingNav[] {
	const headingRegex = /<h([23])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
	const headings: HubHeadingNav[] = [];
	let match: RegExpExecArray | null;
	while ((match = headingRegex.exec(html)) !== null) {
		const inner = match[3].replace(/<[^>]*>/g, '');
		const id =
			match[2] ||
			inner
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '');
		headings.push({ level: parseInt(match[1], 10), text: inner, id });
	}
	return headings;
}

export function parseFaqFromSchemaMarkup(raw: string | null): HubFaqEntry[] {
	if (!raw?.trim()) return [];
	try {
		const j = JSON.parse(raw) as {
			mainEntity?: { name?: string; acceptedAnswer?: { text?: string } }[];
		};
		if (!Array.isArray(j?.mainEntity)) return [];
		return j.mainEntity
			.map((e) => ({
				question: e?.name ?? '',
				answer: e?.acceptedAnswer?.text ?? '',
			}))
			.filter((f) => f.question && f.answer);
	} catch {
		return [];
	}
}

export function hubMiddleCrumbForType(type: string): { label: string; href: string } {
	switch (type) {
		case 'guide':
			return { label: 'Guides', href: '/blogs?type=guide' };
		case 'landing-page':
			return { label: 'Solutions', href: '/blogs?type=landing-page' };
		default:
			return { label: 'Blog', href: '/blogs?type=blog' };
	}
}

export function estimateReadingTime(html: string): number {
	const text = html.replace(/<[^>]*>/g, '');
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 250));
}

export const hubTypeSegment: Record<string, string> = {
	blog: 'blog',
	guide: 'guides',
	'landing-page': 'solutions',
};

export const hubTypeLabels: Record<string, string> = {
	blog: 'Articles',
	guide: 'Guides',
	'landing-page': 'Solutions',
};

export function hubItemHref(item: HubContentItem): string {
	const segment = hubTypeSegment[item.type] ?? 'blog';
	return `/${segment}/${item.slug}`;
}
