import * as React from 'react';
import { cn } from '@/lib/utils';

export function ChangelogVideo(props: React.ComponentProps<'video'>) {
	return (
		<video className={cn('rounded-md border', props.className)} controls loop {...props} />
	);
}

export function ChangelogProseImg(props: React.ComponentProps<'img'>) {
	return <img className={cn('rounded-md border', props.className)} {...props} />;
}

/** Passed to MDX `<Content components={...} />` for changelog entries. */
export const changelogMdxComponents = {
	Video: ChangelogVideo,
	img: ChangelogProseImg,
};
