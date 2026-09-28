import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { Film, AlertTriangle, CheckCircle2, Clock, Eye, Layers } from 'lucide-react';

export const VideoTimeline = ({ 
  timeline = [], 
  topSuspiciousFrames = [], 
  consistencyScore = 1.0 
}) => {
  const [selectedFrame, setSelectedFrame] = useState(null);

  const chartData = timeline.map((item) => ({
    time: `${item.timestamp_seconds}s`,
    timestamp: item.timestamp_seconds,
    prob: Math.round(item.ai_probability * 100),
    isSuspicious: item.is_suspicious,
    frameIndex: item.frame_index,
    thumbnail: item.frame_thumbnail_base64
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-gray-700 text-xs shadow-2xl space-y-1">
          <p className="font-semibold text-white">Timestamp: {data.time}</p>
          <p className="font-mono text-gray-400">Frame #{data.frameIndex}</p>
          <p className={`font-mono font-bold ${data.prob >= 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
            AI Probability: {data.prob}%
          </p>
          {data.thumbnail && (
            <div className="mt-2 rounded overflow-hidden border border-gray-700 w-28">
              <img src={data.thumbnail} alt="Frame" className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <span>Frame-by-Frame Temporal Probability Timeline</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time deepfake & synthetic likelihood track across sampled video frames.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
          <span className="text-gray-400">Temporal Stability:</span>
          <span className={`font-mono font-bold ${consistencyScore >= 0.7 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {(consistencyScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aiProbGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              tick={{ fontSize: 11, fill: '#9ca3af' }} 
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#6b7280" 
              tick={{ fontSize: 11, fill: '#9ca3af' }} 
              unit="%" 
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={65} 
              stroke="#f43f5e" 
              strokeDasharray="4 4" 
              label={{ value: 'Anomaly Threshold (65%)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} 
            />
            <Area 
              type="monotone" 
              dataKey="prob" 
              stroke="#6366f1" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#aiProbGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Suspicious Frames Gallery */}
      {topSuspiciousFrames && topSuspiciousFrames.length > 0 && (
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Extracted Keyframes & Grad-CAM Heatmaps</span>
            </h4>
            <span className="text-[11px] text-gray-500 font-mono">
              {topSuspiciousFrames.length} Keyframe{topSuspiciousFrames.length > 1 ? 's' : ''} Analyzed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topSuspiciousFrames.map((frame, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedFrame(frame)}
                className="group relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-brand-500/60 transition-all cursor-pointer shadow-lg"
              >
                <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={frame.gradcam_thumbnail_base64 || frame.frame_thumbnail_base64}
                    alt={`Suspicious Frame ${frame.frame_index}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-2.5 space-y-1 bg-gray-900/90">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{frame.timestamp_seconds}s</span>
                    </span>
                    <span className={`font-mono font-bold ${frame.ai_probability >= 0.65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {(frame.ai_probability * 100).toFixed(0)}% AI
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono truncate">Frame #{frame.frame_index}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frame Detail Modal */}
      {selectedFrame && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFrame(null)}
        >
          <div 
            className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-gray-700 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Keyframe Anomaly Inspection</h4>
              <button 
                onClick={() => setSelectedFrame(null)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-800"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black border border-gray-800">
              <img
                src={selectedFrame.gradcam_thumbnail_base64 || selectedFrame.frame_thumbnail_base64}
                alt="Frame Detail"
                className="w-full h-auto max-h-80 object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 font-mono">
                <span className="text-gray-400 text-[10px]">Timestamp</span>
                <p className="font-bold text-white">{selectedFrame.timestamp_seconds} seconds</p>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 font-mono">
                <span className="text-gray-400 text-[10px]">Frame Probability</span>
                <p className={`font-bold ${selectedFrame.ai_probability >= 0.65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(selectedFrame.ai_probability * 100).toFixed(1)}% AI
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
