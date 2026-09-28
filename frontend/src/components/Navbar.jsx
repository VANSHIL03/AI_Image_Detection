import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video, 
  LayoutDashboard, 
  History, 
  BarChart3, 
  Info, 
  Sun, 
  Moon, 
  Cpu,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getHealthStatus } from '../api/client';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { isDark, toggleTheme } = useTheme();
  const [health, setHealth] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getHealthStatus()
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: 'offline', gpu_available: false }));
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: ShieldCheck },
    { id: 'image', label: 'Image Forensics', icon: ImageIcon },
    { id: 'video', label: 'Video Analyzer', icon: Video },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'evaluation', label: 'Model Metrics', icon: BarChart3 },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  AuraLens
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI v2.0
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Deep Media Forensics</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Hardware status & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* GPU Badge */}
            <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-[11px] font-mono">
              <div className={`w-2 h-2 rounded-full animate-ping ${health?.gpu_available ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <Cpu className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-300">
                {health?.gpu_available ? 'RTX 4050 (CUDA)' : 'CPU Mode'}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 text-gray-400"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-gray-900/95 border-b border-gray-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
