import { Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-auto border-t border-border bg-card/50">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <p className="text-sm text-foreground font-medium">
          Aitor Sánchez Gutiérrez © 2026 - Reservados todos los derechos
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <a 
            href="mailto:blog.cottage627@passinbox.com"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            blog.cottage627@passinbox.com
          </a>
          <a 
            href="https://aitorblog.infinityfreeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Globe className="w-4 h-4" />
            Blog
          </a>
        </div>
      </div>
    </footer>
  );
}
