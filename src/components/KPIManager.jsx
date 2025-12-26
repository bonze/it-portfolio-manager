import React, { useState } from 'react';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { v4 as uuidv4 } from 'uuid';

const KPIManager = ({ entityId, entityType, kpis = [] }) => {
    const { dispatch } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        target: 0,
        actual: 0,
        unit: ''
    });

    const getKPIStatus = (kpi) => {
        const actual = parseFloat(kpi.actual) || 0;
        const target = parseFloat(kpi.target) || 0;

        if (actual >= target) return 'Achieved';
        if (actual >= target * 0.9) return 'On Track';
        return 'At Risk';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Achieved': return 'text-green-500';
            case 'On Track': return 'text-blue-500';
            case 'At Risk': return 'text-red-500';
            default: return 'text-muted';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Achieved': return <FaCheck />;
            case 'On Track': return <FaCheck />;
            case 'At Risk': return <FaExclamationTriangle />;
            default: return null;
        }
    };

    const handleAdd = () => {
        if (!formData.name || !formData.target) return;

        const newKPI = {
            id: uuidv4(),
            ...formData,
            status: getKPIStatus(formData)
        };

        dispatch({
            type: 'ADD_KPI',
            payload: { entityType, entityId, kpi: newKPI }
        });

        setFormData({ name: '', target: 0, actual: 0, unit: '' });
        setIsAdding(false);
    };

    const handleUpdate = (kpiId) => {
        if (!formData.name || !formData.target) return;

        const updatedKPI = {
            ...formData,
            status: getKPIStatus(formData)
        };

        dispatch({
            type: 'UPDATE_KPI',
            payload: {
                entityType,
                entityId,
                kpi: { id: kpiId, ...updatedKPI }
            }
        });

        setFormData({ name: '', target: 0, actual: 0, unit: '' });
        setEditingId(null);
    };

    const handleDelete = (kpiId) => {
        if (confirm('Are you sure you want to delete this KPI?')) {
            dispatch({
                type: 'DELETE_KPI',
                payload: { entityType, entityId, kpiId }
            });
        }
    };

    const startEdit = (kpi) => {
        setFormData({
            name: kpi.name,
            target: kpi.target,
            actual: kpi.actual,
            unit: kpi.unit || ''
        });
        setEditingId(kpi.id);
        setIsAdding(false);
    };

    const cancelEdit = () => {
        setFormData({ name: '', target: 0, actual: 0, unit: '' });
        setEditingId(null);
        setIsAdding(false);
    };

    return (
        <div className="w-full">
            <div className="flex justify-end items-center mb-3">
                {!isAdding && !editingId && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="btn btn-outline btn-sm text-xs h-8 gap-1"
                    >
                        <FaPlus size={10} /> Add KPI
                    </button>
                )}
            </div>

            {/* KPI List */}
            {kpis.length > 0 && (
                <div className="space-y-2 mb-2">
                    {kpis.map(kpi => {
                        const status = kpi.status || getKPIStatus(kpi);
                        return (
                            <div key={kpi.id} className="bg-bg-primary p-2 rounded text-xs border border-border-color">
                                {editingId === kpi.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="KPI Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full text-xs"
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="number"
                                                placeholder="Target"
                                                value={formData.target}
                                                onChange={(e) => setFormData({ ...formData, target: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                className="text-xs"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Actual"
                                                value={formData.actual}
                                                onChange={(e) => setFormData({ ...formData, actual: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                                className="text-xs"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Unit"
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(kpi.id)}
                                                className="btn btn-primary text-xs flex-1"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="btn btn-outline text-xs flex-1"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold text-text-primary">{kpi.name}</div>
                                            <div className="text-muted mt-1">
                                                Target: {kpi.target}{kpi.unit} | Actual: {kpi.actual}{kpi.unit}
                                            </div>
                                            <div className={`flex items-center gap-1 mt-1 ${getStatusColor(status)}`}>
                                                {getStatusIcon(status)}
                                                <span className="font-medium">{status}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-2">
                                            <button
                                                onClick={() => startEdit(kpi)}
                                                className="text-muted hover:text-accent"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(kpi.id)}
                                                className="text-muted hover:text-red-500"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add KPI Form */}
            {isAdding && (
                <div className="bg-bg-primary p-3 rounded border border-border-color space-y-2">
                    <input
                        type="text"
                        placeholder="KPI Name (e.g., User Adoption Rate)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs"
                    />
                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="number"
                            placeholder="Target"
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="text-xs"
                        />
                        <input
                            type="number"
                            placeholder="Actual"
                            value={formData.actual}
                            onChange={(e) => setFormData({ ...formData, actual: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="text-xs"
                        />
                        <input
                            type="text"
                            placeholder="Unit (%)"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            className="text-xs"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="btn btn-primary text-xs flex-1">
                            <FaPlus size={10} /> Add
                        </button>
                        <button onClick={cancelEdit} className="btn btn-outline text-xs flex-1">
                            <FaTimes size={10} /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {kpis.length === 0 && !isAdding && (
                <p className="text-xs text-muted italic">No KPIs defined yet</p>
            )}
        </div>
    );
};

export default KPIManager;
