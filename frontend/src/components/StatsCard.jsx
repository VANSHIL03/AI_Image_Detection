import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = "brand", trend }) => {
  const colorMap = {
    brand: 'from-brand-500/10 to-indigo-500/5 text-brand-400 border-brand-500/30',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/30',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/10 to-yellow-500/5 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/10 to-violet-500/5 text-purple-400 border-purple-500/30',
  };

  return (
    <div className={`glass-panel rounded-2xl p-5 border bg-gradient-to-br ${colorMap[color] || colorMap.brand} shadow-lg transition-transform hover:-translate-y-0.5 duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-gray-400 mt-1 flex items-center space-x-1">
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </div>
  );
};
