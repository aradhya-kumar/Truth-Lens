import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import DetectionTool from "@/components/DetectionTool";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Features />
      <DetectionTool />
      <Footer />
    </div>
  );
};

export default Index;
