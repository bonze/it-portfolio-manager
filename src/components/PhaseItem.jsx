import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import DeliverableItem from './DeliverableItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaLayerGroup } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const PhaseItem = ({ phase }) => {
    const { state, calculateCompletion, calculateTimeline, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);

    const completion = calculateCompletion(phase.id, 'phase');
    const deliverables = state.deliverables.filter(d => d.phaseId === phase.id);

    const handleAddDeliverable = (description) => {
        dispatch({
            type: 'ADD_DELIVERABLE',
            payload: {
                id: uuidv4(),
                phaseId: phase.id,
                description,
                assignee: 'Unassigned',
                owner: 'TBD',
                budget: { plan: 0, actual: 0, additional: 0 },
                status: 0,
                startDate: '',
                endDate: '',
                actualStartDate: '',
                actualEndDate: '',
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
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{phase.description}</span>
                        {(() => {
                            const timeline = calculateTimeline(phase.id, 'phase');
                            if (!timeline.startDate && !timeline.endDate) return null;
                            return (
                                <span className="text-[10px] text-muted">
                                    {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
                                </span>
                            );
                        })()}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">Budget: ${((phase.budget?.plan || 0) + (phase.budget?.additional || 0)).toLocaleString()}</span>
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

export default PhaseItem;
