import { format } from 'date-fns';

export function formatChangelogDate(isoDate: string): string {
	return format(new Date(isoDate), 'MMMM d, yyyy');
}
