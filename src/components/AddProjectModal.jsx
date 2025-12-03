import React, { useState } from 'react';
import { FaTimes, FaSave, FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
        pm: '',
        businessUnit: '',
        budget: { plan: 0, actual: 0, additional: 0 },
        vendor: { name: '', contact: '', contractValue: 0 },
        resources: { planManDays: 0, actualManDays: 0, planManMonths: 0, actualManMonths: 0 }
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBudgetChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            budget: {
                ...prev.budget,
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const handleVendorChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vendor: {
                ...prev.vendor,
                [field]: field === 'contractValue' ? parseFloat(value) || 0 : value
            }
        }));
    };

    const handleResourceChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            resources: {
                ...prev.resources,
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProject = {
            ...formData,
            id: uuidv4(),
            status: 'Planning',
            kpis: [],
            currentBaseline: 0,
            baselineHistory: [{
                version: 0,
                data: { ...formData },
                timestamp: Date.now(),
                approvedBy: 'System'
            }],
            pendingChanges: null
        };

        onSave(newProject);

        // Reset form
        setFormData({
            name: '',
            description: '',
            owner: '',
            pm: '',
            businessUnit: '',
            budget: { plan: 0, actual: 0, additional: 0 },
            vendor: { name: '', contact: '', contractValue: 0 },
            resources: { planManDays: 0, actualManDays: 0, planManMonths: 0, actualManMonths: 0 }
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-bg-card p-6 rounded-lg shadow-lg border border-border-color" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Project</h3>
                    <button onClick={onClose} className="text-muted hover:text-text-primary">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Basic Information */}
                    <div>
                        <label className="block text-xs text-muted mb-1">Project Name *</label>
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
                            placeholder="Brief project description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-muted mb-1">Owner</label>
                            <input
                                name="owner"
                                value={formData.owner}
                                onChange={handleChange}
                                placeholder="e.g. IT Dept"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted mb-1">Project Manager</label>
                            <input
                                name="pm"
                                value={formData.pm}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-muted mb-1">Business Unit</label>
                        <input
                            name="businessUnit"
                            value={formData.businessUnit}
                            onChange={handleChange}
                            placeholder="e.g. IT Department"
                        />
                    </div>

                    {/* Budget */}
                    <div className="border-t border-border-color pt-3">
                        <label className="block text-sm font-semibold text-text-primary mb-2">Budget</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs text-muted mb-1">Plan ($) *</label>
                                <input
                                    type="number"
                                    value={formData.budget.plan}
                                    onChange={(e) => handleBudgetChange('plan', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Actual ($)</label>
                                <input
                                    type="number"
                                    value={formData.budget.actual}
                                    onChange={(e) => handleBudgetChange('actual', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Additional ($)</label>
                                <input
                                    type="number"
                                    value={formData.budget.additional}
                                    onChange={(e) => handleBudgetChange('additional', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vendor Information */}
                    <div className="border-t border-border-color pt-3">
                        <label className="block text-sm font-semibold text-text-primary mb-2">Vendor Information</label>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-xs text-muted mb-1">Vendor Name</label>
                                <input
                                    value={formData.vendor.name}
                                    onChange={(e) => handleVendorChange('name', e.target.value)}
                                    placeholder="e.g. TechCorp Solutions"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Contact</label>
                                <input
                                    value={formData.vendor.contact}
                                    onChange={(e) => handleVendorChange('contact', e.target.value)}
                                    placeholder="e.g. contact@techcorp.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Contract Value ($)</label>
                                <input
                                    type="number"
                                    value={formData.vendor.contractValue}
                                    onChange={(e) => handleVendorChange('contractValue', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="border-t border-border-color pt-3">
                        <label className="block text-sm font-semibold text-text-primary mb-2">Resource Planning</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-muted mb-1">Plan Man-Days</label>
                                <input
                                    type="number"
                                    value={formData.resources.planManDays}
                                    onChange={(e) => handleResourceChange('planManDays', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Actual Man-Days</label>
                                <input
                                    type="number"
                                    value={formData.resources.actualManDays}
                                    onChange={(e) => handleResourceChange('actualManDays', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Plan Man-Months</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.resources.planManMonths}
                                    onChange={(e) => handleResourceChange('planManMonths', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted mb-1">Actual Man-Months</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.resources.actualManMonths}
                                    onChange={(e) => handleResourceChange('actualManMonths', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="btn btn-outline text-sm">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary text-sm">
                            <FaPlus /> Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
