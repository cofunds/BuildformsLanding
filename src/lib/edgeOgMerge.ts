/**
 * Vercel Edge / Astro: public /f/* and /w/* should serve the same HTML shell as `/`
 * with Open Graph metadata merged from the beta Next app (Convex-backed generateMetadata).
 * Ported from buildforms-launchpad/middleware.ts with a small client redirect so humans reach
 * beta without mounting a full SPA (replaces BetaPathRedirect.tsx).
 */

const BETA_ORIGIN = 'https://beta.buildforms.so';

const BETA_REDIRECT_SNIPPET = `<script data-buildforms="beta-redirect">window.location.replace(${JSON.stringify(BETA_ORIGIN)}+window.location.pathname+window.location.search+window.location.hash);</script>`;

function escapeAttr(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
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
		`<meta\\s+[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
		'i',
	);
	const m1 = html.match(ordered);
	if (m1) return m1[1];
	const reversed = new RegExp(
		`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
		'i',
	);
	const m2 = html.match(reversed);
	return m2 ? m2[1] : null;
}

function metaNameContent(html: string, name: string): string | null {
	const ordered = new RegExp(
		`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
		'i',
	);
	const m1 = html.match(ordered);
	if (m1) return m1[1];
	const reversed = new RegExp(
		`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`,
		'i',
	);
	const m2 = html.match(reversed);
	return m2 ? m2[1] : null;
}

function extractTitle(html: string): string | null {
	const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	return m ? m[1].trim() : null;
}

function replaceMetaProperty(html: string, property: string, newContent: string): string {
	const escaped = escapeAttr(newContent);
	return html.replace(
		new RegExp(`(<meta\\s+property=["']${property}["']\\s+content=")[^"]*("\\s*\\/?>)`, 'i'),
		`$1${escaped}$2`,
	);
}

function replaceMetaName(html: string, name: string, newContent: string): string {
	const escaped = escapeAttr(newContent);
	return html.replace(
		new RegExp(`(<meta\\s+name=["']${name}["']\\s+content=")[^"]*("\\s*\\/?>)`, 'i'),
		`$1${escaped}$2`,
	);
}

function replaceTitleTag(html: string, newTitle: string): string {
	return html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(newTitle)}</title>`);
}

function replaceLinkCanonical(html: string, href: string): string {
	return html.replace(
		/(<link\s+rel=["']canonical["']\s+href=")[^"]*("\s*\/?>)/i,
		`$1${escapeAttr(href)}$2`,
	);
}

function replaceMetaDescription(html: string, content: string): string {
	return html.replace(
		/(<meta\s+name=["']description["']\s+content=")[^"]*("\s*\/?>)/i,
		`$1${escapeAttr(content)}$2`,
	);
}

function injectBetaRedirect(html: string): string {
	return html.replace(/<body(\s[^>]*)?>/i, (match) => `${match}${BETA_REDIRECT_SNIPPET}`);
}

async function loadIndexHtml(request: Request): Promise<string | null> {
	const base = new URL(request.url);
	for (const path of ['/index.html', '/']) {
		const res = await fetch(new URL(path, base), {
			headers: { accept: 'text/html' },
			redirect: 'follow',
		});
		if (res.ok) {
			const text = await res.text();
			if (text.includes('<!doctype html>') || text.includes('<html')) return text;
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

	const [indexHtml, betaRes] = await Promise.all([
		loadIndexHtml(request),
		fetch(`${BETA_ORIGIN}${pathname}${url.search}`, {
			headers: { accept: 'text/html' },
			redirect: 'follow',
		}),
	]);

	if (!indexHtml) {
		return null;
	}

	const pageUrl = url.toString();
	let html = indexHtml;

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
			const ogImage = `${BETA_ORIGIN}/api/og?slug=${encodeURIComponent(slugDecoded)}`;
			html = replaceMetaProperty(html, 'og:image', ogImage);
			html = replaceMetaName(html, 'twitter:image', ogImage);
		}
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
	if (ogImage) html = replaceMetaProperty(html, 'og:image', decodeHtmlEntities(ogImage));
	if (twTitle) html = replaceMetaName(html, 'twitter:title', decodeHtmlEntities(twTitle));
	if (twDescription) {
		html = replaceMetaName(html, 'twitter:description', decodeHtmlEntities(twDescription));
	}
	if (twImage) html = replaceMetaName(html, 'twitter:image', decodeHtmlEntities(twImage));
	if (docTitle) html = replaceTitleTag(html, decodeHtmlEntities(docTitle));

	html = injectBetaRedirect(html);

	return new Response(html, {
		status: 200,
		headers: {
			'content-type': 'text/html; charset=utf-8',
			'cache-control': 'public, max-age=0, must-revalidate',
		},
	});
}
