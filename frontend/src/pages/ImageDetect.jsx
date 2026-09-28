import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Flame, 
  Image as ImageIcon 
} from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { ResultCard } from '../components/ResultCard';
import { GradCamViewer } from '../components/GradCamViewer';
import { ReportModal } from '../components/ReportModal';
import { detectImage } from '../api/client';

export const ImageDetect = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await detectImage(selectedFile);
      setResult(data);
    } catch (err) {
      console.error("Detection error:", err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        "An unexpected error occurred while analyzing the image."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
      
      {/* Page Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-400 uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Spatial & Spectral Image Forensics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Image Authenticity & Deep Learning Detection
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Upload any photograph or digital artwork to analyze neural generation signatures, 2D-FFT frequency spectra, and ELA artifacts.
        </p>
      </div>

      {/* Upload & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className={`${result ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <FileUpload
            type="image"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
            isLoading={isLoading}
          />

          {selectedFile && !result && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Neural Gradients & Forensics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Detection Pipeline</span>
                </>
              )}
            </button>
          )}

          {/* Loading Indicator Steps */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-brand-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Multi-Signal Analysis...</span>
              </div>
              <ul className="space-y-1 text-gray-400 text-[11px] pl-4 list-disc">
                <li>Extracting Error Level Analysis (ELA) compression matrix</li>
                <li>Computing 2D-FFT Fourier magnitude spectrum</li>
                <li>EfficientNet-B0 CNN feature map forward pass</li>
                <li>Backpropagating gradients for Grad-CAM attention heatmap</li>
                <li>Applying temperature calibration & uncertainty filter</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Column */}
        {result && (
          <div className="lg:col-span-7 space-y-6">
            <ResultCard
              result={result}
              onReset={handleClear}
              onOpenReport={() => setIsReportOpen(true)}
            />
          </div>
        )}

      </div>

      {/* Grad-CAM & Explainability Section */}
      {result && (
        <div className="pt-4">
          <GradCamViewer
            originalImgUrl={imagePreviewUrl}
            gradcamOverlayUrl={result.gradcam_overlay_base64}
            elaOverlayUrl={result.ela_overlay_base64}
            fftSpectrumUrl={result.fft_spectrum_base64}
          />
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        analysisData={result}
      />

    </div>
  );
};
