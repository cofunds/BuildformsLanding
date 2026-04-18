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
import { fetchPublishedPostBySlug, fetchRelatedPublishedContent } from '@/lib/contentHubDb';

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

function jsonLdArticle(post: HubPostDetail, canonicalPath: string): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.excerpt ?? undefined,
		datePublished: post.publishedAt ?? undefined,
		url: `${SITE_URL}${canonicalPath}`,
		author: { '@type': 'Organization', name: '1126Labs', url: SITE_URL },
		publisher: { '@type': 'Organization', name: '1126Labs', url: SITE_URL },
	});
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
	const dbPost = await fetchPublishedPostBySlug(slug, contentType, databaseUrl);
	const staticFallback = contentType === 'blog' ? staticBlogFromSlug(slug) : null;
	const post = dbPost ?? staticFallback;
	if (!post) return null;

	const related = await fetchRelatedPublishedContent(post.slug, 6, databaseUrl);
	const headings = extractHeadings(post.body);
	const readingTime = estimateReadingTime(post.body);
	const faqItems = parseFaqFromSchemaMarkup(post.schemaMarkup);
	const middleCrumb = hubMiddleCrumbForType(post.type);
	const canonicalPath = canonicalPathFor(post);

	return {
		post,
		related,
		headings,
		readingTime,
		middleCrumb,
		faqItems,
		breadcrumbLd: jsonLdBreadcrumb(post, canonicalPath, middleCrumb),
		articleLd: jsonLdArticle(post, canonicalPath),
		faqLd: faqLdFromMarkup(post.schemaMarkup),
		canonicalPath,
	};
}

function staticBlogFromSlug(slug: string): HubPostDetail | null {
	const p = getPostBySlug(slug);
	return p ? staticBlogToDetail(p) : null;
}
