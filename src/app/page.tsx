import { CTASection } from "@/components/landing/CTASection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RolesSection } from "@/components/landing/RolesSection";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        <RolesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
