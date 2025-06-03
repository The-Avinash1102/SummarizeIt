import HeroSection from "@/components/home/herosection";
import DemoSection from "@/components/home/demosection";
import HowItWorks from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";
import Header from "@/components/common/header";
import CtaSection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col">
        <Header />
        <HeroSection />
        <DemoSection />
        <HowItWorks />
        <PricingSection />
        <CtaSection />
      </div>
    </div>
  );
}
