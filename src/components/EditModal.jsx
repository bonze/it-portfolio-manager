import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const EditModal = ({ isOpen, onClose, onSave, entity, type }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (entity) {
            setFormData({ ...entity });
        }
    }, [entity]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-bg-card p-6 rounded-lg shadow-lg w-96 border border-border-color">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold capitalize">Edit {type}</h3>
                    <button onClick={onClose} className="text-muted hover:text-text-primary"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-xs text-muted mb-1">Description</label>
                        <input
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Owner / Unit</label>
                        <input
                            name="owner"
                            value={formData.owner || ''}
                            onChange={handleChange}
                            placeholder="e.g. IT Dept"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Budget ($)</label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget || 0}
                            onChange={handleChange}
                        />
                    </div>

                    {type === 'deliverable' && (
                        <div>
                            <label className="block text-xs text-muted mb-1">Assignee</label>
                            <input
                                name="assignee"
                                value={formData.assignee || ''}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {type === 'project' && (
                        <div>
                            <label className="block text-xs text-muted mb-1">Business Unit</label>
                            <input
                                name="businessUnit"
                                value={formData.businessUnit || ''}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="btn btn-outline text-sm">Cancel</button>
                        <button type="submit" className="btn btn-primary text-sm"><FaSave /> Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
