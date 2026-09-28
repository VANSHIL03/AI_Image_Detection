import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  DownloadCloud, 
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { getAnalysisHistory, deleteHistoryItem, clearAllHistory } from '../api/client';
import { ReportModal } from '../components/ReportModal';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalysisHistory({
        media_type: mediaFilter || undefined,
        search: search || undefined
      });
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [mediaFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis record?")) return;
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Warning: This will permanently delete ALL audit history records. Proceed?")) return;
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      alert("Failed to clear history: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 px-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-400 uppercase tracking-wider">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Audit Trail & SQLite Log Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Media Forensic Inspection History
          </h1>
          <p className="text-xs text-gray-400">
            Search, filter, inspect, and export persistent records of past image and video detection runs.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by filename or verdict..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400 font-medium flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="">All Media Types</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* History Table */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-400 font-mono space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-400" />
            <p>Loading audit database records...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900/80 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">AI Likelihood</th>
                  <th className="py-3 px-4">Certainty</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300">
                        {item.media_type === 'image' ? <ImageIcon className="w-3 h-3 text-brand-400" /> : <Video className="w-3 h-3 text-indigo-400" />}
                        <span className="capitalize">{item.media_type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium max-w-[180px] truncate">{item.filename}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.prediction.includes('AI') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        item.prediction.includes('Human') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-rose-400 font-bold">{(item.ai_probability * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-brand-400">{(item.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-gray-400">{item.processing_time_ms}ms</td>
                    <td className="py-3.5 px-4 text-gray-500 text-[10px] font-sans">
                      {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAnalysis(item)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-brand-500/20 hover:text-brand-300 text-gray-400 transition-colors"
                        title="View Report"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-500/20 hover:text-rose-400 text-gray-400 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-500 font-mono space-y-1">
            <p>No audit history matching the current filter.</p>
            <p className="text-[11px] text-gray-600">Analyze an image or video to create audit trail records.</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {selectedAnalysis && (
        <ReportModal
          isOpen={!!selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
          analysisData={selectedAnalysis}
        />
      )}

    </div>
  );
};
