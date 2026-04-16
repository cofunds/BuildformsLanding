/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_POSTHOG_TOKEN?: string;
	readonly PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
