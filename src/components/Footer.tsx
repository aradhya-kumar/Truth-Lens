import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">
              Truth<span className="text-primary">Lens</span>
            </span>
          </div>

          <div className="flex gap-6">
            {["Privacy", "Terms", "API Docs", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            © 2026 TruthLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
