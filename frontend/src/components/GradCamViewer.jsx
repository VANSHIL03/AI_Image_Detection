import React, { useState } from 'react';
import { Eye, Flame, Activity, Sparkles, Sliders, Columns, Maximize2 } from 'lucide-react';

export const GradCamViewer = ({ 
  originalImgUrl, 
  gradcamOverlayUrl, 
  elaOverlayUrl, 
  fftSpectrumUrl 
}) => {
  const [activeTab, setActiveTab] = useState('gradcam'); // 'gradcam' | 'ela' | 'fft' | 'side-by-side'
  const [opacity, setOpacity] = useState(60);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-5">
      
      {/* Header & Mode Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Explainable AI & Forensic Artifact Visualizer</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Inspect model attention gradients and pixel-level forensic frequency spectrums.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-gray-900 border border-gray-800">
          <button
            onClick={() => setActiveTab('gradcam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              activeTab === 'gradcam' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Grad-CAM</span>
          </button>

          <button
            onClick={() => setActiveTab('ela')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              activeTab === 'ela' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ELA Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('fft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              activeTab === 'fft' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2D-FFT Power</span>
          </button>

          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              activeTab === 'side-by-side' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="relative rounded-xl overflow-hidden bg-black/80 border border-gray-800 flex items-center justify-center min-h-[350px]">
        
        {activeTab === 'gradcam' && (
          <div className="relative flex items-center justify-center p-2">
            <img
              src={gradcamOverlayUrl || originalImgUrl}
              alt="Grad-CAM Overlay"
              className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        )}

        {activeTab === 'ela' && (
          <div className="relative flex items-center justify-center p-2">
            <img
              src={elaOverlayUrl || originalImgUrl}
              alt="Error Level Analysis"
              className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        )}

        {activeTab === 'fft' && (
          <div className="relative flex items-center justify-center p-2">
            <img
              src={fftSpectrumUrl || originalImgUrl}
              alt="2D FFT Spectrum"
              className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        )}

        {activeTab === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
            <div className="space-y-1 text-center">
              <span className="text-[11px] font-mono text-gray-400">Original Source Image</span>
              <div className="rounded-lg overflow-hidden bg-black/60 border border-gray-800 flex items-center justify-center h-64">
                <img src={originalImgUrl} alt="Original" className="max-h-full w-auto object-contain" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <span className="text-[11px] font-mono text-indigo-400">Grad-CAM Neural Attention</span>
              <div className="rounded-lg overflow-hidden bg-black/60 border border-gray-800 flex items-center justify-center h-64">
                <img src={gradcamOverlayUrl} alt="Grad-CAM" className="max-h-full w-auto object-contain" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Explanatory Caption Footer */}
      <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 text-xs text-gray-300">
        {activeTab === 'gradcam' && (
          <p>
            <strong className="text-amber-400">Grad-CAM Attention Map:</strong> Warm colored regions (red/yellow) indicate spatial regions that contributed most significantly to the model's classification score. Deep learning backbones focus on high-frequency boundary inconsistencies, facial feature synthesis artifacts, and unnatural texture blend zones.
          </p>
        )}
        {activeTab === 'ela' && (
          <p>
            <strong className="text-purple-400">Error Level Analysis (ELA):</strong> Measures JPEG compression differential across 8x8 DCT grid blocks. Uniformly dark/consistent areas suggest uniform compression, while bright patches highlight localized digital editing or AI generative re-rendering.
          </p>
        )}
        {activeTab === 'fft' && (
          <p>
            <strong className="text-emerald-400">2D-FFT Power Spectrum:</strong> Visualizes frequency energy distribution in polar coordinates. Diffusion models and GANs often display periodic cross-shaped grid spikes or anomalous energy drop-offs at high frequencies compared to organic camera sensor noise.
          </p>
        )}
        {activeTab === 'side-by-side' && (
          <p>
            <strong className="text-brand-400">Comparative Overview:</strong> Direct visual comparison between the original input frame and neural attention layer activations.
          </p>
        )}
      </div>

    </div>
  );
};
