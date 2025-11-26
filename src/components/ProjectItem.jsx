import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import GoalItem from './GoalItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaFolder, FaExclamationCircle, FaEdit, FaHistory } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import EditModal from './EditModal';
import BaselineModal from './BaselineModal';

const ProjectItem = ({ project }) => {
    const { state, calculateCompletion, calculateBudgetVariance, calculateResourceUtilization, dispatch, user } = useStore();
    const [expanded, setExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isBaselineModalOpen, setIsBaselineModalOpen] = useState(false);

    const completion = calculateCompletion(project.id, 'project');
    const goals = state.goals.filter(g => g.projectId === project.id);
    const budgetVariance = calculateBudgetVariance(project.id, 'project');
    const resourceUtil = calculateResourceUtilization(project.id, 'project');

    const handleAddGoal = (description) => {
        dispatch({
            type: 'ADD_GOAL',
            payload: {
                id: uuidv4(),
                projectId: project.id,
                description,
                owner: '',
                budget: { plan: 0, actual: 0, additional: 0 },
                status: 'Planning',
                kpis: [],
                currentBaseline: 0,
                baselineHistory: [],
                pendingChanges: null
            }
        });
    };

    const handleSave = (data) => {
        dispatch({
            type: 'UPDATE_ENTITY',
            payload: { type: 'project', id: project.id, data }
        });
    };

    const handleUpdateBaseline = (projectId, updatedProject) => {
        dispatch({
            type: 'UPDATE_ENTITY',
            payload: { type: 'project', id: projectId, data: updatedProject }
        });
    };

    const hasPendingChanges = project.pendingChanges !== null && project.pendingChanges !== undefined;
    const isAdmin = user?.role === 'admin';

    return (
        <>
            <div className="card mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <FaChevronDown /> : <FaChevronRight />}
                        <FaFolder className="text-accent-color" />
                        <h3 className="text-lg">{project.name}</h3>
                        {project.businessUnit && <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color">{project.businessUnit}</span>}
                        {project.pm && <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color">PM: {project.pm}</span>}

                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-200">
                            Baseline: v{project.baseline || 0}
                        </span>

                        {hasPendingChanges && (
                            <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
                                <FaExclamationCircle size={10} /> Pending
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsBaselineModalOpen(true); }}
                                className="text-muted hover:text-blue-600 text-sm flex items-center gap-1"
                                title="Manage Baseline"
                            >
                                <FaHistory />
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            className="text-muted hover:text-accent text-sm"
                            title="Edit Project"
                        >
                            <FaEdit />
                        </button>
                        <div className="text-right" style={{ width: '150px' }}>
                            <ProgressBar percentage={completion} />
                        </div>
                    </div>
                </div>

                {/* Budget and Resource Summary */}
                {budgetVariance && (
                    <div className="flex gap-4 text-xs text-muted mb-2">
                        <div>
                            <span className="font-medium">Budget: </span>
                            <span className={budgetVariance.isOverBudget ? 'text-red-500' : 'text-green-500'}>
                                ${budgetVariance.actual.toLocaleString()} / ${budgetVariance.totalBudget.toLocaleString()}
                            </span>
                            <span className="ml-2">
                                ({budgetVariance.isOverBudget ? '+' : ''}{budgetVariance.variancePercent}%)
                            </span>
                        </div>
                        {project.vendor?.name && (
                            <div>
                                <span className="font-medium">Vendor: </span>
                                <span>{project.vendor.name}</span>
                            </div>
                        )}
                        {resourceUtil && resourceUtil.planManDays > 0 && (
                            <div>
                                <span className="font-medium">Resource: </span>
                                <span>{resourceUtil.daysUtilization}% utilized</span>
                            </div>
                        )}
                    </div>
                )}

                {expanded && (
                    <div className="pl-6 mt-4 border-l-2 border-border-color ml-2">
                        <p className="text-muted mb-4">{project.description}</p>

                        <div className="flex flex-col gap-3">
                            {goals.map(goal => (
                                <GoalItem key={goal.id} goal={goal} />
                            ))}
                            {goals.length === 0 && <p className="text-sm text-muted">No goals defined.</p>}
                            <InlineAdd onAdd={handleAddGoal} placeholder="Add New Goal" />
                        </div>
                    </div>
                )}
            </div>

            <EditModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSave}
                entity={project}
                type="project"
            />

            {isBaselineModalOpen && (
                <BaselineModal
                    project={project}
                    onClose={() => setIsBaselineModalOpen(false)}
                    onUpdate={handleUpdateBaseline}
                    userRole={user?.role}
                />
            )}
        </>
    );
};

export default ProjectItem;
