import { ArrowDown, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToDetect = () => {
    document.getElementById("detect")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Scan line overlay */}
      <div className="absolute inset-0 scan-line pointer-events-none" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8">
          <Scan className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono text-primary tracking-wider uppercase">
            AI-Powered Detection
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
          <span className="block text-foreground">See Through</span>
          <span className="block text-primary neon-text">The Lies</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg mx-auto text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed">
          Advanced deepfake detection powered by neural networks. 
          Analyze images in seconds with military-grade accuracy.
        </p>

        {/* CTA */}
        <Button
          onClick={scrollToDetect}
          size="lg"
          className="neon-glow animate-pulse-glow rounded-full px-8 py-6 text-base font-mono font-bold tracking-wider uppercase gap-3"
        >
          Start Detecting
          <ArrowDown className="h-4 w-4" />
        </Button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[
            ["99.7%", "Accuracy"],
            ["<2s", "Analysis"],
            ["10M+", "Scans"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-primary">{value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
