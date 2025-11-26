import React, { useState, useEffect } from 'react';
import '../styles/BaselineModal.css';

const BaselineModal = ({ project, onClose, onUpdate, userRole }) => {
    const [baseline, setBaseline] = useState(project.baseline || 0);
    const [manualOverride, setManualOverride] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            onClose();
        } catch (err) {
            setError('Failed to update baseline: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = userRole === 'admin';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content baseline-modal" onClick={e => e.stopPropagation()}>
                <h2>Manage Baseline: {project.name}</h2>

                <div className="current-baseline">
                    <span className="label">Current Version:</span>
                    <span className="value">v{project.baseline || 0}</span>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="baseline-actions">
                    <div className="action-section">
                        <h3>Approve Changes</h3>
                        <p>Approve current changes and increment baseline version.</p>
                        <button
                            className="btn btn-success"
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
                                        Set Baseline
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default BaselineModal;
