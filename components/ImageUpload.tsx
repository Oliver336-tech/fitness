import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<Props> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto h-96 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8
        ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 bg-dark-lighter'}
        ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-primary/50 cursor-pointer'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        multiple={false} 
        accept="image/*"
        onChange={handleChange}
      />

      <div className="text-center z-10 pointer-events-none">
        {isLoading ? (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <p className="text-xl font-medium text-white mb-2">Analyzing Physique...</p>
            <p className="text-gray-400">Our AI is scanning for muscle balance and posture.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
               <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Upload your Photo</h3>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto">
              Drag & drop or click to upload. 
              <br/>Full body shots work best.
            </p>
            <div className="inline-flex items-center text-sm text-gray-500 bg-black/20 px-4 py-2 rounded-full">
              <ImageIcon className="w-4 h-4 mr-2" />
              Supports JPG, PNG, WEBP
            </div>
          </>
        )}
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
};

export default ImageUpload;
