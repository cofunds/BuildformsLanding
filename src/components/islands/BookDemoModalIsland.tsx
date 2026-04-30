import { useCallback, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { BOOK_DEMO_EVENT } from '@/constants/book-demo';
import { BookDemoCalDialog, initCalDiscoveryUi } from '@/components/calcom';

export { BOOK_DEMO_EVENT };

export function BookDemoModalIsland() {
	const [open, setOpen] = useState(false);

	const onOpen = useCallback(() => {
		posthog.capture('demo_booking_opened');
		setOpen(true);
	}, []);

	useEffect(() => {
		void initCalDiscoveryUi();
	}, []);

	useEffect(() => {
		const handler = () => onOpen();
		window.addEventListener(BOOK_DEMO_EVENT, handler);
		return () => window.removeEventListener(BOOK_DEMO_EVENT, handler);
	}, [onOpen]);

	return <BookDemoCalDialog open={open} onOpenChange={setOpen} />;
}
