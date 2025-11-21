import React, { useState } from 'react';
import { FaTimes, FaSave, FaPlus } from 'react-icons/fa';

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
        pm: '',
        budget: 0,
        businessUnit: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ name: '', description: '', owner: '', pm: '', budget: 0, businessUnit: '' }); // Reset
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-bg-card p-6 rounded-lg shadow-lg w-96 border border-border-color">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Project</h3>
                    <button onClick={onClose} className="text-muted hover:text-text-primary"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-xs text-muted mb-1">Project Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Cloud Migration"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary"
                            rows="2"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Owner</label>
                        <input
                            name="owner"
                            value={formData.owner}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Project Manager (PM)</label>
                        <input
                            name="pm"
                            value={formData.pm}
                            onChange={handleChange}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Business Unit</label>
                        <input
                            name="businessUnit"
                            value={formData.businessUnit}
                            onChange={handleChange}
                            placeholder="e.g. IT Dept"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Budget ($)</label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="btn btn-outline text-sm">Cancel</button>
                        <button type="submit" className="btn btn-primary text-sm"><FaPlus /> Add Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
