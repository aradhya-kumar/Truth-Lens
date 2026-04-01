import { useState, useCallback, useRef } from "react";
import { Upload, X, Scan, ShieldCheck, AlertTriangle, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type AnalysisState = "idle" | "uploading" | "analyzing" | "complete";

interface AnalysisResult {
  score: number;
  label: string;
  details: { name: string; value: number }[];
}

const DetectionTool = () => {
  const [state, setState] = useState<AnalysisState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateAnalysis = useCallback(() => {
    setState("analyzing");
    setProgress(0);

    const steps = [10, 25, 40, 55, 65, 78, 88, 95, 100];
    let i = 0;

    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        // Random result — weighted toward authentic for demo
        const score = Math.random() > 0.4 ? 75 + Math.random() * 24 : 15 + Math.random() * 40;
        const isAuthentic = score > 60;

        setResult({
          score: Math.round(score),
          label: isAuthentic ? "Likely Authentic" : "Possible Deepfake",
          details: [
            { name: "Face Consistency", value: Math.round(isAuthentic ? 80 + Math.random() * 19 : 20 + Math.random() * 35) },
            { name: "Noise Analysis", value: Math.round(isAuthentic ? 70 + Math.random() * 28 : 25 + Math.random() * 30) },
            { name: "Metadata Check", value: Math.round(isAuthentic ? 85 + Math.random() * 14 : 30 + Math.random() * 25) },
            { name: "Compression Artifacts", value: Math.round(isAuthentic ? 75 + Math.random() * 24 : 15 + Math.random() * 40) },
          ],
        });
        setState("complete");
      }
    }, 250);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setState("uploading");

      // Brief upload simulation
      setTimeout(() => simulateAnalysis(), 600);
    },
    [simulateAnalysis]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setState("idle");
    setProgress(0);
    setResult(null);
  };

  const isAuthentic = result && result.score > 60;

  return (
    <section id="detect" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            Detection Engine
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
            Analyze <span className="text-primary neon-text">Now</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Upload an image to run our deepfake detection analysis
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {state === "idle" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-card/30 p-16 text-center transition-all duration-300 hover:border-primary/60 hover:bg-card/50 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-6 group-hover:neon-glow transition-shadow duration-300">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-lg mb-2">Drop an image here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse · JPG, PNG, WebP
              </p>
            </div>
          ) : (
            <div className="rounded-2xl neon-border bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Image preview with scan overlay */}
              <div className="relative">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Uploaded for analysis"
                    className="w-full max-h-80 object-contain bg-background/50"
                  />
                )}

                {/* Scanning overlay */}
                {state === "analyzing" && (
                  <div className="absolute inset-0 bg-background/40">
                    <div
                      className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_hsl(var(--primary))]"
                      style={{
                        top: `${progress}%`,
                        transition: "top 0.25s linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-background/80 border border-primary/30">
                        <Scan className="h-4 w-4 text-primary animate-spin" />
                        <span className="font-mono text-sm text-primary">
                          Scanning... {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result badge */}
                {state === "complete" && result && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
                        isAuthentic
                          ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                          : "bg-neon-red/10 border-neon-red/30 text-neon-red"
                      }`}
                    >
                      {isAuthentic ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span className="text-sm font-mono font-bold">{result.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis results */}
              {state === "analyzing" && (
                <div className="p-6">
                  <Progress value={progress} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground font-mono mt-3 text-center">
                    Running multi-layer neural analysis...
                  </p>
                </div>
              )}

              {state === "complete" && result && (
                <div className="p-6 space-y-6">
                  {/* Main score */}
                  <div className="text-center">
                    <div className="text-5xl font-black font-mono">
                      <span className={isAuthentic ? "text-neon-green" : "text-neon-red"}>
                        {result.score}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Authenticity Score</p>
                  </div>

                  {/* Detailed scores */}
                  <div className="grid grid-cols-2 gap-3">
                    {result.details.map((detail) => {
                      const good = detail.value > 60;
                      return (
                        <div
                          key={detail.name}
                          className="p-3 rounded-lg bg-muted/50 border border-border/50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-muted-foreground">{detail.name}</span>
                            <span
                              className={`text-xs font-mono font-bold ${
                                good ? "text-neon-green" : "text-neon-red"
                              }`}
                            >
                              {detail.value}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                good ? "bg-neon-green" : "bg-neon-red"
                              }`}
                              style={{ width: `${detail.value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button onClick={reset} variant="outline" className="w-full font-mono gap-2">
                    <FileImage className="h-4 w-4" />
                    Analyze Another Image
                  </Button>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-4 font-mono">
            ⚡ Demo mode — results are simulated for demonstration purposes
          </p>
        </div>
      </div>
    </section>
  );
};

export default DetectionTool;
