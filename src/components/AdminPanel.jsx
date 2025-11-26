import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch projects');

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleActivate = async (userId) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to activate user');

            setSuccess('User activated successfully');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users/${userId}/deactivate`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to deactivate user');

            setSuccess('User deactivated successfully');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleManageProjects = async (user) => {
        setSelectedUser(user);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users/${user.id}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch user projects');

            const data = await response.json();
            setUserProjects(data.projectIds || []);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSaveProjectAccess = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/users/${selectedUser.id}/projects`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectIds: userProjects })
            });

            if (!response.ok) throw new Error('Failed to update project access');

            setSuccess('Project access updated successfully');
            setSelectedUser(null);
            setUserProjects([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleProjectAccess = (projectId) => {
        setUserProjects(prev => {
            if (prev.includes(projectId)) {
                return prev.filter(id => id !== projectId);
            } else {
                return [...prev, projectId];
            }
        });
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel - User Management</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="users-table-container">
                <h2>Users</h2>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {!user.isActive ? (
                                            <button
                                                onClick={() => handleActivate(user.id)}
                                                disabled={loading}
                                                className="btn btn-success"
                                            >
                                                Activate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDeactivate(user.id)}
                                                disabled={loading}
                                                className="btn btn-warning"
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleManageProjects(user)}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            Manage Projects
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Manage Project Access for {selectedUser.username}</h2>
                        <p className="modal-description">
                            Select which projects this user can access:
                        </p>

                        <div className="projects-list">
                            {projects.map(project => (
                                <label key={project.id} className="project-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={userProjects.includes(project.id)}
                                        onChange={() => toggleProjectAccess(project.id)}
                                    />
                                    <span>{project.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={handleSaveProjectAccess}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                disabled={loading}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
