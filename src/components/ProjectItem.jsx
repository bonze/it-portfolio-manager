import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import GoalItem from './GoalItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaFolder, FaExclamationCircle, FaEdit, FaHistory } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import EditModal from './EditModal';
import BaselineModal from './BaselineModal';

const ProjectItem = ({ project, ...props }) => {
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
            <div className={`card mb-4 ${props.isSelected ? 'border-accent-color' : ''}`}>
                {/* Mobile: Stacked layout, Desktop: Inline layout */}
                <div className="flex gap-3 mb-2">
                    {/* Checkbox Column */}
                    {props.showCheckbox && (
                        <div className="flex-shrink-0 pt-1">
                            <input
                                type="checkbox"
                                checked={props.isSelected}
                                onChange={(e) => { e.stopPropagation(); props.onToggleSelect(project.id); }}
                                className="w-5 h-5 cursor-pointer"
                                style={{ accentColor: 'var(--accent-color)' }}
                            />
                        </div>
                    )}

                    {/* Main Header Content */}
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                        {/* Left side: Expand button + Title + Badges */}
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="flex-shrink-0 mt-1 text-muted hover:text-text-primary transition-colors"
                            >
                                {expanded ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            <FaFolder className="text-accent-color flex-shrink-0 mt-1" />

                            <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-semibold break-words">{project.name}</h3>

                                {/* Badges - wrap on mobile */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.businessUnit && (
                                        <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color whitespace-nowrap">
                                            {project.businessUnit}
                                        </span>
                                    )}
                                    {project.pm && (
                                        <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color whitespace-nowrap">
                                            PM: {project.pm}
                                        </span>
                                    )}
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-200 whitespace-nowrap">
                                        Baseline: v{project.baseline || 0}
                                    </span>
                                    {hasPendingChanges && (
                                        <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
                                            <FaExclamationCircle size={10} /> Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side: Action buttons + Progress - Stack on mobile, inline on desktop */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isAdmin && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsBaselineModalOpen(true); }}
                                    className="text-muted hover:text-blue-600 text-sm flex items-center gap-1 p-2"
                                    title="Manage Baseline"
                                >
                                    <FaHistory />
                                    <span className="hidden lg:inline text-xs">Baseline</span>
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="text-muted hover:text-accent text-sm p-2"
                                title="Edit Project"
                            >
                                <FaEdit />
                            </button>
                            <div className="w-32 md:w-45">
                                <ProgressBar percentage={completion} />
                            </div>
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
