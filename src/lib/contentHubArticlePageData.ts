import { getPostBySlug, type BlogPost } from '@/lib/blog';
import {
	escapeHtml,
	estimateReadingTime,
	extractHeadings,
	hubMiddleCrumbForType,
	parseFaqFromSchemaMarkup,
	type HubContentItem,
	type HubFaqEntry,
	type HubHeadingNav,
	type HubPostDetail,
	type PublishedContentType,
} from '@/lib/contentHub';
import { fetchPublishedPostWithRelated, fetchRelatedPublishedContent } from '@/lib/contentHubDb';

const SITE_URL = 'https://buildforms.so';

export type HubArticleResolved = {
	post: HubPostDetail;
	related: HubContentItem[];
	headings: HubHeadingNav[];
	readingTime: number;
	middleCrumb: { label: string; href: string };
	faqItems: HubFaqEntry[];
	breadcrumbLd: string;
	articleLd: string;
	faqLd?: string;
	howToLd?: string;
	canonicalPath: string;
};

function staticBlogToDetail(p: BlogPost): HubPostDetail {
	const body = `<p>${p.paragraphs.map((x) => escapeHtml(x)).join('</p><p>')}</p>`;
	return {
		id: 0,
		slug: p.slug,
		title: p.title,
		body,
		excerpt: p.excerpt,
		type: 'blog',
		publishedAt: `${p.date}T12:00:00.000Z`,
		schemaMarkup: null,
	};
}

function canonicalPathFor(post: HubPostDetail): string {
	if (post.type === 'guide') return `/guides/${post.slug}`;
	if (post.type === 'landing-page') return `/solutions/${post.slug}`;
	return `/blog/${post.slug}`;
}

function creativeWorkType(post: HubPostDetail): 'BlogPosting' | 'Article' {
	if (post.type === 'blog') return 'BlogPosting';
	return 'Article';
}

function jsonLdCreativeWork(post: HubPostDetail, canonicalPath: string): string {
	const t = creativeWorkType(post);
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': t,
		headline: post.title,
		description: post.excerpt ?? undefined,
		datePublished: post.publishedAt ?? undefined,
		url: `${SITE_URL}${canonicalPath}`,
		author: { '@type': 'Organization', name: '1126Labs', url: SITE_URL },
		publisher: { '@type': 'Organization', name: '1126Labs', url: SITE_URL },
	});
}

function jsonLdHowTo(
	post: HubPostDetail,
	canonicalPath: string,
	headings: HubHeadingNav[],
	readingTimeMinutes: number,
): string | undefined {
	if (post.type !== 'guide') return undefined;
	const h2s = headings.filter((h) => h.level === 2);
	if (h2s.length < 2) return undefined;
	const step = h2s.map((h, i) => ({
		'@type': 'HowToStep',
		position: i + 1,
		name: h.text,
		url: `${SITE_URL}${canonicalPath}#${h.id}`,
	}));
	const base: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: post.title,
		description: post.excerpt ?? undefined,
		step,
	};
	if (readingTimeMinutes > 0) {
		base.totalTime = `PT${readingTimeMinutes}M`;
	}
	return JSON.stringify(base);
}

function jsonLdBreadcrumb(
	post: HubPostDetail,
	canonicalPath: string,
	middleCrumb: { label: string; href: string },
): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
			{ '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/blogs` },
			{
				'@type': 'ListItem',
				position: 3,
				name: middleCrumb.label,
				item: `${SITE_URL}${middleCrumb.href}`,
			},
			{ '@type': 'ListItem', position: 4, name: post.title, item: `${SITE_URL}${canonicalPath}` },
		],
	});
}

function faqLdFromMarkup(raw: string | null): string | undefined {
	if (!raw?.trim()) return undefined;
	try {
		const j = JSON.parse(raw) as { '@type'?: string };
		if (j['@type'] === 'FAQPage') {
			return JSON.stringify(j);
		}
	} catch {
		/* ignore */
	}
	return undefined;
}

export async function resolveHubArticle(
	slug: string,
	contentType: PublishedContentType,
	databaseUrl?: string,
): Promise<HubArticleResolved | null> {
	const bundle = await fetchPublishedPostWithRelated(slug, contentType, 6, databaseUrl);
	const staticFallback = contentType === 'blog' ? staticBlogFromSlug(slug) : null;
	const post = bundle.post ?? staticFallback;
	if (!post) return null;

	const related = bundle.post
		? bundle.related
		: await fetchRelatedPublishedContent(post.slug, 6, databaseUrl);
	const headings = extractHeadings(post.body);
	const readingTime = estimateReadingTime(post.body);
	const faqItems = parseFaqFromSchemaMarkup(post.schemaMarkup);
	const middleCrumb = hubMiddleCrumbForType(post.type);
	const canonicalPath = canonicalPathFor(post);

	const howToLd = jsonLdHowTo(post, canonicalPath, headings, readingTime);

	return {
		post,
		related,
		headings,
		readingTime,
		middleCrumb,
		faqItems,
		breadcrumbLd: jsonLdBreadcrumb(post, canonicalPath, middleCrumb),
		articleLd: jsonLdCreativeWork(post, canonicalPath),
		faqLd: faqLdFromMarkup(post.schemaMarkup),
		howToLd,
		canonicalPath,
	};
}

function staticBlogFromSlug(slug: string): HubPostDetail | null {
	const p = getPostBySlug(slug);
	return p ? staticBlogToDetail(p) : null;
}
