import { Image, Video, BarChart3, Zap, Layers, Lock } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Image Analysis",
    description: "Detect manipulated photos, face swaps, and AI-generated images with pixel-level precision.",
  },
  {
    icon: Video,
    title: "Video Detection",
    description: "Frame-by-frame analysis to catch deepfake videos, lip-sync manipulation, and face reenactment.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description: "Get a detailed authenticity probability score backed by multi-model consensus.",
  },
  {
    icon: Zap,
    title: "Real-Time Speed",
    description: "Results in under 2 seconds. Optimized inference pipeline for instant feedback.",
  },
  {
    icon: Layers,
    title: "Multi-Layer Scan",
    description: "Analyzes metadata, compression artifacts, noise patterns, and facial geometry simultaneously.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "All uploads are encrypted and auto-deleted. Zero data retention policy.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
            Built for <span className="text-primary neon-text">Truth</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:neon-border hover:bg-card/60"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-shadow duration-300 group-hover:neon-glow">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
