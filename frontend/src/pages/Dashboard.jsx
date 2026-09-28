import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  Bot, 
  UserCheck, 
  HelpCircle, 
  Timer, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { getDashboardStats } from '../api/client';

export const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-mono">Loading telemetry analytics...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'AI-Generated', value: stats.ai_generated_count || 0, color: '#f43f5e' },
    { name: 'Likely Human', value: stats.human_generated_count || 0, color: '#10b981' },
    { name: 'Uncertain', value: stats.uncertain_count || 0, color: '#f59e0b' },
  ];

  const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 px-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-brand-400 uppercase tracking-wider">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Forensic Operations Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            System & Media Analytics Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Real-time breakdown of analyzed media files, classification distribution, and latency metrics.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold border border-gray-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Analyzed"
          value={stats.total_analyses}
          subtitle={`${stats.total_images} images • ${stats.total_videos} videos`}
          icon={TrendingUp}
          color="brand"
        />
        <StatsCard
          title="AI-Generated Media"
          value={stats.ai_generated_count}
          subtitle="Identified synthetic artifacts"
          icon={Bot}
          color="rose"
        />
        <StatsCard
          title="Authentic / Human"
          value={stats.human_generated_count}
          subtitle="Verified sensor noise patterns"
          icon={UserCheck}
          color="emerald"
        />
        <StatsCard
          title="Avg Inference Speed"
          value={`${stats.avg_processing_time_ms} ms`}
          subtitle="RTX 4050 GPU accelerated"
          icon={Timer}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Distribution Donut Chart */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Classification Distribution
          </h3>
          
          <div className="h-64 flex items-center justify-center">
            {totalPie > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-gray-500 font-mono">
                No detection records in database yet.<br />Run your first image or video detection!
              </div>
            )}
          </div>
        </div>

        {/* Weekly Volume Bar Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Weekly Inspection Volume
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.daily_volume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={30}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-gray-300">{value === 'images' ? 'Images' : 'Videos'}</span>}
                />
                <Bar dataKey="images" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="videos" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Detection Inferences
          </h3>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
          >
            View Full Audit History &rarr;
          </button>
        </div>

        {stats.recent_activity && stats.recent_activity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900/80 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Media</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">AI Prob</th>
                  <th className="py-3 px-4">Certainty</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {stats.recent_activity.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300">
                        {item.media_type === 'image' ? <ImageIcon className="w-3 h-3 text-brand-400" /> : <Video className="w-3 h-3 text-indigo-400" />}
                        <span className="capitalize">{item.media_type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium max-w-[150px] truncate">{item.filename}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.prediction.includes('AI') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        item.prediction.includes('Human') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-bold">{(item.ai_probability * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 text-brand-400">{(item.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 text-gray-400">{item.processing_time_ms}ms</td>
                    <td className="py-3 px-4 text-gray-500 text-[10px] font-sans">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-500 font-mono">
            No detection logs recorded yet.
          </div>
        )}
      </div>

    </div>
  );
};
