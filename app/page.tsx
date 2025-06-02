import HeroSection from "@/components/home/herosection";
import DemoSection from "@/components/home/demosection";
import HowItWorks from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorks />
        <PricingSection />
      </div>
      
    
      {/* <PricingSection /> */}
      {/* <CTASection /> */}
    </div>
  );
}
