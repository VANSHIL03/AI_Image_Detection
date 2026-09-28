import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  Layers, 
  Code2, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Activity,
  FileText
} from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 px-4 text-gray-300">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-gray-800 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise Media Forensics • Architecture & Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          AI-Generated Image & Video Detection Platform
        </h1>
        <p className="text-sm text-gray-400">
          A Comprehensive Multi-Modal Forensic Framework using Deep Learning, Machine Learning, and Frequency-Domain Signal Analysis.
        </p>
      </div>

      {/* Abstract Section */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <span>Project Abstract</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          The rapid proliferation of generative artificial intelligence—specifically Diffusion Models (e.g., Stable Diffusion, Midjourney, DALL-E 3), Generative Adversarial Networks (GANs), and transformer-based video synthesis engines (e.g., Sora, Runway Gen-2)—has severely undermined the veracity of digital media. While these models create hyper-realistic imagery and manipulated video sequences (deepfakes), they leave subtle microscopic signatures in high-frequency Fourier domains, localized JPEG compression grids, and inter-frame temporal phase transitions.
        </p>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          This project introduces <strong>AuraLens AI</strong>, an end-to-end full-stack digital forensics and deep learning platform. Our system employs a hybrid transfer learning backbone (EfficientNet-B0) fused with spatial Error Level Analysis (ELA), 2D Fast Fourier Transform (2D-FFT) spectral magnitude analysis, and second-order temporal consistency pooling. Furthermore, Gradient-weighted Class Activation Mapping (Grad-CAM) provides transparent visual explainability for every prediction.
        </p>
      </div>

      {/* Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-3">
          <h3 className="text-base font-bold text-rose-400 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Problem Statement</span>
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Existing detection tools often rely solely on spatial pixel classifiers that are vulnerable to post-processing compression or produce unexplainable black-box decisions. Moreover, video deepfake detection systems suffer from high false-alarm rates when isolated frames are noisy. There is a critical need for an explainable, multi-signal, and temporally consistent forensic framework.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-3">
          <h3 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Core Objectives</span>
          </h3>
          <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
            <li>Dual-mode image and video synthetic media classification.</li>
            <li>Multi-modal fusion: Deep CNN + ELA + 2D-FFT + Texture features.</li>
            <li>Visual explainability with Grad-CAM neural attention overlays.</li>
            <li>Temporal consistency and Top-K anomaly peak detection for videos.</li>
            <li>Probability calibration with dedicated uncertainty thresholding.</li>
          </ul>
        </div>

      </div>

      {/* Key Algorithms Section */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>Core Algorithms & Mathematical Formulations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 font-mono">1. Grad-CAM Neuron Gradient Weighting</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Weights α_k for feature map A^k for target class c:
            </p>
            <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-indigo-300">
              α_k^c = (1/Z) * Σ_i Σ_j (∂Y^c / ∂A_i,j^k)
            </div>
            <p className="text-[11px] text-gray-500">
              Captures positive feature activations using ReLU across final convolutional channels.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-purple-400 font-mono">2. 2D Fast Fourier Transform (FFT)</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Computes discrete 2D spatial frequency distribution:
            </p>
            <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-purple-300">
              F(u,v) = Σ_x Σ_y f(x,y) * e^[-j 2π (ux/M + vy/N)]
            </div>
            <p className="text-[11px] text-gray-500">
              Detects high-frequency grid artifacts left by transposed convolutions and diffusion upsamplers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 font-mono">3. Error Level Analysis (ELA)</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Measures absolute difference between original image and resaved JPEG:
            </p>
            <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-emerald-300">
              D(x,y) = |I(x,y) - JPEG_Q90(I)(x,y)|
            </div>
            <p className="text-[11px] text-gray-500">
              Highlights compression inconsistencies across 8x8 DCT macroblocks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-rose-400 font-mono">4. Video Temporal Jitter Pooling</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Quantifies inter-frame synthetic fluctuation across sequential frames:
            </p>
            <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-rose-300">
              J = (1 / (N - 1)) * Σ_i |P_(i+1) - P_i|
            </div>
            <p className="text-[11px] text-gray-500">
              Aggregated with Top-K peak scoring to prevent single-frame false positives.
            </p>
          </div>


        </div>
      </div>

      {/* Hardware & Technology Stack */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-brand-400" />
          <span>System & Hardware Architecture</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-500 text-[10px]">Deep Learning</span>
            <p className="text-white font-bold">PyTorch 2.15 + Torchvision</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-500 text-[10px]">Hardware Engine</span>
            <p className="text-emerald-400 font-bold">NVIDIA RTX 4050 GPU (CUDA)</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-500 text-[10px]">Backend Framework</span>
            <p className="text-indigo-400 font-bold">FastAPI + Async Uvicorn</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-500 text-[10px]">Frontend UI</span>
            <p className="text-purple-400 font-bold">React 18 + Vite + Tailwind</p>
          </div>
        </div>
      </div>

    </div>
  );
};
