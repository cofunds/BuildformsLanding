import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const changelog = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/changelog' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.string(),
		tags: z.array(z.string()).optional(),
		version: z.string().optional(),
	}),
});

export const collections = { changelog };
