import React, { useState, useRef } from 'react';
import { api } from '../services/api';

interface CVUploaderProps {
  onUploadSuccess: (data: any) => void;
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
      const response = await api.uploadFile('/onboarding/parse-cv', file);
      onUploadSuccess(response);
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
      className={`relative overflow-hidden rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
        isDragging 
          ? 'border-accent-cyan bg-bg-elevated' 
          : 'border-bg-tertiary hover:border-text-secondary'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx"
        className="hidden"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-4 animate-pulse">
          <div className="text-4xl mb-2">⚡</div>
          <p className="text-lg font-medium gradient-text">Analizando tu CV con IA...</p>
          <p className="text-sm text-text-muted">Esto tomará unos segundos</p>
          <div className="w-full h-1 bg-bg-tertiary mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-accent-gradient animate-shimmer w-full"></div>
          </div>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center cursor-pointer text-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2">📄</div>
          <h3 className="text-lg font-bold mb-1">
            <span className="gradient-text">Completar con IA</span>
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            Arrastra tu CV aquí o haz click para subir (PDF o DOCX)
          </p>
          <button className="btn btn-secondary text-xs py-1 px-3">
            Seleccionar archivo
          </button>
        </div>
      )}
    </div>
  );
};
