export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	/** Plain text paragraphs — replace with MDX or rich content inside the island when you port Next code */
	paragraphs: string[];
};

/**
 * Central list for the blog index and `[slug]` static paths.
 * Add posts here (or later swap this module for a CMS / content collection).
 */
export const blogPosts: BlogPost[] = [
	{
		slug: 'welcome',
		title: 'Welcome to the BuildForms blog',
		date: '2026-04-18',
		excerpt:
			'Product updates, hiring workflows, and how we think about structured applications — starting here.',
		paragraphs: [
			'This is a placeholder post so routing and the blog island work end-to-end.',
			'Paste your Next.js blog UI into `BlogIsland` / `BlogPostIsland`, or keep those as shells and move layout-only pieces into `.astro` files if you prefer less client JavaScript.',
		],
	},
];

export function getPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}
