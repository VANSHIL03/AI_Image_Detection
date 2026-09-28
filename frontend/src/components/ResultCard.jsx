import React from 'react';
import { 
  Bot, 
  UserCheck, 
  HelpCircle, 
  Gauge, 
  Timer, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  DownloadCloud, 
  RotateCcw,
  Sparkles,
  Activity
} from 'lucide-react';


export const ResultCard = ({ result, onReset, onOpenReport }) => {
  if (!result) return null;

  const isAI = result.prediction.toLowerCase().includes('ai-generated') || result.prediction.toLowerCase().includes('manipulated');
  const isHuman = result.prediction.toLowerCase().includes('human') || result.prediction.toLowerCase().includes('recorded');
  const isUncertain = result.prediction.toLowerCase().includes('uncertain') || result.prediction.toLowerCase().includes('inconclusive');

  const getStatusColor = () => {
    if (isAI) return 'from-rose-500/20 via-rose-500/10 to-transparent border-rose-500/50 text-rose-400';
    if (isHuman) return 'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/50 text-emerald-400';
    return 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/50 text-amber-400';
  };

  const getIcon = () => {
    if (isAI) return <Bot className="w-7 h-7 text-rose-400" />;
    if (isHuman) return <UserCheck className="w-7 h-7 text-emerald-400" />;
    return <HelpCircle className="w-7 h-7 text-amber-400" />;
  };

  const aiPercent = Math.round(result.ai_probability * 100);
  const humanPercent = Math.round(result.human_probability * 100);
  const confPercent = Math.round(result.confidence_score * 100);

  return (
    <div className="space-y-6">
      
      {/* Primary Verdict Hero Card */}
      <div className={`glass-panel rounded-2xl p-6 sm:p-8 border bg-gradient-to-b ${getStatusColor()} shadow-2xl relative overflow-hidden`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gray-900/90 border border-gray-700 shadow-inner">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Verdict Classification</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 font-mono">
                  ID: {result.analysis_id ? result.analysis_id.slice(0, 8) : 'N/A'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                {result.prediction}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-all shadow-sm"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-brand-400" />
              <span>Export Audit</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Probability Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-gray-800">
          
          {/* AI Probability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Synthetic / AI Probability</span>
              <span className="text-rose-400 font-mono font-bold text-sm">{aiPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${aiPercent}%` }}
              />
            </div>
          </div>

          {/* Authenticity Probability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Human Authenticity</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">{humanPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${humanPercent}%` }}
              />
            </div>
          </div>

          {/* Calibrated Certainty */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Calibrated Confidence Score</span>
              <span className="text-brand-400 font-mono font-bold text-sm">{confPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${confPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Explainability Summary */}
        <div className="pt-6">
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            <strong className="text-white font-semibold">Forensic Assessment: </strong> 
            {result.verdict_summary}
          </p>
        </div>

        {/* Meta details footer */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400 font-mono">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            <span>Model: {result.model_name} (v{result.model_version})</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>Processing Time: {result.processing_time_ms} ms</span>
          </div>
        </div>

      </div>

      {/* Forensic Multi-Signal Breakdown (if image features available) */}
      {result.forensic_features && (
        <div className="glass-panel rounded-2xl p-6 border border-gray-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Digital Forensic & Spectral Multi-Signal Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">ELA Compression Error</p>
              <p className="text-lg font-bold font-mono text-indigo-400">
                {result.forensic_features.ela_mean_error}
              </p>
              <p className="text-[10px] text-gray-500">JPEG error discrepancy</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">2D-FFT Spectral Energy</p>
              <p className={`text-lg font-bold font-mono ${result.forensic_features.fft_high_freq_ratio >= 0.40 ? 'text-rose-400' : 'text-purple-400'}`}>
                {(result.forensic_features.fft_high_freq_ratio * 100).toFixed(1)}%
              </p>
              <p className="text-[10px] text-gray-500">{result.forensic_features.fft_high_freq_ratio >= 0.40 ? 'High AI spectral ratio' : 'Natural optical falloff'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Flat Patch Sensor Noise</p>
              <p className={`text-lg font-bold font-mono ${result.forensic_features.noise_variance > 1.8 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.forensic_features.noise_variance}
              </p>
              <p className="text-[10px] text-gray-500">{result.forensic_features.noise_variance > 1.8 ? 'Physical CMOS noise' : 'Pure mathematical render'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
              <p className="text-[11px] text-gray-400 font-medium">Color Saturation Gamut</p>
              <p className="text-lg font-bold font-mono text-amber-400">
                {result.forensic_features.color_saturation ? (result.forensic_features.color_saturation * 100).toFixed(1) + '%' : ((1 - result.forensic_features.glcm_homogeneity) * 100).toFixed(1) + '%'}
              </p>
              <p className="text-[10px] text-gray-500">HSV chroma vibrancy</p>
            </div>


          </div>
        </div>
      )}

      {/* Limitations Alert */}
      {result.limitations && result.limitations.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-gray-400 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Detection Limitations & Academic Boundary Notes</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-400 pl-1">
            {result.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
