import React, { useState } from 'react';
import { FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../styles/BaselineViewer.css';

const BaselineViewer = ({ snapshot, onClose }) => {
    const { project, goals, scopes, deliverables, version, createdAt } = snapshot;
    const [expandedGoals, setExpandedGoals] = useState({});

    const toggleGoal = (goalId) => {
        setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="modal-overlay viewer-overlay" onClick={onClose}>
            <div className="modal-content viewer-content" onClick={e => e.stopPropagation()}>
                <div className="viewer-header">
                    <div>
                        <h2>Baseline v{version}</h2>
                        <span className="text-muted text-sm">Created: {formatDate(createdAt)}</span>
                    </div>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>

                <div className="viewer-body">
                    <div className="project-summary section">
                        <h3>Project: {project.name}</h3>
                        <p>{project.description}</p>
                        <div className="meta-grid">
                            <div className="meta-item">
                                <label>Owner</label>
                                <span>{project.owner || '-'}</span>
                            </div>
                            <div className="meta-item">
                                <label>Business Unit</label>
                                <span>{project.businessUnit || '-'}</span>
                            </div>
                            <div className="meta-item">
                                <label>Budget</label>
                                <span>${(project.budget || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="goals-section section">
                        <h3>Goals & Scope</h3>
                        {goals.length === 0 ? <p>No goals recorded.</p> : (
                            <div className="goals-list">
                                {goals.map(goal => (
                                    <div key={goal.id} className="goal-item-viewer">
                                        <div className="goal-header" onClick={() => toggleGoal(goal.id)}>
                                            {expandedGoals[goal.id] ? <FaChevronDown /> : <FaChevronRight />}
                                            <span className="font-medium">{goal.description}</span>
                                        </div>

                                        {expandedGoals[goal.id] && (
                                            <div className="goal-content">
                                                {/* Scopes for this goal */}
                                                {scopes.filter(s => s.goalId === goal.id).map(scope => (
                                                    <div key={scope.id} className="scope-item-viewer">
                                                        <div className="scope-header">
                                                            <span className="badge">Scope</span>
                                                            <span>{scope.description}</span>
                                                        </div>

                                                        {/* Deliverables for this scope */}
                                                        <div className="deliverables-list">
                                                            {deliverables.filter(d =>
                                                                d.scopeId === scope.id || (d.scopeIds && d.scopeIds.includes(scope.id))
                                                            ).map(del => (
                                                                <div key={del.id} className="deliverable-item-viewer">
                                                                    <span>• {del.description}</span>
                                                                    <span className="status-badge">{del.status}%</span>
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
            </div>
        </div>
    );
};

export default BaselineViewer;
