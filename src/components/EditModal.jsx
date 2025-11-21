import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaHistory } from 'react-icons/fa';
import KPIManager from './KPIManager';
import BaselineViewer from './BaselineViewer';

const EditModal = ({ isOpen, onClose, onSave, entity, type }) => {
    const [formData, setFormData] = useState({});
    const [showBaselines, setShowBaselines] = useState(false);

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

    const handleBudgetChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            budget: {
                ...(prev.budget || {}),
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const handleVendorChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vendor: {
                ...(prev.vendor || {}),
                [field]: field === 'contractValue' ? parseFloat(value) || 0 : value
            }
        }));
    };

    const handleResourceChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            resources: {
                ...(prev.resources || {}),
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const budget = formData.budget || {};
    const vendor = formData.vendor || {};
    const resources = formData.resources || {};

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-bg-card p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto border border-border-color">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                            Edit {type}
                            {entity?.currentBaseline !== undefined && (
                                <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                                    Baseline {entity.currentBaseline}
                                </span>
                            )}
                        </h3>
                        <div className="flex gap-2">
                            {entity && (
                                <button
                                    onClick={() => setShowBaselines(true)}
                                    className="text-muted hover:text-accent flex items-center gap-1 text-sm"
                                >
                                    <FaHistory /> History
                                </button>
                            )}
                            <button onClick={onClose} className="text-muted hover:text-text-primary">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {/* Basic Fields */}
                        <div>
                            <label className="block text-xs text-muted mb-1">
                                {type === 'project' ? 'Project Name' : 'Description'}
                            </label>
                            <input
                                name={type === 'project' ? 'name' : 'description'}
                                value={formData[type === 'project' ? 'name' : 'description'] || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {type === 'project' && (
                            <div>
                                <label className="block text-xs text-muted mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary"
                                    rows="2"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-muted mb-1">Owner / Unit</label>
                            <input
                                name="owner"
                                value={formData.owner || ''}
                                onChange={handleChange}
                                placeholder="e.g. IT Dept"
                            />
                        </div>

                        {/* Budget Fields */}
                        <div className="border-t border-border-color pt-3">
                            <label className="block text-sm font-semibold text-text-primary mb-2">Budget</label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs text-muted mb-1">Plan ($)</label>
                                    <input
                                        type="number"
                                        value={budget.plan || 0}
                                        onChange={(e) => handleBudgetChange('plan', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1">Actual ($)</label>
                                    <input
                                        type="number"
                                        value={budget.actual || 0}
                                        onChange={(e) => handleBudgetChange('actual', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1">Additional ($)</label>
                                    <input
                                        type="number"
                                        value={budget.additional || 0}
                                        onChange={(e) => handleBudgetChange('additional', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            {budget.plan > 0 && (
                                <div className="mt-2 text-xs">
                                    <span className="text-muted">Total Budget: </span>
                                    <span className="font-semibold">${((budget.plan || 0) + (budget.additional || 0)).toLocaleString()}</span>
                                    <span className="ml-3 text-muted">Variance: </span>
                                    <span className={`font-semibold ${(budget.actual || 0) > ((budget.plan || 0) + (budget.additional || 0))
                                            ? 'text-red-500'
                                            : 'text-green-500'
                                        }`}>
                                        ${(((budget.plan || 0) + (budget.additional || 0)) - (budget.actual || 0)).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Vendor Fields (Projects only) */}
                        {type === 'project' && (
                            <div className="border-t border-border-color pt-3">
                                <label className="block text-sm font-semibold text-text-primary mb-2">Vendor Information</label>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Vendor Name</label>
                                        <input
                                            value={vendor.name || ''}
                                            onChange={(e) => handleVendorChange('name', e.target.value)}
                                            placeholder="e.g. TechCorp Solutions"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Contact</label>
                                        <input
                                            value={vendor.contact || ''}
                                            onChange={(e) => handleVendorChange('contact', e.target.value)}
                                            placeholder="e.g. contact@techcorp.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Contract Value ($)</label>
                                        <input
                                            type="number"
                                            value={vendor.contractValue || 0}
                                            onChange={(e) => handleVendorChange('contractValue', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resource Fields (Projects only) */}
                        {type === 'project' && (
                            <div className="border-t border-border-color pt-3">
                                <label className="block text-sm font-semibold text-text-primary mb-2">Resources</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Plan Man-Days</label>
                                        <input
                                            type="number"
                                            value={resources.planManDays || 0}
                                            onChange={(e) => handleResourceChange('planManDays', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Actual Man-Days</label>
                                        <input
                                            type="number"
                                            value={resources.actualManDays || 0}
                                            onChange={(e) => handleResourceChange('actualManDays', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Plan Man-Months</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={resources.planManMonths || 0}
                                            onChange={(e) => handleResourceChange('planManMonths', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted mb-1">Actual Man-Months</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={resources.actualManMonths || 0}
                                            onChange={(e) => handleResourceChange('actualManMonths', e.target.value)}
                                        />
                                    </div>
                                </div>
                                {resources.planManDays > 0 && (
                                    <div className="mt-2 text-xs text-muted">
                                        Utilization: {((resources.actualManDays || 0) / resources.planManDays * 100).toFixed(1)}%
                                    </div>
                                )}
                            </div>
                        )}

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
                            <>
                                <div>
                                    <label className="block text-xs text-muted mb-1">Business Unit</label>
                                    <input
                                        name="businessUnit"
                                        value={formData.businessUnit || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted mb-1">Project Manager</label>
                                    <input
                                        name="pm"
                                        value={formData.pm || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {/* KPI Manager */}
                        {entity && type !== 'project' && (
                            <KPIManager
                                entityId={entity.id}
                                entityType={type}
                                kpis={formData.kpis || []}
                            />
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={onClose} className="btn btn-outline text-sm">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary text-sm">
                                <FaSave /> Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Baseline Viewer Modal */}
            {showBaselines && (
                <BaselineViewer
                    isOpen={showBaselines}
                    onClose={() => setShowBaselines(false)}
                    entity={entity}
                    entityType={type}
                />
            )}
        </>
    );
};

export default EditModal;
