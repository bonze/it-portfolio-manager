import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProjectItem from './ProjectItem';
import ImportButton from './ImportButton';
import AddProjectModal from './AddProjectModal';
import YearFilter from './YearFilter';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const { state, dispatch, user, calculateCompletion, calculateTimeline } = useStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const currentYear = new Date().getFullYear();
    const [selectedYears, setSelectedYears] = useState([currentYear]);
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all data?')) {
            try {
                await dispatch({ type: 'RESET_DATA' });
                alert('All data has been reset successfully.');
            } catch (e) {
                console.error('Reset failed', e);
            }
        }
    };

    const handleAddProject = (projectData) => {
        dispatch({
            type: 'ADD_PROJECT',
            payload: {
                id: uuidv4(),
                ...projectData,
                status: 'Planning'
            }
        });
    };

    const toggleSelectProject = (projectId) => {
        setSelectedProjectIds(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedProjectIds.length} project(s)? This action cannot be undone.`)) {
            dispatch({
                type: 'DELETE_PROJECTS',
                payload: { ids: selectedProjectIds }
            });
            setSelectedProjectIds([]);
        }
    };


    // Filter projects by selected years
    const filteredProjects = state.projects.filter(project => {
        const timeline = calculateTimeline(project.id, 'project');
        const projectYear = timeline.startDate ? new Date(timeline.startDate).getFullYear() : (project.year || currentYear);
        return selectedYears.includes(projectYear);
    });

    // Calculate quick stats for sidebar
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter(p => p.status === 'In Progress').length;
    const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;
    const totalBudget = filteredProjects.reduce((sum, p) => {
        const budget = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        return sum + budget;
    }, 0);
    const avgCompletion = totalProjects > 0
        ? Math.round(filteredProjects.reduce((sum, p) => sum + calculateCompletion(p.id, 'project'), 0) / totalProjects)
        : 0;

    const isAdmin = user?.role === 'admin';

    return (
        <div className="w-full px-4 py-6 md:px-6 lg:px-8">
            {/* Mobile Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary">IT Portfolio Manager</h1>
                    <YearFilter selectedYears={selectedYears} onChange={setSelectedYears} />
                </div>

                {/* Mobile Actions - Full width on mobile, inline on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 hidden-desktop">
                    <ImportButton />
                    {isAdmin && selectedProjectIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="btn btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <FaTrash /> Delete Selected ({selectedProjectIds.length})
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={handleReset}
                            className="btn btn-outline text-warning-color border-warning-color hover:bg-warning-color hover:text-white"
                        >
                            <FaTrash />
                            <span className="btn-text-desktop">Reset Data</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <FaPlus />
                        <span className="btn-text-desktop">Add New Project</span>
                    </button>
                </div>
            </div>

            {/* Desktop: Two-column layout, Mobile/Tablet: Single column */}
            <div className="desktop-two-col">
                {/* Main Content Area */}
                <div className="main-content">
                    {isAdmin && filteredProjects.length > 0 && (
                        <div className="mb-2 flex justify-end visible-desktop">
                            {selectedProjectIds.length > 0 && (
                                <button
                                    onClick={handleDeleteSelected}
                                    className="btn btn-outline btn-sm text-red-500 border-red-500 hover:bg-red-500 hover:text-white gap-2"
                                >
                                    <FaTrash size={12} /> Delete Selected ({selectedProjectIds.length})
                                </button>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        {filteredProjects.length === 0 ? (
                            <div className="card text-muted text-center py-8">
                                {state.projects.length === 0
                                    ? 'No projects found. Add one below or import from Excel.'
                                    : `No projects found for ${selectedYears.length === 1 ? selectedYears[0] : 'selected years'}.`
                                }
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
                                <ProjectItem
                                    key={project.id}
                                    project={project}
                                    showCheckbox={isAdmin}
                                    isSelected={selectedProjectIds.includes(project.id)}
                                    onToggleSelect={toggleSelectProject}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar - Only visible on desktop */}
                <div className="sidebar visible-desktop">
                    <div className="flex flex-col gap-4">
                        {/* Quick Stats */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-bg-primary p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-accent-color">{totalProjects}</div>
                                    <div className="text-xs text-muted">Total Projects</div>
                                </div>
                                <div className="bg-bg-primary p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-success-color">{activeProjects}</div>
                                    <div className="text-xs text-muted">In Progress</div>
                                </div>
                                <div className="bg-bg-primary p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-color">{completedProjects}</div>
                                    <div className="text-xs text-muted">Completed</div>
                                </div>
                                <div className="bg-bg-primary p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-warning-color">{avgCompletion}%</div>
                                    <div className="text-xs text-muted">Avg Complete</div>
                                </div>
                            </div>
                            <div className="mt-4 bg-bg-primary p-3 rounded-lg">
                                <div className="text-sm text-muted mb-1">Total Budget</div>
                                <div className="text-xl font-bold text-success-color">
                                    ${totalBudget.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="btn btn-primary w-full justify-center"
                                >
                                    <FaPlus /> Add New Project
                                </button>
                                <ImportButton />
                                <button
                                    onClick={handleReset}
                                    className="btn btn-outline text-warning-color border-warning-color hover:bg-warning-color hover:text-white w-full justify-center"
                                >
                                    <FaTrash /> Reset Data
                                </button>
                            </div>
                        </div>

                        {/* Status Distribution */}
                        {totalProjects > 0 && (
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Status Overview</h3>
                                <div className="space-y-3">
                                    {['Planning', 'In Progress', 'Completed', 'On Hold'].map(status => {
                                        const count = filteredProjects.filter(p => p.status === status).length;
                                        const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
                                        if (count === 0) return null;

                                        const statusColors = {
                                            'Planning': 'bg-primary-color',
                                            'In Progress': 'bg-accent-color',
                                            'Completed': 'bg-success-color',
                                            'On Hold': 'bg-warning-color'
                                        };

                                        return (
                                            <div key={status}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-muted">{status}</span>
                                                    <span className="text-text-primary font-medium">{count} ({percentage}%)</span>
                                                </div>
                                                <div className="progress-container">
                                                    <div
                                                        className={`h-full ${statusColors[status]} transition-all`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddProject}
            />
        </div>
    );
};

export default Dashboard;
