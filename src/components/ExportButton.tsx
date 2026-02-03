import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  onClick: () => void;
  disabled: boolean;
  isExporting: boolean;
}

export function ExportButton({ onClick, disabled, isExporting }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isExporting}
      className={cn(
        "btn-primary w-full md:w-auto min-w-[200px]",
        disabled && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none"
      )}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generando...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Exportar a Excel</span>
        </>
      )}
    </button>
  );
}
