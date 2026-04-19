/**
 * /f/* and /w/*: merge Open Graph metadata from the beta Next app into the marketing HTML
 * (same behavior as buildforms-launchpad/middleware.ts). Client redirect + meta refresh send
 * humans to beta (replaces BetaPathRedirect.tsx).
 *
 * Requires SSR routes under `src/pages/f/` and `src/pages/w/` so Vercel does not short-circuit
 * to static 404 before this middleware runs.
 */

const BETA_ORIGIN = 'https://beta.buildforms.so';
const PROD_ORIGIN = 'https://buildforms.so';

/** Prefer marketing-domain OG URLs when beta returns /api/og links. */
function canonicalOgImageUrl(url: string): string {
	try {
		const u = new URL(url);
		if (u.hostname === 'beta.buildforms.so' && u.pathname.startsWith('/api/og')) {
			return `${PROD_ORIGIN}/api/og${u.search}`;
		}
	} catch {
		/* keep raw */
	}
	return url;
}

const BETA_REDIRECT_SNIPPET = `<script data-buildforms="beta-redirect">window.location.replace(${JSON.stringify(BETA_ORIGIN)}+window.location.pathname+window.location.search+window.location.hash);</script>`;

function escapeAttr(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function betaDestinationFromPageUrl(pageUrl: string): string {
	const u = new URL(pageUrl);
	return `${BETA_ORIGIN}${u.pathname}${u.search}${u.hash}`;
}

/** Decode common entities from a captured meta content string before re-escaping. */
function decodeHtmlEntities(value: string): string {
	let s = value;
	s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)));
	s = s.replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)));
	s = s.replace(/&quot;/g, '"');
	s = s.replace(/&lt;/g, '<');
	s = s.replace(/&gt;/g, '>');
	s = s.replace(/&apos;/g, "'");
	s = s.replace(/&amp;/g, '&');
	return s;
}

function metaPropertyContent(html: string, property: string): string | null {
	const ordered = new RegExp(
		`<meta\\s+[^>]*property=["']${escapeRegex(property)}["'][^>]*content=["']([^"']*)["']`,
		'i',
	);
	const m1 = html.match(ordered);
	if (m1) return m1[1];
	const reversed = new RegExp(
		`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']${escapeRegex(property)}["']`,
		'i',
	);
	const m2 = html.match(reversed);
	return m2 ? m2[1] : null;
}

function metaNameContent(html: string, name: string): string | null {
	const ordered = new RegExp(
		`<meta\\s+[^>]*name=["']${escapeRegex(name)}["'][^>]*content=["']([^"']*)["']`,
		'i',
	);
	const m1 = html.match(ordered);
	if (m1) return m1[1];
	const reversed = new RegExp(
		`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${escapeRegex(name)}["']`,
		'i',
	);
	const m2 = html.match(reversed);
	return m2 ? m2[1] : null;
}

function extractTitle(html: string): string | null {
	const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	return m ? m[1].trim() : null;
}

/** Works with Astro/Vite minified HTML: either attribute order, `>` or `/>`. */
function replaceMetaProperty(html: string, property: string, newContent: string): string {
	const escaped = escapeAttr(newContent);
	const p = escapeRegex(property);
	const propFirst = new RegExp(
		`(<meta\\s[^>]*?property=["']${p}["'][^>]*?content=["'])([^"']*)(["'][^>]*?>)`,
		'gi',
	);
	let out = html.replace(propFirst, `$1${escaped}$3`);
	if (out !== html) return out;
	const contentFirst = new RegExp(
		`(<meta\\s[^>]*?content=["'])([^"']*)(["'][^>]*?property=["']${p}["'][^>]*?>)`,
		'gi',
	);
	return html.replace(contentFirst, `$1${escaped}$3`);
}

function replaceMetaName(html: string, name: string, newContent: string): string {
	const escaped = escapeAttr(newContent);
	const n = escapeRegex(name);
	const nameFirst = new RegExp(
		`(<meta\\s[^>]*?name=["']${n}["'][^>]*?content=["'])([^"']*)(["'][^>]*?>)`,
		'gi',
	);
	let out = html.replace(nameFirst, `$1${escaped}$3`);
	if (out !== html) return out;
	const contentFirst = new RegExp(
		`(<meta\\s[^>]*?content=["'])([^"']*)(["'][^>]*?name=["']${n}["'][^>]*?>)`,
		'gi',
	);
	return html.replace(contentFirst, `$1${escaped}$3`);
}

function replaceTitleTag(html: string, newTitle: string): string {
	return html.replace(/<title[^>]*>[^<]*<\/title>/i, `<title>${escapeAttr(newTitle)}</title>`);
}

function replaceLinkCanonical(html: string, href: string): string {
	return html.replace(
		/(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])([^"']*)(["'][^>]*>)/i,
		`$1${escapeAttr(href)}$3`,
	);
}

function replaceMetaDescription(html: string, content: string): string {
	return html.replace(
		/(<meta\s+[^>]*name=["']description["'][^>]*content=["'])([^"']*)(["'][^>]*>)/i,
		`$1${escapeAttr(content)}$3`,
	);
}

function injectBetaRedirect(html: string): string {
	return html.replace(/<body(\s[^>]*)?>/i, (match) => `${match}${BETA_REDIRECT_SNIPPET}`);
}

/** noscript-friendly redirect; complements inline script when CSP blocks it. */
function injectHeadBetaRefresh(html: string, pageUrl: string): string {
	const dest = escapeAttr(betaDestinationFromPageUrl(pageUrl));
	const tag = `<meta http-equiv="refresh" content="0;url=${dest}" />`;
	return html.replace(/<\/head>/i, `${tag}</head>`);
}

/** When self-fetch of `/` fails (some serverless contexts), still return valid OG + redirect. */
function minimalMarketingShell(pageUrl: string): string {
	const esc = escapeAttr;
	const dest = esc(betaDestinationFromPageUrl(pageUrl));
	return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>BuildForms</title>
<meta name="description" content="BuildForms is an AI-powered hiring OS for startups and small teams." />
<link rel="canonical" href="${esc(pageUrl)}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="BuildForms" />
<meta property="og:description" content="BuildForms is an AI-powered hiring OS for startups and small teams." />
<meta property="og:url" content="${esc(pageUrl)}" />
<meta property="og:site_name" content="BuildForms" />
<meta property="og:image" content="https://buildforms.so/api/og" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="BuildForms" />
<meta name="twitter:description" content="BuildForms is an AI-powered hiring OS for startups and small teams." />
<meta name="twitter:image" content="https://buildforms.so/api/og" />
</head><body>
${BETA_REDIRECT_SNIPPET}
<noscript><p><a href="${dest}">Continue to BuildForms</a></p></noscript>
</body></html>`;
}

async function loadIndexHtml(request: Request): Promise<string | null> {
	const url = new URL(request.url);
	const candidates: string[] = [new URL('/', url.origin).href, new URL('/index.html', url.origin).href];

	const vercelHost =
		typeof process !== 'undefined' && process.env.VERCEL_URL ? process.env.VERCEL_URL : null;
	if (vercelHost) {
		const deploymentRoot = `https://${vercelHost}/`;
		if (!candidates.includes(deploymentRoot)) {
			candidates.push(deploymentRoot);
		}
	}

	for (const href of candidates) {
		try {
			const res = await fetch(href, {
				headers: {
					accept: 'text/html,application/xhtml+xml',
					...(url.host ? { host: url.host, 'x-forwarded-host': url.host } : {}),
				},
				redirect: 'follow',
			});
			if (res.ok) {
				const text = await res.text();
				if (/<!DOCTYPE html>|<!doctype html>|<html/i.test(text)) {
					return text;
				}
			}
		} catch {
			/* try next candidate */
		}
	}
	return null;
}

/**
 * If the request is a GET for /f/* or /w/* with an HTML-ish Accept header, returns a merged
 * HTML Response. Otherwise returns `null` so the caller can continue the pipeline.
 */
export async function tryRespondWithMergedOgShell(request: Request): Promise<Response | null> {
	if (request.method !== 'GET') {
		return null;
	}

	const url = new URL(request.url);
	const { pathname } = url;

	if (!pathname.startsWith('/f/') && !pathname.startsWith('/w/')) {
		return null;
	}

	const accept = request.headers.get('accept') ?? '';
	if (
		accept &&
		!accept.includes('text/html') &&
		!accept.includes('*/*') &&
		!accept.includes('application/xhtml+xml')
	) {
		return null;
	}

	const pageUrl = url.toString();

	const [fetchedIndex, betaRes] = await Promise.all([
		loadIndexHtml(request),
		fetch(`${BETA_ORIGIN}${pathname}${url.search}`, {
			headers: { accept: 'text/html' },
			redirect: 'follow',
		}),
	]);

	let html = fetchedIndex ?? minimalMarketingShell(pageUrl);

	html = replaceLinkCanonical(html, pageUrl);
	html = replaceMetaProperty(html, 'og:url', pageUrl);

	if (!betaRes.ok) {
		const formSlug = pathname.match(/^\/f\/(.+)/)?.[1];
		if (formSlug) {
			let slugDecoded = formSlug;
			try {
				slugDecoded = decodeURIComponent(formSlug);
			} catch {
				/* keep raw segment */
			}
			const ogImage = `${PROD_ORIGIN}/api/og?slug=${encodeURIComponent(slugDecoded)}`;
			html = replaceMetaProperty(html, 'og:image', ogImage);
			html = replaceMetaName(html, 'twitter:image', ogImage);
		}
		html = injectHeadBetaRefresh(html, pageUrl);
		html = injectBetaRedirect(html);
		return new Response(html, {
			status: 200,
			headers: {
				'content-type': 'text/html; charset=utf-8',
				'cache-control': 'public, max-age=0, must-revalidate',
			},
		});
	}

	const betaHtml = await betaRes.text();

	const ogTitle = metaPropertyContent(betaHtml, 'og:title');
	const ogDescription = metaPropertyContent(betaHtml, 'og:description');
	const ogImage = metaPropertyContent(betaHtml, 'og:image');
	const twTitle = metaNameContent(betaHtml, 'twitter:title');
	const twDescription = metaNameContent(betaHtml, 'twitter:description');
	const twImage = metaNameContent(betaHtml, 'twitter:image');
	const docTitle = extractTitle(betaHtml);

	if (ogTitle) html = replaceMetaProperty(html, 'og:title', decodeHtmlEntities(ogTitle));
	if (ogDescription) {
		const desc = decodeHtmlEntities(ogDescription);
		html = replaceMetaProperty(html, 'og:description', desc);
		html = replaceMetaDescription(html, desc);
	}
	if (ogImage) {
		html = replaceMetaProperty(html, 'og:image', canonicalOgImageUrl(decodeHtmlEntities(ogImage)));
	}
	if (twTitle) html = replaceMetaName(html, 'twitter:title', decodeHtmlEntities(twTitle));
	if (twDescription) {
		html = replaceMetaName(html, 'twitter:description', decodeHtmlEntities(twDescription));
	}
	if (twImage) {
		html = replaceMetaName(html, 'twitter:image', canonicalOgImageUrl(decodeHtmlEntities(twImage)));
	}
	if (docTitle) html = replaceTitleTag(html, decodeHtmlEntities(docTitle));

	html = injectHeadBetaRefresh(html, pageUrl);
	html = injectBetaRedirect(html);

	return new Response(html, {
		status: 200,
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'public, max-age=0, must-revalidate',
		},
	});
}
