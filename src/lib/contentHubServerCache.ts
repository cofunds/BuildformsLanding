/**
 * In-memory TTL cache for published hub reads (SSR). Safe across requests on the same Node isolate.
 * Tune with CONTENT_HUB_CACHE_TTL_MS (0 = disable). Default 24h — content is effectively static once published.
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

export function contentHubCacheTtlMs(): number {
	const raw = readEnvTtlMs();
	if (raw === undefined || raw === '') return 86_400_000; // 24h
	const n = parseInt(raw, 10);
	if (!Number.isFinite(n) || n < 0) return 86_400_000;
	return n;
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
	const ttl = contentHubCacheTtlMs();
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
