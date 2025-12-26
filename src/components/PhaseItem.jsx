import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import DeliverableItem from './DeliverableItem';
import InlineAdd from './InlineAdd';
import KPIManager from './KPIManager';
import { FaChevronDown, FaChevronRight, FaLayerGroup, FaTrophy } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '../utils/dateFormat';

const PhaseItem = ({ phase }) => {
    const { state, calculateCompletion, calculateTimeline, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);
    const [showKPIModal, setShowKPIModal] = useState(false);

    const completion = calculateCompletion(phase.id, 'phase');
    const deliverables = state.deliverables.filter(d => d.phaseId === phase.id);
    const kpis = state.kpis.filter(k => k.entityId === phase.id && k.entityType === 'phase');

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
        <>
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
                                        {formatDate(timeline.startDate)} - {formatDate(timeline.endDate)}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowKPIModal(true);
                            }}
                            className="btn btn-sm btn-outline text-accent-color border-accent-color hover:bg-accent-color hover:text-white"
                            title="Manage KPIs"
                        >
                            <FaTrophy size={10} />
                        </button>
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

            {/* KPI Modal */}
            {showKPIModal && (
                <div className="modal-overlay" onClick={() => setShowKPIModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>Manage KPIs - {phase.description}</h2>
                            <button onClick={() => setShowKPIModal(false)} className="close-button">&times;</button>
                        </div>
                        <div className="modal-body">
                            <KPIManager
                                entityId={phase.id}
                                entityType="phase"
                                kpis={kpis}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PhaseItem;
