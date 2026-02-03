import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FolderSelector } from '@/components/FolderSelector';
import { OptionsPanel } from '@/components/OptionsPanel';
import { PreviewTable } from '@/components/PreviewTable';
import { ExportButton } from '@/components/ExportButton';
import { processFiles } from '@/utils/fileUtils';
import { generateExcel } from '@/utils/excelUtils';
import type { FolderData, ExtraField } from '@/types/fileTypes';
import { toast } from 'sonner';

const Index = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>(null);
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilesSelected = useCallback(async (selectedFiles: FileList) => {
    setIsProcessing(true);
    setFiles(selectedFiles);

    try {
      // Get folder name from first file's path
      const firstFile = selectedFiles[0];
      const relativePath = (firstFile as any).webkitRelativePath || firstFile.name;
      const folderName = relativePath.split('/')[0];
      setSelectedFolderName(folderName);

      // Process files
      const processedFolders = await processFiles(selectedFiles, includeSubfolders);
      setFolders(processedFolders);
      
      toast.success(`Carpeta procesada correctamente`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error al procesar los archivos');
    } finally {
      setIsProcessing(false);
    }
  }, [includeSubfolders]);

  // Re-process when includeSubfolders changes
  const handleIncludeSubfoldersChange = useCallback(async (value: boolean) => {
    setIncludeSubfolders(value);
    if (files) {
      setIsProcessing(true);
      try {
        const processedFolders = await processFiles(files, value);
        setFolders(processedFolders);
      } catch (error) {
        console.error('Error reprocessing files:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [files]);

  const handleExport = useCallback(() => {
    if (folders.length === 0 || !selectedFolderName) return;

    setIsExporting(true);
    try {
      generateExcel(folders, extraFields, selectedFolderName);
      toast.success('¡Archivo Excel generado correctamente!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Error al generar el archivo Excel');
    } finally {
      setIsExporting(false);
    }
  }, [folders, extraFields, selectedFolderName]);

  const totalFilesCount = folders.reduce((sum, f) => sum + f.files.length, 0);
  const totalFoldersCount = folders.length;
  const totalSize = folders.reduce((sum, folder) => 
    sum + folder.files.reduce((fileSum, file) => fileSum + file.size, 0), 0
  );

  const stats = folders.length > 0 ? {
    totalFiles: totalFilesCount,
    totalFolders: totalFoldersCount,
    totalSize: totalSize
  } : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        {/* Folder Selector */}
        <FolderSelector
          onFilesSelected={handleFilesSelected}
          selectedFolderName={selectedFolderName}
          filesCount={totalFilesCount}
          isProcessing={isProcessing}
          stats={stats}
        />

        {/* Options Panel */}
        <OptionsPanel
          includeSubfolders={includeSubfolders}
          onIncludeSubfoldersChange={handleIncludeSubfoldersChange}
          extraFields={extraFields}
          onExtraFieldsChange={setExtraFields}
        />

        {/* Preview Table */}
        {folders.length > 0 && (
          <PreviewTable folders={folders} extraFields={extraFields} />
        )}

        {/* Export Button */}
        <div className="flex justify-center pt-4">
          <ExportButton
            onClick={handleExport}
            disabled={folders.length === 0}
            isExporting={isExporting}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;