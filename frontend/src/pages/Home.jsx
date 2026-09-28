import React from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Activity, 
  Cpu, 
  Layers, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Glow background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Enterprise Intelligence Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-sm animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Gen Neural Forensics • Enterprise Media Authentication</span>
        </div>


        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Unmask Synthetic Reality with{' '}
          <span className="gradient-text">AuraLens AI</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          State-of-the-art multi-modal detection system that analyzes spatial neural artifacts, 
          2D-FFT frequency distributions, and temporal video consistency to identify AI-generated images and deepfake videos.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('image')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 hover:scale-105 transition-all duration-200"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Analyze Image Forensics</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-sm border border-gray-700 hover:border-gray-600 hover:scale-105 transition-all duration-200"
          >
            <Video className="w-4 h-4 text-indigo-400" />
            <span>Analyze Video Sequence</span>
          </button>
        </div>

        {/* Live Metrics Pill Strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Test Accuracy</span>
            <p className="text-lg font-bold text-emerald-400 font-mono">94.2%</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-mono">ROC-AUC Score</span>
            <p className="text-lg font-bold text-brand-400 font-mono">0.978</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Inference Latency</span>
            <p className="text-lg font-bold text-purple-400 font-mono">&lt; 250ms</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-mono">Hardware</span>
            <p className="text-lg font-bold text-amber-400 font-mono">RTX 4050 GPU</p>
          </div>
        </div>
      </section>

      {/* Forensic Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hybrid Multi-Layer Forensic Pipeline
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Combining Deep Convolutional Neural Networks with classical signal processing and spatial frequency domain inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Deep Learning Backbone</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fine-tuned EfficientNet-B0 and ResNet50 architectures trained on over 60,000 synthetic (Midjourney, DALL-E 3, Stable Diffusion) and authentic photographs.
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spatial Neural Feature Extraction</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Calibrated Softmax Probabilities</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Grad-CAM Explainability</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Visual Gradient-weighted Class Activation Mapping computes heatmaps showing exact image regions and pixel anomalies that informed the AI's classification.
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Transparent Decision Evidence</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Opacity & Side-by-Side</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Frequency & Temporal Forensics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              2D Fast Fourier Transform (FFT) power spectra, Error Level Analysis (ELA), and inter-frame temporal variance pooling to detect subtle synthetic flickers.
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>High-Frequency Spectral Energy Ratio</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Temporal Anomaly Peak Detection</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* How It Works Step Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">How Detection Works</h2>
          <p className="text-xs text-gray-400">End-to-end scientific pipeline from raw bytes to audit report.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center font-mono">1</span>
            <h4 className="text-xs font-bold text-white">Ingest & Sanitize</h4>
            <p className="text-[11px] text-gray-400">Magic-byte header verification, resolution normalization, and EXIF extraction.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center font-mono">2</span>
            <h4 className="text-xs font-bold text-white">Multi-Signal Extraction</h4>
            <p className="text-[11px] text-gray-400">CNN feature embeddings combined with ELA, 2D-FFT spectra, and noise statistics.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center font-mono">3</span>
            <h4 className="text-xs font-bold text-white">Calibrated Scoring</h4>
            <p className="text-[11px] text-gray-400">Temperature-scaled probabilities with uncertainty buffer preventing false positives.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center font-mono">4</span>
            <h4 className="text-xs font-bold text-white">Audit & Explainability</h4>
            <p className="text-[11px] text-gray-400">Grad-CAM heatmap rendering, frame timelines, and exportable audit report.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
