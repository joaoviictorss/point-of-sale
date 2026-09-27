import { Faq } from './_components/faq/faq';
import { Features } from './_components/features/features';
import { FinalCta } from './_components/final-cta';
import { Footer } from './_components/footer';
import { Hero } from './_components/hero';
import { HowItWorks } from './_components/how-it-works/how-it-works';
import { Mobile } from './_components/mobile/mobile';
import { MobileCtaBar } from './_components/mobile-cta-bar';
import { Modules } from './_components/modules/modules';
import { Nav } from './_components/nav';
import { Payments } from './_components/payments';
import { PosSection } from './_components/pos/pos-section';
import { Pricing } from './_components/pricing';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <Nav />
      <Hero />
      <Payments />
      <Features />
      <Mobile />
      <Modules />
      <PosSection />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <MobileCtaBar />
      <Footer />
    </div>
  );
}
