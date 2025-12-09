import React, { useState } from 'react';
import '../styles/ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || '/api';

    // Password validation requirements
    const validatePassword = (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        return requirements;
    };

    const requirements = validatePassword(newPassword);
    const isPasswordValid = Object.values(requirements).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (!isPasswordValid) {
            setError('Password does not meet requirements');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Close modal after 2 seconds
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content change-password-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Change Password</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={loading || success}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading || success}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || success}
                            autoComplete="new-password"
                        />
                    </div>

                    {newPassword && (
                        <div className="password-requirements">
                            <p className="requirements-title">Password Requirements:</p>
                            <ul>
                                <li className={requirements.minLength ? 'valid' : 'invalid'}>
                                    {requirements.minLength ? '✓' : '✗'} At least 8 characters
                                </li>
                                <li className={requirements.hasUppercase ? 'valid' : 'invalid'}>
                                    {requirements.hasUppercase ? '✓' : '✗'} One uppercase letter
                                </li>
                                <li className={requirements.hasLowercase ? 'valid' : 'invalid'}>
                                    {requirements.hasLowercase ? '✓' : '✗'} One lowercase letter
                                </li>
                                <li className={requirements.hasNumber ? 'valid' : 'invalid'}>
                                    {requirements.hasNumber ? '✓' : '✗'} One number
                                </li>
                                <li className={requirements.hasSpecial ? 'valid' : 'invalid'}>
                                    {requirements.hasSpecial ? '✓' : '✗'} One special character
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || success || !isPasswordValid}
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
