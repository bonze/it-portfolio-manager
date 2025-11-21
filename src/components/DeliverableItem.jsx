import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FaCheckCircle, FaRegCircle, FaEdit } from 'react-icons/fa';
import EditModal from './EditModal';

const DeliverableItem = ({ deliverable }) => {
    const { dispatch } = useStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleStatusChange = (e) => {
        const newStatus = parseInt(e.target.value, 10);
        dispatch({
            type: 'UPDATE_DELIVERABLE',
            payload: { id: deliverable.id, status: newStatus }
        });
    };

    const toggleComplete = () => {
        const newStatus = deliverable.status === 100 ? 0 : 100;
        dispatch({
            type: 'UPDATE_DELIVERABLE',
            payload: { id: deliverable.id, status: newStatus }
        });
    }

    const handleSave = (data) => {
        dispatch({
            type: 'UPDATE_DELIVERABLE',
            payload: { id: deliverable.id, ...data }
        });
    }

    return (
        <>
            <div className="flex justify-between items-center p-2 rounded hover:bg-bg-secondary transition-colors group">
                <div className="flex items-center gap-2">
                    <button onClick={toggleComplete} className="text-accent-color hover:text-accent-hover">
                        {deliverable.status === 100 ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>
                    <span className={`text-sm ${deliverable.status === 100 ? 'line-through text-muted' : ''}`}>
                        {deliverable.description}
                    </span>
                    <div className="flex gap-2">
                        <span className="text-xs text-muted bg-bg-primary px-1 rounded border border-border-color">
                            {deliverable.assignee}
                        </span>
                        {deliverable.owner && <span className="text-xs text-muted bg-bg-primary px-1 rounded border border-border-color">Owner: {deliverable.owner}</span>}
                        {deliverable.budget > 0 && <span className="text-xs text-muted bg-bg-primary px-1 rounded border border-border-color">${deliverable.budget}</span>}
                    </div>
                    <button onClick={() => setIsEditOpen(true)} className="text-muted hover:text-accent-color opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <FaEdit size={12} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={deliverable.status || 0}
                        onChange={handleStatusChange}
                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs w-8 text-right">{deliverable.status}%</span>
                </div>
            </div>
            <EditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSave}
                entity={deliverable}
                type="deliverable"
            />
        </>
    );
};

export default DeliverableItem;
