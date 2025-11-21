import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import GoalItem from './GoalItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaFolder } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const ProjectItem = ({ project }) => {
    const { state, calculateCompletion, dispatch } = useStore();
    const [expanded, setExpanded] = useState(true);

    const completion = calculateCompletion(project.id, 'project');
    const goals = state.goals.filter(g => g.projectId === project.id);

    const handleAddGoal = (description) => {
        dispatch({
            type: 'ADD_GOAL',
            payload: {
                id: uuidv4(),
                projectId: project.id,
                description,
                status: 'Planning'
            }
        });
    };

    return (
        <div className="card mb-4">
            <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-2">
                    {expanded ? <FaChevronDown /> : <FaChevronRight />}
                    <FaFolder className="text-accent-color" />
                    <h3 className="text-lg">{project.name}</h3>
                    {project.businessUnit && <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color">{project.businessUnit}</span>}
                    {project.pm && <span className="text-xs bg-bg-card px-2 py-0.5 rounded text-muted border border-border-color">PM: {project.pm}</span>}
                </div>
                <div className="text-right" style={{ width: '150px' }}>
                    <ProgressBar percentage={completion} />
                </div>
            </div>

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
    );
};

export default ProjectItem;
