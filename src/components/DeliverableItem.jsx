import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProgressBar from './ProgressBar';
import WorkPackageItem from './WorkPackageItem';
import InlineAdd from './InlineAdd';
import { FaChevronDown, FaChevronRight, FaCube } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const DeliverableItem = ({ deliverable }) => {
    const { state, calculateCompletion, calculateTimeline, dispatch } = useStore();
    const [expanded, setExpanded] = useState(false);

    const completion = calculateCompletion(deliverable.id, 'deliverable');
    const workPackages = state.workPackages.filter(wp => wp.deliverableId === deliverable.id);

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
                                    {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
                                </span>
                            );
                        })()}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">Budget: ${((deliverable.budget?.plan || 0) + (deliverable.budget?.additional || 0)).toLocaleString()}</span>
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
    );
};

export default DeliverableItem;
