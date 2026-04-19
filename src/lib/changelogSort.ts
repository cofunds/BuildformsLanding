import type { ChangelogEntry } from '@/lib/changelogData';

const ISO_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

function idSortKey(id: string): number {
	const m = id.match(ISO_PREFIX);
	if (!m) return 0;
	const t = new Date(m[1]).getTime();
	return Number.isNaN(t) ? 0 : t;
}

/** Newest release first (by entry `id`, typically YYYY-MM-DD). */
export function sortChangelogEntriesDesc(entries: ChangelogEntry[]): ChangelogEntry[] {
	return [...entries].sort((a, b) => {
		const tb = idSortKey(b.id);
		const ta = idSortKey(a.id);
		if (tb !== ta) return tb - ta;
		return b.id.localeCompare(a.id);
	});
}
