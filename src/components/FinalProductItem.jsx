import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import PhaseItem from './PhaseItem';
import InlineAdd from './InlineAdd';
import KPIManager from './KPIManager';
import { FaChevronDown, FaChevronRight, FaBoxOpen, FaTrophy } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '../utils/dateFormat';

const FinalProductItem = ({ finalProduct }) => {
    const { state, calculateCompletion, calculateTimeline, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);
    const [showKPIModal, setShowKPIModal] = useState(false);

    const completion = calculateCompletion(finalProduct.id, 'final-product');
    const phases = state.phases.filter(p => p.finalProductId === finalProduct.id);
    const kpis = state.kpis.filter(k => k.entityId === finalProduct.id && k.entityType === 'final-product');

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
        <>
            <div className="bg-bg-primary p-3 rounded-md border border-border-color">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <div className="flex items-center gap-2">
                        {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        <FaBoxOpen className="text-warning-color" />
                        <span className="font-medium">{finalProduct.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowKPIModal(true);
                            }}
                            className="btn btn-sm btn-outline text-accent-color border-accent-color hover:bg-accent-color hover:text-white"
                            title="Manage KPIs"
                        >
                            <FaTrophy size={12} />
                        </button>
                        <div className="flex flex-col items-end gap-1">
                            <div style={{ width: '100px' }}>
                                <ProgressBar percentage={completion} />
                            </div>
                            {(() => {
                                const timeline = calculateTimeline(finalProduct.id, 'final-product');
                                if (!timeline.startDate && !timeline.endDate) return null;
                                return (
                                    <span className="text-[10px] text-muted">
                                        {formatDate(timeline.startDate)} - {formatDate(timeline.endDate)}
                                    </span>
                                );
                            })()}
                        </div>
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

            {/* KPI Modal */}
            {showKPIModal && (
                <div className="modal-overlay" onClick={() => setShowKPIModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>Manage KPIs - {finalProduct.description}</h2>
                            <button onClick={() => setShowKPIModal(false)} className="close-button">×</button>
                        </div>
                        <div className="modal-body">
                            <KPIManager
                                entityId={finalProduct.id}
                                entityType="final-product"
                                kpis={kpis}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FinalProductItem;
