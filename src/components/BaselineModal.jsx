import React, { useState, useEffect } from 'react';
import '../styles/BaselineModal.css';
import BaselineViewer from './BaselineViewer';
import { formatDate } from '../utils/dateFormat';

const BaselineModal = ({ project, onClose, onUpdate, userRole }) => {
    const [baseline, setBaseline] = useState(project.baseline || 0);
    const [manualOverride, setManualOverride] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        fetchHistory();
    }, [project.baseline]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/projects/${project.id}/baselines`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
    };

    const handleApprove = async () => {
        await updateBaseline(baseline + 1);
    };

    const handleManualUpdate = async () => {
        await updateBaseline(parseInt(baseline));
    };

    const updateBaseline = async (newBaseline) => {
        setLoading(true);
        setError('');
        try {
            await onUpdate(project.id, { ...project, baseline: newBaseline });
            // Refresh history after update (give API a moment to snapshot)
            setTimeout(fetchHistory, 500);
            onClose(); // Close modal on success
        } catch (err) {
            setError('Failed to update baseline: ' + err.message);
            setLoading(false);
        }
    };

    const isAdmin = userRole === 'admin';

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content baseline-modal" onClick={e => e.stopPropagation()}>
                    <h2>Manage Baseline: {project.name}</h2>

                    <div className="current-baseline">
                        <span className="label">Current Version:</span>
                        <span className="value">v{project.baseline || 0}</span>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="baseline-content-grid">
                        <div className="baseline-actions-col">
                            <div className="action-section">
                                <h3>Approve Changes</h3>
                                <p>Approve current changes and increment baseline version.</p>
                                <button
                                    className="btn btn-success full-width"
                                    onClick={handleApprove}
                                    disabled={loading || !isAdmin}
                                    title={!isAdmin ? "Only Admins can approve changes" : ""}
                                >
                                    Approve & Increment (v{(project.baseline || 0) + 1})
                                </button>
                            </div>

                            <div className="divider">OR</div>

                            <div className="action-section">
                                <h3>Manual Override</h3>
                                <div className="manual-input-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={manualOverride}
                                            onChange={e => setManualOverride(e.target.checked)}
                                            disabled={!isAdmin}
                                        />
                                        Enable Manual Edit
                                    </label>

                                    {manualOverride && (
                                        <div className="input-row">
                                            <input
                                                type="number"
                                                value={baseline}
                                                onChange={e => setBaseline(e.target.value)}
                                                min="0"
                                                className="form-input"
                                            />
                                            <button
                                                className="btn btn-warning"
                                                onClick={handleManualUpdate}
                                                disabled={loading}
                                            >
                                                Set
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="baseline-history-col">
                            <h3>History</h3>
                            <div className="history-list">
                                {history.length === 0 ? <p className="text-muted text-sm">No history recorded.</p> : (
                                    history.map(item => (
                                        <div key={item.id} className="history-item">
                                            <div className="history-info">
                                                <span className="history-ver">v{item.version}</span>
                                                <span className="history-date">{formatDate(item.createdAt)}</span>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setSelectedSnapshot(item)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>

            {selectedSnapshot && (
                <BaselineViewer
                    snapshot={selectedSnapshot}
                    onClose={() => setSelectedSnapshot(null)}
                />
            )}
        </>
    );
};

export default BaselineModal;
