/**
 * In-memory TTL cache for published hub article reads (SSR), per Node isolate.
 *
 * Env:
 * - CONTENT_HUB_CACHE_TTL_MS — override TTL in ms (0 = disable in-memory cache). Applies everywhere when set.
 * When unset: Vercel production (VERCEL=1) defaults to 10 minutes; local defaults to 0 (always hit DB).
 */

type CacheEntry = { exp: number; data: unknown };

const globalForCache = globalThis as typeof globalThis & {
	__hubServerCache?: Map<string, CacheEntry>;
};

function getHubCache(): Map<string, CacheEntry> {
	if (!globalForCache.__hubServerCache) {
		globalForCache.__hubServerCache = new Map();
	}
	return globalForCache.__hubServerCache;
}

function readEnvTtlMs(): string | undefined {
	return (
		process.env.CONTENT_HUB_CACHE_TTL_MS?.trim() ||
		(typeof import.meta !== 'undefined' &&
			(import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.CONTENT_HUB_CACHE_TTL_MS?.trim()) ||
		undefined
	);
}

/** Effective TTL for article/related hub reads. Hub list bypasses this layer entirely. */
export function effectiveHubCacheTtlMs(): number {
	const raw = readEnvTtlMs();
	if (raw !== undefined && raw !== '') {
		const n = parseInt(raw, 10);
		if (Number.isFinite(n) && n >= 0) return n;
	}
	if (process.env.VERCEL === '1') {
		return 600_000; // 10 minutes on Vercel
	}
	return 0; // local: no memory cache unless CONTENT_HUB_CACHE_TTL_MS is set
}

/** @deprecated Use effectiveHubCacheTtlMs; kept for any external imports. */
export function contentHubCacheTtlMs(): number {
	return effectiveHubCacheTtlMs();
}

/** Stable cache segment per DB host (avoids collisions if DATABASE_URL changes). */
export function hubDbCacheNamespace(connectionString: string): string {
	try {
		return new URL(connectionString).hostname.replace(/[^a-z0-9.-]/gi, '_');
	} catch {
		return 'default';
	}
}

/**
 * Returns cached value when fresh; only stores when shouldCache(result) is true (omit to always store).
 */
export async function cachedHubRead<T>(
	key: string,
	factory: () => Promise<T>,
	shouldCache?: (value: T) => boolean,
): Promise<T> {
	const ttl = effectiveHubCacheTtlMs();
	if (ttl === 0) {
		return factory();
	}
	const cache = getHubCache();
	const now = Date.now();
	const hit = cache.get(key);
	if (hit && hit.exp > now) {
		return hit.data as T;
	}
	const data = await factory();
	if (!shouldCache || shouldCache(data)) {
		cache.set(key, { exp: now + ttl, data });
	}
	return data;
}
