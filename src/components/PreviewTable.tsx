import type { FolderData, ExtraField } from '@/types/fileTypes';
import { extraFieldLabels } from '@/types/fileTypes';
import { formatFileSize, formatDate } from '@/utils/fileUtils';
import { Folder, File, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PreviewTableProps {
  folders: FolderData[];
  extraFields: ExtraField[];
}

export function PreviewTable({ folders, extraFields }: PreviewTableProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([folders[0]?.path])
  );

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  if (folders.length === 0) return null;

  return (
    <div className="w-full card-elevated overflow-hidden">
      <h3 className="font-semibold text-foreground mb-4">
        Vista previa ({folders.length} {folders.length === 1 ? 'hoja' : 'hojas'} de Excel)
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {folders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.path);
          
          return (
            <div key={folder.path} className="border border-border rounded-lg overflow-hidden">
              {/* Folder header */}
              <button
                onClick={() => toggleFolder(folder.path)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Folder className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm truncate">{folder.folderName}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {folder.files.length} archivos
                </span>
              </button>

              {/* Files table */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Nombre</th>
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Tamaño</th>
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">Modificado</th>
                        {extraFields.map(field => (
                          <th key={field} className="text-left px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">
                            {extraFieldLabels[field]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {folder.files.slice(0, 5).map((file, idx) => (
                        <tr 
                          key={`${file.path}-${idx}`}
                          className={cn(
                            "border-t border-border",
                            idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                          )}
                        >
                          <td className="px-4 py-2 flex items-center gap-2">
                            <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{file.name}</span>
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{file.type}</td>
                          <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{formatFileSize(file.size)}</td>
                          <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{formatDate(file.lastModified)}</td>
                          {extraFields.map(field => (
                            <td key={field} className="px-4 py-2 text-muted-foreground">
                              {field === 'isHidden' ? (file.isHidden ? 'Sí' : 'No') :
                               field === 'extension' ? (file.extension || '-') :
                               field === 'path' ? <span className="truncate max-w-[150px] block">{file.path}</span> :
                               '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {folder.files.length > 5 && (
                        <tr className="border-t border-border">
                          <td 
                            colSpan={4 + extraFields.length} 
                            className="px-4 py-2 text-center text-muted-foreground text-xs italic"
                          >
                            ... y {folder.files.length - 5} archivos más
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
