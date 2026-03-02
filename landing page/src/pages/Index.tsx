import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import WhyToolsFailSection from "@/components/landing/WhyToolsFailSection";
import BeliefSection from "@/components/landing/BeliefSection";
import WhatWeAreSection from "@/components/landing/WhatWeAreSection";
import TrustSection from "@/components/landing/TrustSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AudienceSection from "@/components/landing/AudienceSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  // Landing page for Sentinals
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <WhyToolsFailSection />
        <BeliefSection />
        <WhatWeAreSection />
        <TrustSection />
        <HowItWorksSection />
        <AudienceSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
