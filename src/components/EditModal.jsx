import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaHistory, FaEdit, FaBuilding, FaMoneyBillWave, FaUserTie, FaUsers, FaTasks, FaChartLine } from 'react-icons/fa';
import KPIManager from './KPIManager';
import BaselineViewer from './BaselineViewer';
import '../styles/Modal.css';

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
            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <div className="flex items-center gap-3">
                            <h3 className="modal-title capitalize">
                                <FaEdit className="text-accent" /> Edit {type}
                            </h3>
                            {entity?.currentBaseline !== undefined && (
                                <span className="px-2 py-0.5 rounded-full bg-accent bg-opacity-20 text-accent text-xs font-medium border border-accent border-opacity-30">
                                    Baseline v{entity.currentBaseline}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {entity && (
                                <button
                                    onClick={() => setShowBaselines(true)}
                                    className="btn btn-outline btn-sm gap-2 text-xs h-8 px-3"
                                    title="View History"
                                >
                                    <FaHistory /> <span className="hidden-mobile">History</span>
                                </button>
                            )}
                            <button onClick={onClose} className="modal-close-btn">
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="modal-content">
                        <form id="edit-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* General Information Section */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <FaTasks className="text-primary" /> General Information
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">
                                            {type === 'project' ? 'Project Name' : 'Description / Title'}
                                        </label>
                                        <input
                                            name={type === 'project' ? 'name' : 'description'}
                                            value={formData[type === 'project' ? 'name' : 'description'] || ''}
                                            onChange={handleChange}
                                            required
                                            className="form-input font-medium"
                                        />
                                    </div>

                                    {type === 'project' && (
                                        <div className="form-group">
                                            <label className="form-label">Detailed Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={handleChange}
                                                className="form-input form-textarea"
                                                rows="2"
                                            />
                                        </div>
                                    )}

                                    <div className="form-grid form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Owner / Unit</label>
                                            <input
                                                name="owner"
                                                value={formData.owner || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. IT Dept"
                                                className="form-input"
                                            />
                                        </div>
                                        {type === 'deliverable' && (
                                            <div className="form-group">
                                                <label className="form-label">Assignee</label>
                                                <input
                                                    name="assignee"
                                                    value={formData.assignee || ''}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Developer Name"
                                                    className="form-input"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Project Specific Fields */}
                            {type === 'project' && (
                                <>
                                    <div className="form-grid form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Business Unit</label>
                                            <input
                                                name="businessUnit"
                                                value={formData.businessUnit || ''}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status || 'Planning'}
                                                onChange={handleChange}
                                                className="form-input"
                                            >
                                                <option value="Planning">Planning</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="On Hold">On Hold</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Project Manager</label>
                                            <input
                                                name="pm"
                                                value={formData.pm || ''}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Budget Section */}
                                    <div className="form-section">
                                        <h4 className="form-section-title">
                                            <FaMoneyBillWave className="text-success" /> Financials
                                        </h4>
                                        <div className="form-grid form-grid-3">
                                            <div className="form-group">
                                                <label className="form-label">Plan ($)</label>
                                                <input
                                                    type="number"
                                                    value={budget.plan || 0}
                                                    onChange={(e) => handleBudgetChange('plan', e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Actual ($)</label>
                                                <input
                                                    type="number"
                                                    value={budget.actual || 0}
                                                    onChange={(e) => handleBudgetChange('actual', e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Additional ($)</label>
                                                <input
                                                    type="number"
                                                    value={budget.additional || 0}
                                                    onChange={(e) => handleBudgetChange('additional', e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>

                                        {/* Budget Summary */}
                                        {(budget.plan > 0 || budget.additional > 0) && (
                                            <div className="budget-summary">
                                                <div className="flex gap-4">
                                                    <span>Total: <span className="font-semibold text-text-primary">${((budget.plan || 0) + (budget.additional || 0)).toLocaleString()}</span></span>
                                                    <span>Variance:
                                                        <span className={`font-semibold ml-1 ${(budget.actual || 0) > ((budget.plan || 0) + (budget.additional || 0)) ? 'text-error' : 'text-success'}`}>
                                                            ${(((budget.plan || 0) + (budget.additional || 0)) - (budget.actual || 0)).toLocaleString()}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vendor & Resources */}
                                    <div className="form-grid form-grid-2">
                                        <div className="form-section">
                                            <h4 className="form-section-title">
                                                <FaUserTie className="text-warning" /> Vendor
                                            </h4>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        value={vendor.name || ''}
                                                        onChange={(e) => handleVendorChange('name', e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Value ($)</label>
                                                    <input
                                                        type="number"
                                                        value={vendor.contractValue || 0}
                                                        onChange={(e) => handleVendorChange('contractValue', e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <h4 className="form-section-title">
                                                <FaUsers className="text-accent" /> Resources
                                            </h4>
                                            <div className="form-grid form-grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Plan (Days)</label>
                                                    <input
                                                        type="number"
                                                        value={resources.planManDays || 0}
                                                        onChange={(e) => handleResourceChange('planManDays', e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Actual</label>
                                                    <input
                                                        type="number"
                                                        value={resources.actualManDays || 0}
                                                        onChange={(e) => handleResourceChange('actualManDays', e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* KPI Manager Section */}
                            {entity && (
                                <div className="form-section">
                                    <h4 className="form-section-title">
                                        <FaChartLine className="text-purple-400" /> Key Performance Indicators
                                    </h4>
                                    <KPIManager
                                        entityId={entity.id}
                                        entityType={type}
                                        kpis={formData.kpis || []}
                                    />
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Cancel
                        </button>
                        <button type="submit" form="edit-form" className="btn btn-primary">
                            <FaSave /> Save Changes
                        </button>
                    </div>
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
