import * as XLSX from 'xlsx';
import type { FolderData, ExtraField } from '@/types/fileTypes';
import { formatFileSize, formatDate } from './fileUtils';
import { extraFieldLabels } from '@/types/fileTypes';

export function generateExcel(
  folders: FolderData[],
  extraFields: ExtraField[],
  rootFolderName: string
): void {
  const workbook = XLSX.utils.book_new();

  folders.forEach((folder, index) => {
    // Build headers
    const headers = ['Nombre', 'Tipo', 'Tamaño', 'Fecha de modificación'];
    extraFields.forEach(field => {
      headers.push(extraFieldLabels[field]);
    });

    // Build data rows
    const data = folder.files.map(file => {
      const row: (string | boolean)[] = [
        file.name,
        file.type,
        formatFileSize(file.size),
        formatDate(file.lastModified),
      ];

      extraFields.forEach(field => {
        switch (field) {
          case 'createdDate':
            row.push(file.createdDate ? formatDate(file.createdDate) : 'N/A');
            break;
          case 'isHidden':
            row.push(file.isHidden ? 'Sí' : 'No');
            break;
          case 'extension':
            row.push(file.extension || 'Sin extensión');
            break;
          case 'path':
            row.push(file.path);
            break;
        }
      });

      return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Set column widths
    const colWidths = [
      { wch: 40 }, // Nombre
      { wch: 15 }, // Tipo
      { wch: 12 }, // Tamaño
      { wch: 20 }, // Fecha modificación
    ];
    extraFields.forEach(() => {
      colWidths.push({ wch: 20 });
    });
    worksheet['!cols'] = colWidths;

    // Sheet name (max 31 chars, no special chars)
    let sheetName = folder.folderName
      .replace(/[\\\/\?\*\[\]]/g, '_')
      .substring(0, 28);
    
    // Ensure unique sheet names
    if (index > 0) {
      sheetName = `${sheetName}_${index}`.substring(0, 31);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${rootFolderName}_${timestamp}.xlsx`;

  // Download
  XLSX.writeFile(workbook, filename);
}
