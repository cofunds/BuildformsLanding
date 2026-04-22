/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_TOKEN?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
  readonly PUBLIC_HERO_DEMO_VIDEO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
