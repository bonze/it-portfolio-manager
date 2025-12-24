import React, { useState } from 'react';
import { FaTimes, FaPlus, FaBuilding, FaMoneyBillWave, FaUserTie, FaUsers } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import '../styles/Modal.css';

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
        pm: '',
        businessUnit: '',
        budget: { plan: 0, actual: 0, additional: 0 },
        vendor: { name: '', contact: '', contractValue: 0 },
        resources: { planManDays: 0, actualManDays: 0, planManMonths: 0, actualManMonths: 0 },
        startDate: '',
        endDate: '',
        actualStartDate: '',
        actualEndDate: ''
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
            resources: { planManDays: 0, actualManDays: 0, planManMonths: 0, actualManMonths: 0 },
            startDate: '',
            endDate: '',
            actualStartDate: '',
            actualEndDate: ''
        });

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">
                        <FaPlus className="text-accent" /> Add New Project
                    </h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <form id="add-project-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Basic Information Section */}
                        <div className="form-section">
                            <h4 className="form-section-title">
                                <FaBuilding className="text-primary" /> Project Details
                            </h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Project Name *</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Cloud Migration Phase 1"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-input form-textarea"
                                        rows="2"
                                        placeholder="Brief project description and objectives..."
                                    />
                                </div>

                                <div className="form-grid form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">Business Unit</label>
                                        <input
                                            name="businessUnit"
                                            value={formData.businessUnit}
                                            onChange={handleChange}
                                            placeholder="e.g. IT Dept"
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Owner</label>
                                        <input
                                            name="owner"
                                            value={formData.owner}
                                            onChange={handleChange}
                                            placeholder="e.g. CIO"
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Project Manager</label>
                                        <input
                                            name="pm"
                                            value={formData.pm}
                                            onChange={handleChange}
                                            placeholder="e.g. John Doe"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-grid form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Planned Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Planned End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-grid form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Actual Start Date</label>
                                        <input
                                            type="date"
                                            name="actualStartDate"
                                            value={formData.actualStartDate}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Actual End Date</label>
                                        <input
                                            type="date"
                                            name="actualEndDate"
                                            value={formData.actualEndDate}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget Section */}
                        <div className="form-section">
                            <h4 className="form-section-title">
                                <FaMoneyBillWave className="text-success" /> Financials
                            </h4>
                            <div className="form-grid form-grid-3">
                                <div className="form-group">
                                    <label className="form-label">Plan Budget ($) *</label>
                                    <input
                                        type="number"
                                        value={formData.budget.plan}
                                        onChange={(e) => handleBudgetChange('plan', e.target.value)}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Actual Spend ($)</label>
                                    <input
                                        type="number"
                                        value={formData.budget.actual}
                                        onChange={(e) => handleBudgetChange('actual', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Additional ($)</label>
                                    <input
                                        type="number"
                                        value={formData.budget.additional}
                                        onChange={(e) => handleBudgetChange('additional', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Vendor & Resources Split Section */}
                        <div className="form-grid form-grid-2">
                            {/* Vendor Information */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <FaUserTie className="text-warning" /> Vendor
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            value={formData.vendor.name}
                                            onChange={(e) => handleVendorChange('name', e.target.value)}
                                            placeholder="Vendor Name"
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Contract Value ($)</label>
                                        <input
                                            type="number"
                                            value={formData.vendor.contractValue}
                                            onChange={(e) => handleVendorChange('contractValue', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="form-section">
                                <h4 className="form-section-title">
                                    <FaUsers className="text-accent" /> Resources
                                </h4>
                                <div className="form-grid form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Plan (Days)</label>
                                        <input
                                            type="number"
                                            value={formData.resources.planManDays}
                                            onChange={(e) => handleResourceChange('planManDays', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Actual (Days)</label>
                                        <input
                                            type="number"
                                            value={formData.resources.actualManDays}
                                            onChange={(e) => handleResourceChange('actualManDays', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn btn-outline">
                        Cancel
                    </button>
                    <button type="submit" form="add-project-form" className="btn btn-primary">
                        <FaPlus /> Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProjectModal;
