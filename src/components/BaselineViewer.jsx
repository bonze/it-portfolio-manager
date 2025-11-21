import React, { useState } from 'react';
import { FaTimes, FaCheck, FaHistory, FaExclamationCircle } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

const BaselineViewer = ({ isOpen, onClose, entity, entityType }) => {
    const { getBaselineHistory, compareBaselines, dispatch } = useStore();
    const [selectedBaselines, setSelectedBaselines] = useState([0, null]);

    if (!isOpen || !entity) return null;

    const history = getBaselineHistory(entity.id, entityType);
    const hasPendingChanges = entity.pendingChanges !== null && entity.pendingChanges !== undefined;

    const handleApprove = () => {
        if (confirm('Approve these changes and create a new baseline?')) {
            dispatch({
                type: 'APPROVE_BASELINE_CHANGE',
                payload: {
                    entityType,
                    entityId: entity.id,
                    approvedBy: 'Current User' // In real app, get from auth
                }
            });
            onClose();
        }
    };

    const handleReject = () => {
        if (confirm('Reject and discard these pending changes?')) {
            dispatch({
                type: 'REJECT_BASELINE_CHANGE',
                payload: { entityType, entityId: entity.id }
            });
            onClose();
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderFieldValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    const comparison = selectedBaselines[0] !== null && selectedBaselines[1] !== null
        ? compareBaselines(entity.id, selectedBaselines[0], selectedBaselines[1], entityType)
        : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-bg-card p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto border border-border-color">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FaHistory /> Baseline History
                        </h3>
                        <p className="text-sm text-muted">
                            Current: Baseline {entity.currentBaseline || 0}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-text-primary">
                        <FaTimes />
                    </button>
                </div>

                {/* Pending Changes Alert */}
                {hasPendingChanges && (
                    <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <FaExclamationCircle className="text-yellow-500 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-yellow-500 mb-2">Pending Changes</h4>
                                <p className="text-sm text-muted mb-3">
                                    There are unapproved changes waiting for review.
                                </p>
                                <div className="bg-bg-primary p-3 rounded text-xs space-y-1 mb-3">
                                    {Object.entries(entity.pendingChanges).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="font-medium text-text-primary">{key}:</span>
                                            <span className="text-muted">{renderFieldValue(value)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleApprove}
                                        className="btn btn-primary text-sm flex items-center gap-2"
                                    >
                                        <FaCheck /> Approve Changes
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="btn btn-outline text-sm"
                                    >
                                        Reject Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Baseline History List */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-3">Baseline Versions</h4>
                    <div className="space-y-2">
                        {history.length === 0 ? (
                            <p className="text-sm text-muted italic">No baseline history available</p>
                        ) : (
                            history.map((baseline) => (
                                <div
                                    key={baseline.version}
                                    className={`p-3 rounded border ${baseline.version === entity.currentBaseline
                                            ? 'border-accent bg-accent bg-opacity-5'
                                            : 'border-border-color bg-bg-primary'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-text-primary">
                                                Baseline {baseline.version}
                                                {baseline.version === entity.currentBaseline && (
                                                    <span className="ml-2 text-xs bg-accent text-white px-2 py-1 rounded">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted mt-1">
                                                {formatDate(baseline.timestamp)} • Approved by: {baseline.approvedBy}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="text-xs bg-bg-primary border border-border-color rounded px-2 py-1"
                                                value={selectedBaselines.includes(baseline.version) ? baseline.version : ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (selectedBaselines[0] === null) {
                                                        setSelectedBaselines([val, null]);
                                                    } else if (selectedBaselines[1] === null) {
                                                        setSelectedBaselines([selectedBaselines[0], val]);
                                                    } else {
                                                        setSelectedBaselines([val, null]);
                                                    }
                                                }}
                                            >
                                                <option value="">Compare</option>
                                                <option value={baseline.version}>Select</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Comparison View */}
                {comparison && (
                    <div className="mt-4 border-t border-border-color pt-4">
                        <h4 className="text-sm font-semibold mb-3">
                            Comparing Baseline {comparison.baseline1.version} vs Baseline {comparison.baseline2.version}
                        </h4>
                        {Object.keys(comparison.changes).length === 0 ? (
                            <p className="text-sm text-muted italic">No changes between these baselines</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(comparison.changes).map(([field, change]) => (
                                    <div key={field} className="bg-bg-primary p-3 rounded text-xs">
                                        <div className="font-semibold text-text-primary mb-2">{field}</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-muted mb-1">Before (v{comparison.baseline1.version}):</div>
                                                <div className="bg-red-500 bg-opacity-10 p-2 rounded text-red-500">
                                                    {renderFieldValue(change.before)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-muted mb-1">After (v{comparison.baseline2.version}):</div>
                                                <div className="bg-green-500 bg-opacity-10 p-2 rounded text-green-500">
                                                    {renderFieldValue(change.after)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="btn btn-outline text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaselineViewer;
