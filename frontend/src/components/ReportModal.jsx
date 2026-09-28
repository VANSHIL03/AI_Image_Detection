import React from 'react';
import { DownloadCloud, Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import { exportReport } from '../api/client';

export const ReportModal = ({ isOpen, onClose, analysisData }) => {
  if (!isOpen || !analysisData) return null;

  const handleDownloadJSON = async () => {
    try {
      const report = await exportReport(analysisData);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `AuraLens_Audit_Report_${analysisData.analysis_id || 'result'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert("Failed to export report: " + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-gray-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Forensic Detection Audit Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content Preview */}
        <div className="space-y-4 text-xs font-mono bg-gray-950 p-4 rounded-xl border border-gray-800 text-gray-300">
          <div className="border-b border-gray-800 pb-2 flex justify-between">
            <span className="text-gray-500">Document ID:</span>
            <span className="text-brand-400">{analysisData.analysis_id || 'N/A'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-gray-800 pb-2">
            <div>
              <span className="text-gray-500">Target File:</span>
              <p className="text-white font-bold">{analysisData.filename}</p>
            </div>
            <div>
              <span className="text-gray-500">Evaluation Engine:</span>
              <p className="text-white font-bold">{analysisData.model_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b border-gray-800 pb-2">
            <div>
              <span className="text-gray-500">Verdict:</span>
              <p className="text-rose-400 font-bold">{analysisData.prediction}</p>
            </div>
            <div>
              <span className="text-gray-500">AI Likelihood:</span>
              <p className="text-white font-bold">{(analysisData.ai_probability * 100).toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-gray-500">Confidence:</span>
              <p className="text-emerald-400 font-bold">{(analysisData.confidence_score * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div>
            <span className="text-gray-500">Forensic Summary:</span>
            <p className="text-gray-200 mt-1 font-sans text-xs leading-relaxed">
              {analysisData.verdict_summary}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors shadow-md shadow-brand-600/30"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Download JSON Audit</span>
          </button>
        </div>

      </div>
    </div>
  );
};
