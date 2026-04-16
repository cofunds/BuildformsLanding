import { defineMiddleware } from 'astro:middleware';
import { tryRespondWithMergedOgShell } from './lib/edgeOgMerge';

export const onRequest = defineMiddleware(async (context, next) => {
	const merged = await tryRespondWithMergedOgShell(context.request);
	if (merged) {
		return merged;
	}
	return next();
});
