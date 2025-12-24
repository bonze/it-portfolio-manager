import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FaCheckCircle, FaRegCircle, FaEdit } from 'react-icons/fa';
import EditModal from './EditModal';

const WorkPackageItem = ({ workPackage }) => {
    const { dispatch } = useStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleStatusChange = (e) => {
        const newStatus = parseInt(e.target.value, 10);
        dispatch({
            type: 'UPDATE_WORK_PACKAGE',
            payload: { id: workPackage.id, status: newStatus }
        });
    };

    const toggleComplete = () => {
        const newStatus = workPackage.status === 100 ? 0 : 100;
        dispatch({
            type: 'UPDATE_WORK_PACKAGE',
            payload: { id: workPackage.id, status: newStatus }
        });
    }

    const handleSave = (data) => {
        dispatch({
            type: 'UPDATE_WORK_PACKAGE',
            payload: { id: workPackage.id, ...data }
        });
    }

    return (
        <>
            <div className="flex justify-between items-center p-2 rounded hover:bg-bg-secondary transition-colors group ml-2">
                <div className="flex items-center gap-2">
                    <button onClick={toggleComplete} className="text-accent-color hover:text-accent-hover">
                        {workPackage.status === 100 ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
                    </button>
                    <span className={`text-sm ${workPackage.status === 100 ? 'line-through text-muted' : ''}`}>
                        {workPackage.description}
                    </span>
                    <div className="flex gap-2">
                        <span className="text-xs text-muted bg-bg-primary px-1 rounded border border-border-color">
                            {workPackage.assignee}
                        </span>
                        {((workPackage.budget?.plan || 0) + (workPackage.budget?.additional || 0)) > 0 && (
                            <span className="text-xs text-muted bg-bg-primary px-1 rounded border border-border-color">
                                ${((workPackage.budget?.plan || 0) + (workPackage.budget?.additional || 0)).toLocaleString()}
                            </span>
                        )}
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
                        value={workPackage.status || 0}
                        onChange={handleStatusChange}
                        className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs w-8 text-right">{workPackage.status}%</span>
                </div>
            </div>
            <EditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSave}
                entity={workPackage}
                type="work-package"
            />
        </>
    );
};

export default WorkPackageItem;
