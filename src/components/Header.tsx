import { FolderOpen, FileSpreadsheet } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <FolderOpen className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 text-accent absolute -bottom-1 -right-1" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Folder<span className="text-primary">2</span>Xlsx
          </h1>
        </div>
      </div>
      <p className="text-center text-muted-foreground mt-2 text-sm md:text-base max-w-xl mx-auto">
        Exporta el contenido de tus carpetas a Excel de forma rápida y sencilla
      </p>
    </header>
  );
}
