import React from 'react';
import { ShieldCheck, Cpu, Code2, Github } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-gray-800/80 bg-[#080B12] text-gray-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Project Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">AuraLens AI</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Enterprise-grade Deep Learning & Digital Forensics platform for multi-modal synthetic media verification and integrity assurance.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Enterprise Media Integrity Core</span>
            </div>

          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Detection Suite</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('image')} className="hover:text-brand-400 transition-colors">
                  Image Forensics & Grad-CAM
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('video')} className="hover:text-brand-400 transition-colors">
                  Video Temporal Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-brand-400 transition-colors">
                  Live Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('evaluation')} className="hover:text-brand-400 transition-colors">
                  Model Evaluation Metrics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Forensic Technology</h4>
            <div className="flex flex-wrap gap-1.5">
              {['PyTorch 2.15', 'EfficientNet-B0', 'Grad-CAM', 'Error Level Analysis (ELA)', '2D-FFT Spectrum', 'OpenCV', 'FastAPI', 'React Vite', 'CUDA RTX 4050'].map((tech) => (
                <span key={tech} className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Academic Note */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Research Disclaimer</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Detection probabilities represent statistical confidence estimates computed through multi-feature fusion. Heatmaps visualize neural feature activation rather than proof of manipulation.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500">
          <p>© 2026 AuraLens AI Technologies Inc. All rights reserved. Precision Digital Media Forensics.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">

            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>GPU Accelerated</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Code2 className="w-3 h-3 text-brand-400" />
              <span>Full-Stack Modular Architecture</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
