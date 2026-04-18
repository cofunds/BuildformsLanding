import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { blogPosts } from '@/lib/blog';

export default function BlogIsland() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="pt-24 sm:pt-28 pb-16 sm:pb-20">
				<div className="max-w-3xl mx-auto section-padding">
					<p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
						Blog
					</p>
					<h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
						BuildForms journal
					</h1>
					<p className="mt-3 text-sm text-muted-foreground max-w-2xl">
						Notes on hiring, forms, and the product. Interactive widgets from your Next.js blog belong in
						this island (or a child component with the same boundaries).
					</p>

					<ul className="mt-12 space-y-8">
						{blogPosts.map((post) => (
							<li key={post.slug}>
								<a
									href={`/blog/${post.slug}`}
									className="group block rounded-lg border border-border bg-card/30 p-5 sm:p-6 transition-colors hover:bg-card/60"
								>
									<time
										dateTime={post.date}
										className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
									>
										{new Date(post.date + 'T12:00:00').toLocaleDateString(undefined, {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</time>
									<h2 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-foreground group-hover:underline underline-offset-4">
										{post.title}
									</h2>
									<p className="mt-2 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
										{post.excerpt}
									</p>
									<span className="mt-3 inline-block text-sm font-medium text-foreground">
										Read more →
									</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</main>
			<Footer />
		</div>
	);
}
