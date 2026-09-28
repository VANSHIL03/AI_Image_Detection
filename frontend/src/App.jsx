import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ImageDetect } from './pages/ImageDetect';
import { VideoDetect } from './pages/VideoDetect';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { About } from './pages/About';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'image':
        return <ImageDetect />;
      case 'video':
        return <VideoDetect />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'history':
        return <History />;
      case 'evaluation':
        return <ModelEvaluation />;
      case 'about':
        return <About />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100 font-sans transition-colors duration-300">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderActivePage()}
        </main>

        <footer className="py-6 text-center text-sm border-t border-gray-800/60 mt-auto">
          <p className="text-gray-400 font-medium tracking-wide">
            Made in love with <span className="text-white font-semibold">Vanshil</span> 😍😊
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
