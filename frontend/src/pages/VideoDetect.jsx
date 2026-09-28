import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Sliders, 
  Clock, 
  Film, 
  Cpu 
} from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { ResultCard } from '../components/ResultCard';
import { VideoTimeline } from '../components/VideoTimeline';
import { ReportModal } from '../components/ReportModal';
import { detectVideo } from '../api/client';

export const VideoDetect = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sampleRateFps, setSampleRateFps] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await detectVideo(selectedFile, sampleRateFps);
      setResult(data);
    } catch (err) {
      console.error("Video detection error:", err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        "An error occurred while analyzing the video sequence."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
      
      {/* Page Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
          <Film className="w-3.5 h-3.5" />
          <span>Temporal Consistency & Deepfake Forensics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Video Sequence AI & Manipulation Detection
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Extracts and batches video frames to analyze inter-frame flicker, face manipulation signatures, and temporal continuity anomalies.
        </p>
      </div>

      {/* Upload and Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className={`${result ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <FileUpload
            type="video"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,video/x-matroska"
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
            isLoading={isLoading}
          />

          {/* Frame Sampling Slider */}
          {selectedFile && !result && (
            <div className="glass-panel p-4 rounded-xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-400" />
                  <span>Frame Sampling Rate</span>
                </span>
                <span className="font-mono font-bold text-brand-400">{sampleRateFps} FPS</span>
              </div>

              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.5"
                value={sampleRateFps}
                onChange={(e) => setSampleRateFps(parseFloat(e.target.value))}
                disabled={isLoading}
                className="w-full accent-brand-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0.5 FPS (Fast / Sparse)</span>
                <span>1.0 FPS (Recommended)</span>
                <span>3.0 FPS (Granular)</span>
              </div>
            </div>
          )}

          {selectedFile && !result && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting Frames & Processing Batches...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Video Temporal Pipeline</span>
                </>
              )}
            </button>
          )}

          {/* Loading status */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Video Frames on GPU...</span>
              </div>
              <ul className="space-y-1 text-gray-400 text-[11px] pl-4 list-disc">
                <li>Decoding video stream via OpenCV hardware backend</li>
                <li>Sampling keyframes at {sampleRateFps} FPS</li>
                <li>Batch GPU inference using EfficientNet-B0</li>
                <li>Calculating frame-to-frame temporal jitter variance</li>
                <li>Computing Top-K peak anomaly aggregate scores</li>
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

      {/* Video Timeline & Suspicious Frame Explorer */}
      {result && (
        <div className="pt-4">
          <VideoTimeline
            timeline={result.timeline}
            topSuspiciousFrames={result.top_suspicious_frames}
            consistencyScore={result.temporal_consistency_score}
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
