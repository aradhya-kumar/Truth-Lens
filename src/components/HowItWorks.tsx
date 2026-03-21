import { Upload, Cpu, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop any image into our detection engine. Supports all major formats.",
    step: "01",
  },
  {
    icon: Cpu,
    title: "Analyze",
    description: "Our neural network scans for manipulation artifacts, inconsistencies, and deepfake signatures.",
    step: "02",
  },
  {
    icon: ShieldCheck,
    title: "Results",
    description: "Get a detailed authenticity report with confidence scores and visual heat maps.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
            How It <span className="text-primary neon-text">Works</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="group relative p-8 rounded-xl neon-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-5xl font-black text-primary/10 font-mono">
                {step.step}
              </span>

              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:neon-glow transition-shadow duration-300">
                <step.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
