import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck, AlertCircle, X, Sparkles, Film, Image as ImageIcon } from 'lucide-react';

export const FileUpload = ({ 
  accept = "image/*", 
  type = "image", 
  onFileSelect, 
  selectedFile, 
  onClear,
  isLoading 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file) => {
    if (!file) return;

    // Type validation
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP, BMP)');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, MOV, AVI, WebM)');
      return;
    }

    // Size validation
    const maxBytes = type === 'image' ? 15 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`File is too large. Max allowed size: ${maxBytes / (1024 * 1024)}MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const loadSample = (isAi = true) => {
    // Generate an in-browser sample canvas image for instant testing
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (isAi) {
      // Artificial synthetic gradient & geometric artifacts
      const grad = ctx.createLinearGradient(0, 0, 400, 400);
      grad.addColorStop(0, '#ff007f');
      grad.addColorStop(0.5, '#7928ca');
      grad.addColorStop(1, '#00dfd8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);
      
      // Add synthetic circular mandelbrot-style circles
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let i = 10; i < 200; i += 20) {
        ctx.beginPath();
        ctx.arc(200, 200, i, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // Natural camera-like noise pattern
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(0, 0, 400, 400);
      const imgData = ctx.getImageData(0, 0, 400, 400);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 40;
        imgData.data[i] = Math.min(255, Math.max(0, 100 + noise));
        imgData.data[i + 1] = Math.min(255, Math.max(0, 120 + noise));
        imgData.data[i + 2] = Math.min(255, Math.max(0, 140 + noise));
        imgData.data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    canvas.toBlob((blob) => {
      const sampleFile = new File([blob], isAi ? 'synthetic_ai_sample.jpg' : 'natural_camera_sample.jpg', {
        type: 'image/jpeg'
      });
      processFile(sampleFile);
    }, 'image/jpeg');
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-gray-700/80 hover:border-brand-500/60 bg-gray-900/40 hover:bg-gray-900/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-200">
                Drag and drop your {type === 'image' ? 'image' : 'video'} here, or{' '}
                <span className="text-brand-400 underline underline-offset-4">browse</span>
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {type === 'image'
                  ? 'Supports JPG, PNG, WEBP, BMP (up to 15MB)'
                  : 'Supports MP4, MOV, AVI, WEBM (up to 100MB)'}
              </p>
            </div>

            {/* Instant Validation Samples */}
            {type === 'image' && (
              <div 
                className="pt-2 flex items-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] text-gray-500">Quick Test Samples:</span>
                <button
                  type="button"
                  onClick={() => loadSample(true)}
                  className="px-2.5 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Synthetic AI Sample</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadSample(false)}
                  className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Authentic Sample</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Preview container */
        <div className="glass-panel rounded-2xl p-4 relative overflow-hidden border border-gray-700/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-300 truncate">
              {type === 'image' ? <ImageIcon className="w-4 h-4 text-brand-400" /> : <Film className="w-4 h-4 text-indigo-400" />}
              <span className="truncate">{selectedFile.name}</span>
              <span className="text-gray-500 font-mono">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            {!isLoading && (
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-500/20 hover:text-rose-400 text-gray-400 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Media Player / Preview */}
          <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-80 border border-gray-800">
            {type === 'image' ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-80 w-auto object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="max-h-80 w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
