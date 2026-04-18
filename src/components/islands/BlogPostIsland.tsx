import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { getPostBySlug } from '@/lib/blog';

type Props = {
	slug: string;
};

export default function BlogPostIsland({ slug }: Props) {
	const post = getPostBySlug(slug);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="pt-24 sm:pt-28 pb-16 sm:pb-20">
				<div className="max-w-3xl mx-auto section-padding">
					<a
						href="/blog"
						className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
					>
						← All posts
					</a>

					{post ? (
						<article className="mt-8">
							<p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground">
								Blog
							</p>
							<h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
								{post.title}
							</h1>
							<time
								dateTime={post.date}
								className="mt-3 block text-sm text-muted-foreground"
							>
								{new Date(post.date + 'T12:00:00').toLocaleDateString(undefined, {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
							<div className="mt-10 space-y-4 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
								{post.paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
							</div>
						</article>
					) : (
						<div className="mt-10">
							<h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
								Post not found
							</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								This slug is not in <code className="text-foreground">src/lib/blog.ts</code> yet.
							</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
