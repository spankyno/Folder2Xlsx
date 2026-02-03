import type { FileInfo, FolderData } from '@/types/fileTypes';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    return '.' + parts.pop()!.toLowerCase();
  }
  return '';
}

export function getFileType(file: File): string {
  const ext = getFileExtension(file.name);
  if (ext) return ext;
  if (file.type) return file.type.split('/')[1] || 'archivo';
  return 'archivo';
}

export async function processFiles(
  files: FileList,
  includeSubfolders: boolean
): Promise<FolderData[]> {
  const folderMap = new Map<string, FileInfo[]>();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = (file as any).webkitRelativePath || file.name;
    const pathParts = relativePath.split('/');
    
    // Get folder path (everything except the filename)
    let folderPath: string;
    if (pathParts.length > 1) {
      if (includeSubfolders) {
        folderPath = pathParts.slice(0, -1).join('/');
      } else {
        // Only include files from root folder
        if (pathParts.length > 2) continue;
        folderPath = pathParts[0];
      }
    } else {
      folderPath = 'Raíz';
    }

    const fileInfo: FileInfo = {
      name: file.name,
      type: getFileType(file),
      size: file.size,
      lastModified: new Date(file.lastModified),
      path: relativePath,
      extension: getFileExtension(file.name),
      isHidden: file.name.startsWith('.'),
    };

    if (!folderMap.has(folderPath)) {
      folderMap.set(folderPath, []);
    }
    folderMap.get(folderPath)!.push(fileInfo);
  }

  const result: FolderData[] = [];
  folderMap.forEach((files, path) => {
    const pathParts = path.split('/');
    result.push({
      folderName: pathParts[pathParts.length - 1] || path,
      path,
      files: files.sort((a, b) => a.name.localeCompare(b.name)),
    });
  });

  // Sort folders by path depth and name
  return result.sort((a, b) => {
    const depthA = a.path.split('/').length;
    const depthB = b.path.split('/').length;
    if (depthA !== depthB) return depthA - depthB;
    return a.path.localeCompare(b.path);
  });
}
