import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import { FaProjectDiagram, FaChartBar, FaFileDownload, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
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
      <nav className="bg-bg-card border-b border-border-color sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4">
          {/* Mobile/Tablet: Stacked layout */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted">
                <strong className="text-text-primary">{user?.username}</strong> ({user?.role})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="btn btn-icon-only bg-success-color text-white hover:bg-green-700"
                  title="Export Excel"
                >
                  <FaFileDownload />
                </button>
                <button
                  onClick={logout}
                  className="btn btn-icon-only bg-error-color/10 text-error-color hover:bg-error-color/20"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveView('projects')}
                className={`btn ${activeView === 'projects'
                  ? 'bg-accent-color text-white'
                  : 'bg-bg-secondary text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaProjectDiagram />
                <span>Projects</span>
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`btn ${activeView === 'analytics'
                  ? 'bg-accent-color text-white'
                  : 'bg-bg-secondary text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaChartBar />
                <span>Analytics</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className={`btn ${activeView === 'admin'
                    ? 'bg-accent-color text-white'
                    : 'bg-bg-secondary text-muted hover:text-text-primary hover:bg-bg-primary'
                    }`}
                >
                  <FaUserCog />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop: Single row layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex gap-3 lg:gap-4">
              <button
                onClick={() => setActiveView('projects')}
                className={`btn transition-all ${activeView === 'projects'
                  ? 'bg-accent-color text-white'
                  : 'text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaProjectDiagram />
                <span>Projects</span>
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`btn transition-all ${activeView === 'analytics'
                  ? 'bg-accent-color text-white'
                  : 'text-muted hover:text-text-primary hover:bg-bg-primary'
                  }`}
              >
                <FaChartBar />
                <span>Analytics</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className={`btn transition-all ${activeView === 'admin'
                    ? 'bg-accent-color text-white'
                    : 'text-muted hover:text-text-primary hover:bg-bg-primary'
                    }`}
                >
                  <FaUserCog />
                  <span>Admin</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <span className="text-sm text-muted hidden lg:inline">
                Logged in as: <strong className="text-text-primary">{user?.username}</strong> ({user?.role})
              </span>
              <button
                onClick={handleExport}
                className="btn bg-success-color text-white hover:bg-green-700"
              >
                <FaFileDownload />
                <span className="hidden lg:inline">Export Excel</span>
              </button>
              <button
                onClick={logout}
                className="btn bg-error-color/10 text-error-color hover:bg-error-color/20"
              >
                <FaSignOutAlt />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeView === 'projects' && <Dashboard />}
      {activeView === 'analytics' && <AnalyticsDashboard />}
      {activeView === 'admin' && <AdminPanel />}
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
