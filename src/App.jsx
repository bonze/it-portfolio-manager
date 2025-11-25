import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Login from './components/Login';
import Register from './components/Register';
import { FaProjectDiagram, FaChartBar, FaFileDownload, FaSignOutAlt } from 'react-icons/fa';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useStore();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

const MainLayout = () => {
  const [activeView, setActiveView] = useState('projects');
  const { user, logout } = useStore();

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio_export.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
      alert('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navigation Bar */}
      <nav className="bg-bg-card border-b border-border-color">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Logged in as: <strong>{user?.username}</strong> ({user?.role})</span>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              <FaFileDownload />
              <span>Export Excel</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeView === 'projects' ? <Dashboard /> : <AnalyticsDashboard />}
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </StoreProvider>
  );
}

export default App;
