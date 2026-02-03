import { useRef } from 'react';
import { Upload, FolderOpen, CheckCircle2, FileText, Folder, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
}

interface FolderSelectorProps {
  onFilesSelected: (files: FileList) => void;
  selectedFolderName: string | null;
  filesCount: number;
  isProcessing: boolean;
  stats?: FolderStats;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FolderSelector({ 
  onFilesSelected, 
  selectedFolderName,
  filesCount,
  isProcessing,
  stats
}: FolderSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const hasSelection = selectedFolderName !== null;

  return (
    <div className="w-full space-y-3">
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - webkitdirectory is a non-standard attribute
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleChange}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          "drop-zone w-full group",
          hasSelection && "border-accent bg-accent/5",
          isProcessing && "animate-pulse-soft"
        )}
      >
        {hasSelection ? (
          <>
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-accent mb-4 transition-transform group-hover:scale-110" />
            <span className="text-lg md:text-xl font-semibold text-foreground">
              {selectedFolderName}
            </span>
            <span className="text-xs text-muted-foreground mt-3">
              Haz clic para cambiar la carpeta
            </span>
          </>
        ) : (
          <>
            <div className="relative mb-4">
              <FolderOpen className="w-12 h-12 md:w-16 md:h-16 text-primary transition-transform group-hover:scale-110" />
              <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary absolute -bottom-1 -right-1 animate-bounce" />
            </div>
            <span className="text-lg md:text-xl font-semibold text-foreground">
              Seleccionar carpeta
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              Haz clic para elegir una carpeta de tu ordenador
            </span>
          </>
        )}
      </button>

      {/* Statistics panel */}
      {hasSelection && stats && (
        <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-xl border border-border">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">{stats.totalFiles}</span>
            <span className="text-xs text-muted-foreground">Archivos</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 mb-2">
              <Folder className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xl font-bold text-foreground">{stats.totalFolders}</span>
            <span className="text-xs text-muted-foreground">Carpetas</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 mb-2">
              <HardDrive className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{formatBytes(stats.totalSize)}</span>
            <span className="text-xs text-muted-foreground">Tamaño total</span>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
        <span className="font-medium text-foreground">Privacidad garantizada:</span> El procesamiento de archivos se realiza en tu dispositivo. Al ejecutarse de forma local, tus archivos nunca salen de tu navegador ni son guardados en servidores externos.
      </p>
    </div>
  );
}
