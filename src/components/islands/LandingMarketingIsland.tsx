import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import ProductSection from '@/components/ProductSection';
import WhyDifferentSection from '@/components/WhyDifferentSection';
import FinalCTASection from '@/components/FinalCTASection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { useSectionTracking } from '@/hooks/useSectionTracking';
import { TooltipProvider } from '@/components/ui/tooltip';

export function LandingMarketingIsland() {
	useSectionTracking();

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-background">
				<Navbar />
				<HeroSection />
				<ProblemSection />
				<ProductSection />
				<WhyDifferentSection />
				<FinalCTASection />
				<FAQSection />
				<Footer />
			</div>
		</TooltipProvider>
	);
}
