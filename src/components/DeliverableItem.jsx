import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import WorkPackageItem from './WorkPackageItem';
import InlineAdd from './InlineAdd';
import KPIManager from './KPIManager';
import { FaChevronDown, FaChevronRight, FaCube, FaTrophy, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from '../utils/dateFormat';

const DeliverableItem = ({ deliverable }) => {
    const { state, calculateCompletion, calculateTimeline, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);
    const [showKPIModal, setShowKPIModal] = useState(false);

    const completion = calculateCompletion(deliverable.id, 'deliverable');
    const workPackages = state.workPackages.filter(wp => wp.deliverableId === deliverable.id);
    const kpis = state.kpis.filter(k => k.entityId === deliverable.id && k.entityType === 'deliverable');

    const handleAddWorkPackage = (description) => {
        dispatch({
            type: 'ADD_WORK_PACKAGE',
            payload: {
                id: uuidv4(),
                deliverableId: deliverable.id,
                description,
                assignee: 'Unassigned',
                budget: { plan: 0, actual: 0, additional: 0 },
                status: 0,
                startDate: '',
                endDate: '',
                actualStartDate: '',
                actualEndDate: ''
            }
        });
    };

    return (
        <>
            <div className="bg-bg-secondary p-2 rounded border border-border-color mb-1 ml-2">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <div className="flex items-center gap-2">
                        {expanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                        <FaCube className="text-text-secondary" size={12} />
                        <div className="flex flex-col">
                            <span className="text-sm">{deliverable.description}</span>
                            {(() => {
                                const timeline = calculateTimeline(deliverable.id, 'deliverable');
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this deliverable? All child work packages will also be deleted.')) {
                                    dispatch({ type: 'DELETE_ENTITY', payload: { type: 'deliverable', id: deliverable.id } });
                                }
                            }}
                            className="btn btn-sm btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            title="Delete Deliverable"
                        >
                            <FaTrash size={10} />
                        </button>
                        <div style={{ width: '60px' }}>
                            <ProgressBar percentage={completion} />
                        </div>
                    </div>
                </div>

                {expanded && (
                    <div className="pl-2 mt-2 border-l border-border-color ml-1">
                        <div className="flex flex-col gap-1">
                            {workPackages.map(wp => (
                                <WorkPackageItem key={wp.id} workPackage={wp} />
                            ))}
                            {workPackages.length === 0 && <p className="text-xs text-muted ml-2">No work packages defined.</p>}
                            <div className="ml-2">
                                <InlineAdd onAdd={handleAddWorkPackage} placeholder="Add New Work Package" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* KPI Modal */}
            {showKPIModal && (
                <div className="modal-overlay" onClick={() => setShowKPIModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>Manage KPIs - {deliverable.description}</h2>
                            <button onClick={() => setShowKPIModal(false)} className="close-button">&times;</button>
                        </div>
                        <div className="modal-body">
                            <KPIManager
                                entityId={deliverable.id}
                                entityType="deliverable"
                                kpis={kpis}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeliverableItem;
