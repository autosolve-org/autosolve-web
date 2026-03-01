import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CVUploaderProps {
  onUploadSuccess: () => void;
}

export const CVUploader: React.FC<CVUploaderProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube un archivo PDF o DOCX');
      return;
    }

    setIsUploading(true);
    try {
      // Use the api service to upload
      await api.uploadFile('/onboarding/parse-cv', file);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Hubo un error al procesar tu CV. Por favor intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border-2 border-dashed p-4 transition-all duration-300 ${
        isDragging 
          ? 'border-accent-cyan bg-bg-elevated' 
          : 'border-bg-tertiary hover:border-text-secondary'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx"
        className="hidden"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-2 animate-pulse">
          <div className="text-3xl mb-1">⚡</div>
          <p className="text-sm font-medium gradient-text">Analizando con IA...</p>
          <p className="text-[10px] text-text-muted">Extrayendo datos...</p>
          <div className="w-full h-1 bg-bg-tertiary mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-accent-gradient animate-shimmer w-full"></div>
          </div>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center cursor-pointer text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-3xl mb-1">📄</div>
          <h3 className="text-sm font-bold mb-0.5">
            <span className="gradient-text">Completar con IA</span>
          </h3>
          <p className="text-[10px] text-text-secondary mb-2 leading-tight">
            Arrastra tu CV aquí o haz click para subir
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            className="text-[10px] h-7 px-2.5"
          >
            Subir Archivo
          </Button>
        </div>
      )}
    </div>
  );
};
