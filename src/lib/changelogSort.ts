import type { CollectionEntry } from 'astro:content';

/** `2026-04-19` from id `2026-04-19` or nested paths ending in that stem. */
const ISO_NAME_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

function parseFilenameDateMs(id: string): number | null {
	const m = id.match(ISO_NAME_PREFIX);
	if (!m) return null;
	const t = new Date(m[1]).getTime();
	return Number.isNaN(t) ? null : t;
}

function sortTime(entry: CollectionEntry<'changelog'>): number {
	const fromFile = parseFilenameDateMs(entry.id);
	if (fromFile != null) return fromFile;
	const fromFrontmatter = new Date(entry.data.date).getTime();
	return Number.isNaN(fromFrontmatter) ? 0 : fromFrontmatter;
}

/** Newest first: uses ISO date in the `.mdx` filename when present, else `date` in frontmatter. */
export function sortChangelogEntriesDesc(
	entries: CollectionEntry<'changelog'>[],
): CollectionEntry<'changelog'>[] {
	return [...entries].sort((a, b) => {
		const tb = sortTime(b);
		const ta = sortTime(a);
		if (tb !== ta) return tb - ta;
		return b.id.localeCompare(a.id);
	});
}
