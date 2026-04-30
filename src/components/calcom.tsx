import Cal, { getCalApi } from '@calcom/embed-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
} from '@/components/ui/dialog';

/** Namespace and link must match `getCalApi` / data-cal-* usage (see Cal embed docs). */
export const CAL_EMBED_NAMESPACE = 'discovery';

/** Public booking page — used to derive embed origin and path. */
export const CAL_BOOKING_PAGE_URL = 'https://app.cal.com/buildforms/discovery';

export const CAL_INLINE_CONFIG = {
	layout: 'month_view' as const,
	useSlotsViewOnSmallScreen: 'true' as const,
};

/** Prime Cal UI for this namespace (same as the `cal("ui", …)` snippet). */
export async function initCalDiscoveryUi() {
	const cal = await getCalApi({ namespace: CAL_EMBED_NAMESPACE });
	cal('ui', {
		hideEventTypeDetails: false,
		layout: 'month_view',
	});
}

export type CalEmbedParams = {
	calLink: string;
	calOrigin: string;
	embedJsUrl: string;
};

/** Parses a full Cal booking URL into props for `<Cal />` (cal.com, cal.eu, or same-origin). */
export function getCalEmbedParamsFromPageUrl(pageUrl: string): CalEmbedParams | null {
	try {
		const u = new URL(pageUrl);
		const path = u.pathname.replace(/^\/+|\/+$/g, '');
		if (!path) return null;
		const calOrigin = u.origin;
		return {
			calLink: path,
			calOrigin,
			embedJsUrl: `${calOrigin}/embed/embed.js`,
		};
	} catch {
		return null;
	}
}

export const defaultEmbedParams =
	getCalEmbedParamsFromPageUrl(CAL_BOOKING_PAGE_URL) ?? {
		calLink: 'buildforms/discovery',
		calOrigin: 'https://app.cal.com',
		embedJsUrl: 'https://www.cal.eu/embed/embed.js',
	};

export type BookDemoCalDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

/**
 * Cal.com embed inside Radix dialog — used by the book-demo island (no cross-island context).
 */
export function BookDemoCalDialog({ open, onOpenChange }: BookDemoCalDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="
            max-w-[calc(100vw-2rem)]
            sm:max-w-[calc(100vw-4rem)]
            md:!max-w-4xl
            max-h-[90vh]
            overflow-hidden
            p-0
            rounded-xl
            border-border
            bg-white
            text-foreground
            shadow-2xl
            ring-offset-background
            [&>button]:text-muted-foreground
            [&>button]:hover:bg-muted
            [&>button]:hover:text-foreground
            [&>button]:ring-offset-background
          "
			>
				<DialogHeader className="px-6 pt-6 pb-4" />

				<div className="max-h-[calc(90vh-160px)] w-full overflow-y-auto bg-white px-2 pb-4 sm:px-3">
					{open ? (
						<Cal
							namespace={CAL_EMBED_NAMESPACE}
							calLink={defaultEmbedParams.calLink}
							calOrigin={defaultEmbedParams.calOrigin}
							embedJsUrl={defaultEmbedParams.embedJsUrl}
							config={{
								...CAL_INLINE_CONFIG,
								theme: 'light',
								'ui.color-scheme': 'light',
							}}
							className="h-[600px] w-full"
							style={{ width: '100%', height: '100%' }}
						/>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
