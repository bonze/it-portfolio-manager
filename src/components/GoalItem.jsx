import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import ScopeItem from './ScopeItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaBullseye } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const GoalItem = ({ goal }) => {
    const { state, calculateCompletion, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);

    const completion = calculateCompletion(goal.id, 'goal');
    const scopes = state.scopes.filter(s => s.goalId === goal.id);

    const handleAddScope = (description) => {
        dispatch({
            type: 'ADD_SCOPE',
            payload: {
                id: uuidv4(),
                goalId: goal.id,
                description,
                budget: 0,
                timeline: 'TBD',
                status: 'Planning'
            }
        });
    };

    return (
        <div className="bg-bg-primary p-3 rounded-md border border-border-color">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-2">
                    {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                    <FaBullseye className="text-warning-color" />
                    <span className="font-medium">{goal.description}</span>
                </div>
                <div style={{ width: '100px' }}>
                    <ProgressBar percentage={completion} />
                </div>
            </div>

            {expanded && (
                <div className="pl-4 mt-3 border-l border-border-color ml-1">
                    <div className="flex flex-col gap-2">
                        {scopes.map(scope => (
                            <ScopeItem key={scope.id} scope={scope} />
                        ))}
                        {scopes.length === 0 && <p className="text-xs text-muted">No scopes defined.</p>}
                        <InlineAdd onAdd={handleAddScope} placeholder="Add New Scope" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalItem;
