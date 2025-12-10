import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaChevronRight, FaArrowLeft, FaEye } from 'react-icons/fa';
import '../styles/BaselineViewer.css';

const BaselineViewer = ({ entity, snapshot, onClose, isOpen = true }) => {
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
        return new Date(dateString).toLocaleString();
    };

    const handleBack = () => {
        if (snapshot) {
            onClose();
        } else {
            setSelectedSnapshot(null);
        }
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
                                    <span className="meta-info">Created: {formatDate(selectedSnapshot.createdAt)}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="close-btn"><FaTimes /></button>
                        </div>

                        <div className="viewer-body">
                            <div className="project-summary section">
                                <h3>Project: {selectedSnapshot.project.name}</h3>
                                <p className="project-desc">{selectedSnapshot.project.description}</p>
                                <div className="meta-grid">
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
                                <h3>Goals & Scope</h3>
                                {selectedSnapshot.goals.length === 0 ? <p className="text-muted">No goals recorded.</p> : (
                                    <div className="goals-list">
                                        {selectedSnapshot.goals.map(goal => (
                                            <div key={goal.id} className="goal-item-viewer">
                                                <div className="goal-header" onClick={() => toggleGoal(goal.id)}>
                                                    {expandedGoals[goal.id] ? <FaChevronDown /> : <FaChevronRight />}
                                                    <span className="font-medium">{goal.description}</span>
                                                </div>

                                                {expandedGoals[goal.id] && (
                                                    <div className="goal-content">
                                                        {/* Scopes for this goal */}
                                                        {selectedSnapshot.scopes.filter(s => s.goalId === goal.id).map(scope => (
                                                            <div key={scope.id} className="scope-item-viewer">
                                                                <div className="scope-header">
                                                                    <span className="badge">Scope</span>
                                                                    <span>{scope.description}</span>
                                                                </div>

                                                                {/* Deliverables for this scope */}
                                                                <div className="deliverables-list">
                                                                    {selectedSnapshot.deliverables.filter(d =>
                                                                        d.scopeId === scope.id || (d.scopeIds && d.scopeIds.includes(scope.id))
                                                                    ).map(del => (
                                                                        <div key={del.id} className="deliverable-item-viewer">
                                                                            <span>• {del.description}</span>
                                                                            <span className={`status-badge status-${del.status >= 100 ? 'completed' : 'pending'}`}>{del.status}%</span>
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
