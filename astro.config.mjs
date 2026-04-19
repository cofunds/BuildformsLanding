// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// https://astro.build/config
export default defineConfig({
	// Server output so `src/middleware.ts` runs on Vercel (static-only builds omit middleware).
	output: 'server',
	adapter: vercel(),
	integrations: [react()],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(rootDir, 'src'),
			},
			// MDX + React islands must share one React copy or hooks throw in dev ("Invalid hook call").
			dedupe: ['react', 'react-dom'],
		},
	},
});
