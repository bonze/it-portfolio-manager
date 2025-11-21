import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import DeliverableItem from './DeliverableItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaLayerGroup } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const ScopeItem = ({ scope }) => {
    const { state, calculateCompletion, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);

    const completion = calculateCompletion(scope.id, 'scope');
    const deliverables = state.deliverables.filter(d => {
        if (d.scopeIds) return d.scopeIds.includes(scope.id);
        return d.scopeId === scope.id;
    });

    const handleAddDeliverable = (description) => {
        dispatch({
            type: 'ADD_DELIVERABLE',
            payload: {
                id: uuidv4(),
                scopeIds: [scope.id],
                description,
                assignee: 'Unassigned',
                owner: 'TBD',
                budget: 0,
                status: 0,
                completionDate: null
            }
        });
    };

    return (
        <div className="bg-bg-card p-2 rounded border border-border-color mb-1">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-2">
                    {expanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                    <FaLayerGroup className="text-accent-color" size={12} />
                    <span className="text-sm font-medium">{scope.description}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">Budget: ${scope.budget}</span>
                    <div style={{ width: '80px' }}>
                        <ProgressBar percentage={completion} />
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="pl-4 mt-2 border-l border-border-color ml-1">
                    <div className="flex flex-col gap-1">
                        {deliverables.map(del => (
                            <DeliverableItem key={del.id} deliverable={del} />
                        ))}
                        {deliverables.length === 0 && <p className="text-xs text-muted">No deliverables defined.</p>}
                        <InlineAdd onAdd={handleAddDeliverable} placeholder="Add New Deliverable" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScopeItem;
