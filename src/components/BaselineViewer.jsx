import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaChevronRight, FaArrowLeft, FaEye, FaClock } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import '../styles/BaselineViewer.css';

const BaselineViewer = ({ entity, snapshot, onClose, isOpen = true }) => {
    const { calculateCompletion, calculateTimeline } = useStore();
    const [history, setHistory] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(snapshot || null);
    const [loading, setLoading] = useState(false);
    const [expandedGoals, setExpandedGoals] = useState({});

    useEffect(() => {
        if (snapshot) {
            setSelectedSnapshot(snapshot);
        }
    }, [snapshot]);

    useEffect(() => {
        if (isOpen && entity && !snapshot) {
            fetchHistory();
        }
    }, [isOpen, entity, snapshot]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/projects/${entity.id}/baselines`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch baselines:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleGoal = (goalId) => {
        setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const handleBack = () => {
        if (snapshot) {
            onClose();
        } else {
            setSelectedSnapshot(null);
        }
    };

    const renderTimeline = (entityId, type, data) => {
        const timeline = calculateTimeline(entityId, type, data);
        if (!timeline.startDate && !timeline.endDate) return null;

        return (
            <div className="text-xs text-muted flex items-center gap-1 mt-1">
                <FaClock size={10} />
                <span>{formatDate(timeline.startDate)} - {formatDate(timeline.endDate)}</span>
                {timeline.actualStartDate && (
                    <span className="ml-2 text-success">
                        Actual: {formatDate(timeline.actualStartDate)} - {formatDate(timeline.actualEndDate) || '...'}
                    </span>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay viewer-overlay" onClick={onClose}>
            <div className="modal-content viewer-content" onClick={e => e.stopPropagation()}>
                {selectedSnapshot ? (
                    // Detail View
                    <>
                        <div className="viewer-header">
                            <div className="flex items-center gap-3">
                                <button onClick={handleBack} className="back-btn" title="Back">
                                    <FaArrowLeft />
                                </button>
                                <div>
                                    <h2>Baseline v{selectedSnapshot.version}</h2>
                                    <span className="meta-info">Created: {selectedSnapshot.createdAt ? new Date(selectedSnapshot.createdAt).toLocaleString() : '-'}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="close-btn"><FaTimes /></button>
                        </div>

                        <div className="viewer-body">
                            <div className="project-summary section">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3>Project: {selectedSnapshot.project.name}</h3>
                                        <p className="project-desc">{selectedSnapshot.project.description}</p>
                                    </div>
                                    <div className={`status-badge status-${calculateCompletion(selectedSnapshot.project.id, 'project', selectedSnapshot) >= 100 ? 'completed' : 'pending'}`}>
                                        {calculateCompletion(selectedSnapshot.project.id, 'project', selectedSnapshot)}%
                                    </div>
                                </div>
                                {renderTimeline(selectedSnapshot.project.id, 'project', selectedSnapshot)}
                                <div className="meta-grid mt-4">
                                    <div className="meta-item">
                                        <label>Owner</label>
                                        <span>{selectedSnapshot.project.owner || '-'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <label>Business Unit</label>
                                        <span>{selectedSnapshot.project.businessUnit || '-'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <label>Budget</label>
                                        <span>
                                            ${(typeof selectedSnapshot.project.budget === 'object'
                                                ? (selectedSnapshot.project.budget.plan || 0)
                                                : (selectedSnapshot.project.budget || 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="goals-section section">
                                <h3>WBS Structure</h3>
                                {(!selectedSnapshot.finalProducts || selectedSnapshot.finalProducts.length === 0) ? <p className="text-muted">No final products recorded.</p> : (
                                    <div className="goals-list">
                                        {selectedSnapshot.finalProducts.map(fp => (
                                            <div key={fp.id} className="goal-item-viewer">
                                                <div className="goal-header" onClick={() => toggleGoal(fp.id)}>
                                                    <div className="flex items-center gap-2">
                                                        {expandedGoals[fp.id] ? <FaChevronDown /> : <FaChevronRight />}
                                                        <span className="font-medium">{fp.description}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-muted">Owner: {fp.owner}</span>
                                                        <span className="badge badge-sm">{calculateCompletion(fp.id, 'final-product', selectedSnapshot)}%</span>
                                                    </div>
                                                </div>

                                                {expandedGoals[fp.id] && (
                                                    <div className="goal-content">
                                                        {renderTimeline(fp.id, 'final-product', selectedSnapshot)}
                                                        {/* Phases for this final product */}
                                                        {(selectedSnapshot.phases || []).filter(ph => ph.finalProductId === fp.id).map(phase => (
                                                            <div key={phase.id} className="scope-item-viewer">
                                                                <div className="scope-header flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="badge">Phase</span>
                                                                        <span>{phase.description}</span>
                                                                    </div>
                                                                    <span className="badge badge-sm">{calculateCompletion(phase.id, 'phase', selectedSnapshot)}%</span>
                                                                </div>
                                                                {renderTimeline(phase.id, 'phase', selectedSnapshot)}

                                                                {/* Deliverables for this phase */}
                                                                <div className="deliverables-list mt-2">
                                                                    {(selectedSnapshot.deliverables || []).filter(d => d.phaseId === phase.id).map(del => (
                                                                        <div key={del.id} className="deliverable-item-viewer-container">
                                                                            <div className="deliverable-item-viewer flex justify-between items-center">
                                                                                <span>• {del.description}</span>
                                                                                <span className={`status-badge status-${calculateCompletion(del.id, 'deliverable', selectedSnapshot) >= 100 ? 'completed' : 'pending'}`}>
                                                                                    {calculateCompletion(del.id, 'deliverable', selectedSnapshot)}%
                                                                                </span>
                                                                            </div>
                                                                            {renderTimeline(del.id, 'deliverable', selectedSnapshot)}

                                                                            {/* Work Packages for this deliverable */}
                                                                            <div className="work-packages-list ml-4 border-l border-border-color pl-2 mt-1">
                                                                                {(selectedSnapshot.workPackages || []).filter(wp => wp.deliverableId === del.id).map(wp => (
                                                                                    <div key={wp.id} className="text-xs text-muted py-1">
                                                                                        <div className="flex justify-between">
                                                                                            <span>- {wp.description} ({wp.assignee})</span>
                                                                                            <span>{wp.status}%</span>
                                                                                        </div>
                                                                                        {renderTimeline(wp.id, 'work-package', selectedSnapshot)}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // List View
                    <>
                        <div className="viewer-header">
                            <div>
                                <h2>Version History</h2>
                                <span className="text-muted text-sm">Project: {entity?.name}</span>
                            </div>
                            <button onClick={onClose} className="close-btn"><FaTimes /></button>
                        </div>
                        <div className="viewer-body">
                            {loading ? (
                                <div className="p-4 text-center text-muted">Loading history...</div>
                            ) : history.length === 0 ? (
                                <div className="p-4 text-center text-muted">No baselines found.</div>
                            ) : (
                                <div className="space-y-2">
                                    {history.map(item => (
                                        <div key={item.id} className="bg-bg-secondary p-3 rounded flex justify-between items-center border border-border-color hover:border-accent transition-colors cursor-pointer" onClick={() => setSelectedSnapshot(item)}>
                                            <div>
                                                <div className="font-semibold text-accent">Version {item.version}</div>
                                                <div className="text-xs text-muted">{formatDate(item.createdAt)}</div>
                                            </div>
                                            <button className="btn btn-icon-only text-muted hover:text-white">
                                                <FaEye />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BaselineViewer;
