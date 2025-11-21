import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProjectItem from './ProjectItem';
import ImportButton from './ImportButton';
import AddProjectModal from './AddProjectModal';
import { v4 as uuidv4 } from 'uuid';
import { FaTrash, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const { state, dispatch } = useStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data?')) {
            dispatch({ type: 'RESET_DATA' });
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

    return (
        <div className="max-w-full mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">IT Portfolio Manager</h1>
                <div className="flex gap-2">
                    <ImportButton />
                    <button onClick={handleReset} className="btn btn-outline text-warning-color border-warning-color hover:bg-warning-color hover:text-white flex items-center gap-2">
                        <FaTrash /> Reset Data
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {state.projects.length === 0 ? (
                    <div className="card text-muted text-center py-8">
                        No projects found. Add one below or import from Excel.
                    </div>
                ) : (
                    state.projects.map((project) => (
                        <ProjectItem key={project.id} project={project} />
                    ))
                )}

                <div className="flex justify-center p-4">
                    <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> Add New Project
                    </button>
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
