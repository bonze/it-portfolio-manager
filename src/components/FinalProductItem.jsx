import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import PhaseItem from './PhaseItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaBoxOpen } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const FinalProductItem = ({ finalProduct }) => {
    const { state, calculateCompletion, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);

    const completion = calculateCompletion(finalProduct.id, 'final-product');
    const phases = state.phases.filter(p => p.finalProductId === finalProduct.id);

    const handleAddPhase = (description) => {
        dispatch({
            type: 'ADD_PHASE',
            payload: {
                id: uuidv4(),
                finalProductId: finalProduct.id,
                description,
                budget: { plan: 0, actual: 0, additional: 0 },
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
                    <FaBoxOpen className="text-warning-color" />
                    <span className="font-medium">{finalProduct.description}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div style={{ width: '100px' }}>
                        <ProgressBar percentage={completion} />
                    </div>
                    {(() => {
                        const { calculateTimeline } = useStore();
                        const timeline = calculateTimeline(finalProduct.id, 'final-product');
                        if (!timeline.startDate && !timeline.endDate) return null;
                        return (
                            <span className="text-[10px] text-muted">
                                {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
                            </span>
                        );
                    })()}
                </div>
            </div>

            {expanded && (
                <div className="pl-4 mt-3 border-l border-border-color ml-1">
                    <div className="flex flex-col gap-2">
                        {phases.map(phase => (
                            <PhaseItem key={phase.id} phase={phase} />
                        ))}
                        {phases.length === 0 && <p className="text-xs text-muted">No phases defined.</p>}
                        <InlineAdd onAdd={handleAddPhase} placeholder="Add New Phase" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinalProductItem;
