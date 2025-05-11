import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/herosection";

export default function Home() {
  return (
    <div className="relative w-full">
      <HeroSection />
      {/* <DemoSection /> */}
      {/* <HowItWorkSection /> */}
      {/* <PricingSection /> */}
      {/* <CTASection /> */}
    </div>
  );
}
