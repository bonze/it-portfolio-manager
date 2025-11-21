import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { FaProjectDiagram, FaChartBar } from 'react-icons/fa';
import './index.css';

function App() {
  const [activeView, setActiveView] = useState('projects'); // 'projects' or 'analytics'

  return (
    <StoreProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        {/* Navigation Bar */}
        <nav className="bg-bg-card border-b border-border-color">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveView('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeView === 'projects'
                    ? 'bg-accent-color text-white'
                    : 'text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaProjectDiagram />
                <span>Projects</span>
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeView === 'analytics'
                    ? 'bg-accent-color text-white'
                    : 'text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaChartBar />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {activeView === 'projects' ? <Dashboard /> : <AnalyticsDashboard />}
      </div>
    </StoreProvider>
  );
}

export default App;
