export interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: Date;
  path: string;
  // Optional extended properties
  createdDate?: Date;
  isHidden?: boolean;
  isSystem?: boolean;
  author?: string;
  extension?: string;
}

export interface FolderData {
  folderName: string;
  path: string;
  files: FileInfo[];
}

export type ExtraField = 
  | 'createdDate'
  | 'isHidden'
  | 'extension'
  | 'path';

export const extraFieldLabels: Record<ExtraField, string> = {
  createdDate: 'Fecha de creación',
  isHidden: 'Oculto',
  extension: 'Extensión',
  path: 'Ruta completa',
};
