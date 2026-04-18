/**
 * Read published rows from Postgres using parameterized queries (no ORM / schema files).
 * SSR uses a process-scoped pooled client (globalThis) so we do not open/close TCP+TLS per request.
 */
import postgres from 'postgres';
import { z } from 'zod';
import type { HubContentItem, HubPostDetail, PublishedContentType } from '@/lib/contentHub';
import { cachedHubRead, hubDbCacheNamespace } from '@/lib/contentHubServerCache';

const rowSchema = z.object({
	id: z.coerce.number().finite().int().positive(),
	slug: z.string().trim().min(1).max(512),
	title: z.string().trim().min(1).max(2000),
	body: z.string().max(5_000_000),
	excerpt: z.string().nullable().optional(),
	type: z.string().trim().min(1).max(64),
	published_at: z.string().nullable().optional(),
});

const detailRowSchema = rowSchema.extend({
	schema_markup: z.string().nullable().optional(),
});

function mapRow(r: z.infer<typeof rowSchema>): HubContentItem {
	return {
		id: r.id,
		slug: r.slug,
		title: r.title,
		body: r.body,
		excerpt: r.excerpt ?? null,
		type: r.type,
		publishedAt: r.published_at ?? null,
	};
}

function mapDetailRow(r: z.infer<typeof detailRowSchema>): HubPostDetail {
	return {
		...mapRow(r),
		schemaMarkup: r.schema_markup ?? null,
	};
}

export type FetchHubResult =
	| { ok: true; items: HubContentItem[] }
	| { ok: false; items: []; code: 'missing_db_url' | 'invalid_db_url' | 'query_failed' };

const MAX_ROWS = 200;

function readImportMetaDatabaseUrl(): string | undefined {
	try {
		const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
		return env?.DATABASE_URL?.trim();
	} catch {
		return undefined;
	}
}

function isLikelyPostgresUrl(url: string): boolean {
	try {
		const u = new URL(url);
		return u.protocol === 'postgres:' || u.protocol === 'postgresql:';
	} catch {
		return false;
	}
}

function resolveConnectionString(connectionSource?: string | null): string | undefined {
	return (
		connectionSource?.trim() ||
		process.env.DATABASE_URL?.trim() ||
		readImportMetaDatabaseUrl()
	);
}

type SqlClient = ReturnType<typeof postgres>;

const globalForPg = globalThis as typeof globalThis & {
	__buildformsReadSql?: SqlClient;
	__buildformsReadSqlUrl?: string;
};

/** One pooled client per DATABASE_URL per Node process (warm connections across SSR requests). */
function getSharedReadSql(connectionString: string): SqlClient {
	const useSsl = !/localhost|127\.0\.0\.1/i.test(connectionString);
	if (
		globalForPg.__buildformsReadSql &&
		globalForPg.__buildformsReadSqlUrl === connectionString
	) {
		return globalForPg.__buildformsReadSql;
	}
	if (globalForPg.__buildformsReadSql) {
		void globalForPg.__buildformsReadSql.end({ timeout: 2 }).catch(() => {});
		globalForPg.__buildformsReadSql = undefined;
	}
	globalForPg.__buildformsReadSqlUrl = connectionString;
	globalForPg.__buildformsReadSql = postgres(connectionString, {
		prepare: false,
		ssl: useSsl ? 'require' : false,
		connect_timeout: 12,
		max: 8,
		idle_timeout: 60,
	});
	return globalForPg.__buildformsReadSql;
}

async function withSql<T>(connectionString: string, run: (sql: SqlClient) => Promise<T>): Promise<T> {
	const sql = getSharedReadSql(connectionString);
	return await run(sql);
}

export async function fetchPublishedHubContent(
	connectionSource?: string | null,
): Promise<FetchHubResult> {
	const connectionString = resolveConnectionString(connectionSource);

	if (!connectionString) {
		return { ok: false, items: [], code: 'missing_db_url' };
	}
	if (!isLikelyPostgresUrl(connectionString)) {
		return { ok: false, items: [], code: 'invalid_db_url' };
	}

	const ns = hubDbCacheNamespace(connectionString);
	return cachedHubRead(
		`hub:v1:list:${ns}`,
		async (): Promise<FetchHubResult> => {
			try {
				return await withSql(connectionString, async (sql) => {
					const raw = await sql`
						SELECT id, slug, title, body, excerpt, type, published_at
						FROM content
						WHERE status = 'published'
						ORDER BY published_at DESC NULLS LAST, id DESC
						LIMIT ${MAX_ROWS}
					`;

					const items: HubContentItem[] = [];
					for (const row of raw) {
						const parsed = rowSchema.safeParse(row);
						if (!parsed.success) {
							console.warn('[content-hub] dropped row failing validation');
							continue;
						}
						items.push(mapRow(parsed.data));
					}

					return { ok: true, items };
				});
			} catch (err) {
				console.error('[content-hub] database query failed', err);
				return { ok: false, items: [], code: 'query_failed' };
			}
		},
		(r) => r.ok === true,
	);
}

/** Published post by slug and canonical content type (blog / guide / landing-page). */
export async function fetchPublishedPostBySlug(
	slug: string,
	contentType: PublishedContentType,
	connectionSource?: string | null,
): Promise<HubPostDetail | null> {
	const trimmed = slug.trim();
	if (!trimmed || trimmed.length > 512) return null;

	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) {
		return null;
	}

	const ns = hubDbCacheNamespace(connectionString);
	const key = `hub:v1:post:${ns}:${contentType}:${encodeURIComponent(trimmed)}`;

	try {
		return await cachedHubRead(
			key,
			async () => {
				return await withSql(connectionString, async (sql) => {
					const raw = await sql`
						SELECT id, slug, title, body, excerpt, type, published_at, schema_markup
						FROM content
						WHERE status = 'published' AND slug = ${trimmed} AND type = ${contentType}
						LIMIT 1
					`;
					const row = raw[0];
					if (!row) return null;
					const parsed = detailRowSchema.safeParse(row);
					if (!parsed.success) {
						console.warn('[content-hub] post row failed validation');
						return null;
					}
					const item = mapDetailRow(parsed.data);
					return item.type === contentType ? item : null;
				});
			},
			(v) => v != null,
		);
	} catch (err) {
		console.error('[content-hub] fetchPublishedPostBySlug failed', err);
		return null;
	}
}

/** Related published items of any type (articles, guides, solutions), excluding one slug. */
export async function fetchRelatedPublishedContent(
	excludeSlug: string,
	limit: number,
	connectionSource?: string | null,
): Promise<HubContentItem[]> {
	const trimmed = excludeSlug.trim();
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) {
		return [];
	}
	const cap = Math.min(Math.max(limit, 1), 20);
	const ns = hubDbCacheNamespace(connectionString);
	const key = `hub:v1:related:${ns}:${encodeURIComponent(trimmed)}:${cap}`;

	try {
		return await cachedHubRead(key, async () => {
			return await withSql(connectionString, async (sql) => {
				const raw = await sql`
					SELECT id, slug, title, body, excerpt, type, published_at
					FROM content
					WHERE status = 'published' AND slug != ${trimmed}
					ORDER BY published_at DESC NULLS LAST, id DESC
					LIMIT ${cap}
				`;

				const out: HubContentItem[] = [];
				for (const row of raw) {
					const parsed = rowSchema.safeParse(row);
					if (!parsed.success) continue;
					out.push(mapRow(parsed.data));
				}
				return out;
			});
		});
	} catch (err) {
		console.error('[content-hub] fetchRelatedPublishedContent failed', err);
		return [];
	}
}

/**
 * One DB session: main post + related list (avoids a second cold connect for article SSR).
 */
export async function fetchPublishedPostWithRelated(
	slug: string,
	contentType: PublishedContentType,
	relatedLimit: number,
	connectionSource?: string | null,
): Promise<{ post: HubPostDetail | null; related: HubContentItem[] }> {
	const trimmed = slug.trim();
	if (!trimmed || trimmed.length > 512) {
		return { post: null, related: [] };
	}
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) {
		return { post: null, related: [] };
	}
	const cap = Math.min(Math.max(relatedLimit, 1), 20);
	const ns = hubDbCacheNamespace(connectionString);
	const key = `hub:v1:bundle:${ns}:${contentType}:${encodeURIComponent(trimmed)}:${cap}`;

	try {
		return await cachedHubRead(
			key,
			async () => {
				return await withSql(connectionString, async (sql) => {
					const rawPost = await sql`
						SELECT id, slug, title, body, excerpt, type, published_at, schema_markup
						FROM content
						WHERE status = 'published' AND slug = ${trimmed} AND type = ${contentType}
						LIMIT 1
					`;
					const row = rawPost[0];
					if (!row) {
						return { post: null, related: [] };
					}
					const parsedPost = detailRowSchema.safeParse(row);
					if (!parsedPost.success) {
						console.warn('[content-hub] post row failed validation');
						return { post: null, related: [] };
					}
					const post = mapDetailRow(parsedPost.data);
					if (post.type !== contentType) {
						return { post: null, related: [] };
					}

					const rawRel = await sql`
						SELECT id, slug, title, body, excerpt, type, published_at
						FROM content
						WHERE status = 'published' AND slug != ${trimmed}
						ORDER BY published_at DESC NULLS LAST, id DESC
						LIMIT ${cap}
					`;

					const related: HubContentItem[] = [];
					for (const r of rawRel) {
						const p = rowSchema.safeParse(r);
						if (!p.success) continue;
						related.push(mapRow(p.data));
					}

					return { post, related };
				});
			},
			(r) => r.post != null,
		);
	} catch (err) {
		console.error('[content-hub] fetchPublishedPostWithRelated failed', err);
		return { post: null, related: [] };
	}
}

// --- Sitemap / llms.txt (published URLs + brand) ---

const sitemapRowSchema = z.object({
	slug: z.string().min(1).max(512),
	type: z.string().min(1).max(64),
	updated_at: z.string().nullable().optional(),
});

const brandRowSchema = z.object({
	name: z.string().nullable().optional(),
	tagline: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	services: z.string().nullable().optional(),
});

export type SitemapEntry = { slug: string; type: string; updatedAt: string | null };

export type BrandContextLite = {
	name: string | null;
	tagline: string | null;
	description: string | null;
	services: string | null;
};

export async function fetchPublishedSitemapRows(
	connectionSource?: string | null,
): Promise<SitemapEntry[]> {
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) return [];

	try {
		return await withSql(connectionString, async (sql) => {
			const raw = await sql`
				SELECT slug, type, updated_at
				FROM content
				WHERE status = 'published'
				ORDER BY updated_at DESC NULLS LAST, id DESC
			`;
			const out: SitemapEntry[] = [];
			for (const row of raw) {
				const parsed = sitemapRowSchema.safeParse(row);
				if (!parsed.success) continue;
				out.push({
					slug: parsed.data.slug,
					type: parsed.data.type,
					updatedAt: parsed.data.updated_at ?? null,
				});
			}
			return out;
		});
	} catch (err) {
		console.error('[content-hub] fetchPublishedSitemapRows failed', err);
		return [];
	}
}

export async function fetchBrandContextLite(
	connectionSource?: string | null,
): Promise<BrandContextLite | null> {
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) return null;

	try {
		return await withSql(connectionString, async (sql) => {
			const raw = await sql`
				SELECT name, tagline, description, services
				FROM brand_context
				ORDER BY id ASC
				LIMIT 1
			`;
			const row = raw[0];
			if (!row) return null;
			const parsed = brandRowSchema.safeParse(row);
			if (!parsed.success) return null;
			return {
				name: parsed.data.name ?? null,
				tagline: parsed.data.tagline ?? null,
				description: parsed.data.description ?? null,
				services: parsed.data.services ?? null,
			};
		});
	} catch (err) {
		console.error('[content-hub] fetchBrandContextLite failed', err);
		return null;
	}
}

const llmsContentRowSchema = z.object({
	slug: z.string().min(1).max(512),
	type: z.string().min(1).max(64),
	title: z.string().min(1).max(2000),
	meta_description: z.string().nullable().optional(),
	excerpt: z.string().nullable().optional(),
});

export type LlmsContentRow = { slug: string; type: string; title: string; blurb: string };

export async function fetchPublishedLlmsRows(
	connectionSource?: string | null,
): Promise<LlmsContentRow[]> {
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) return [];

	try {
		return await withSql(connectionString, async (sql) => {
			const raw = await sql`
				SELECT slug, type, title, meta_description, excerpt
				FROM content
				WHERE status = 'published'
				ORDER BY published_at DESC NULLS LAST, id DESC
				LIMIT 200
			`;
			const out: LlmsContentRow[] = [];
			for (const row of raw) {
				const parsed = llmsContentRowSchema.safeParse(row);
				if (!parsed.success) continue;
				const blurb =
					parsed.data.meta_description?.trim() ||
					parsed.data.excerpt?.trim() ||
					'';
				out.push({
					slug: parsed.data.slug,
					type: parsed.data.type,
					title: parsed.data.title,
					blurb,
				});
			}
			return out;
		});
	} catch (err) {
		console.error('[content-hub] fetchPublishedLlmsRows failed', err);
		return [];
	}
}

// --- Client analytics → analytics_events (matches seo-engine /api/track) ---

export type TrackEventInput = {
	event: string;
	path: string;
	contentSlug?: string;
	contentType?: string;
	value?: string;
	sessionId: string;
	referrer?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	deviceType?: string;
	browser?: string;
};

const trackEventSchema = z.object({
	event: z.string().min(1).max(120),
	path: z.string().min(1).max(2048),
	contentSlug: z.string().max(512).optional(),
	contentType: z.string().max(64).optional(),
	value: z.string().max(4000).optional(),
	sessionId: z.string().min(1).max(200),
	referrer: z.string().max(4000).optional(),
	utmSource: z.string().max(200).optional(),
	utmMedium: z.string().max(200).optional(),
	utmCampaign: z.string().max(200).optional(),
	deviceType: z.string().max(64).optional(),
	browser: z.string().max(64).optional(),
});

function detectDevice(ua: string): string {
	if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile';
	if (/ipad|tablet/i.test(ua)) return 'tablet';
	return 'desktop';
}

function detectBrowser(ua: string): string {
	if (/firefox/i.test(ua)) return 'Firefox';
	if (/edg/i.test(ua)) return 'Edge';
	if (/chrome/i.test(ua)) return 'Chrome';
	if (/safari/i.test(ua)) return 'Safari';
	if (/opera|opr/i.test(ua)) return 'Opera';
	return 'Other';
}

/** Persist validated analytics events; never throws (tracking must not break UX). */
export async function persistAnalyticsEvents(
	events: unknown[],
	userAgent: string,
	connectionSource?: string | null,
): Promise<void> {
	const connectionString = resolveConnectionString(connectionSource);
	if (!connectionString || !isLikelyPostgresUrl(connectionString)) return;

	const device = detectDevice(userAgent);
	const browser = detectBrowser(userAgent);
	const createdAt = new Date().toISOString();

	const normalized: TrackEventInput[] = [];
	for (const raw of events.slice(0, 50)) {
		const parsed = trackEventSchema.safeParse(raw);
		if (!parsed.success) continue;
		normalized.push({
			...parsed.data,
			deviceType: parsed.data.deviceType || device,
			browser: parsed.data.browser || browser,
		});
	}
	if (normalized.length === 0) return;

	try {
		await withSql(connectionString, async (sql) => {
			for (const evt of normalized) {
				await sql`
					INSERT INTO analytics_events (
						session_id, event, path, content_slug, content_type, value,
						referrer, utm_source, utm_medium, utm_campaign, device_type, browser, created_at
					) VALUES (
						${evt.sessionId},
						${evt.event},
						${evt.path},
						${evt.contentSlug ?? null},
						${evt.contentType ?? null},
						${evt.value ?? null},
						${evt.referrer ?? null},
						${evt.utmSource ?? null},
						${evt.utmMedium ?? null},
						${evt.utmCampaign ?? null},
						${evt.deviceType ?? device},
						${evt.browser ?? browser},
						${createdAt}
					)
				`;
				if (evt.event === 'page_view' && evt.contentSlug) {
					await sql`
						UPDATE content
						SET views = COALESCE(views, 0) + 1
						WHERE slug = ${evt.contentSlug}
					`;
				}
			}
		});
	} catch (err) {
		console.error('[content-hub] persistAnalyticsEvents failed', err);
	}
}
