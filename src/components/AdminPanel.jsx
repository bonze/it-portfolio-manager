import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // User Modal State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({ username: '', password: '', role: 'user' });

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
        setSuccess('');
        setUserProjects([]);

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

    // New User Management Functions
    const handleAddUser = () => {
        setEditingUser(null);
        setUserFormData({ username: '', password: '', role: 'user' });
        setShowUserModal(true);
        setError('');
        setSuccess('');
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserFormData({ username: user.username, password: '', role: user.role });
        setShowUserModal(true);
        setError('');
        setSuccess('');
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete user');
            setSuccess('User deleted successfully');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = editingUser
                ? `${API_URL}/admin/users/${editingUser.id}`
                : `${API_URL}/admin/users`;
            const method = editingUser ? 'PUT' : 'POST';

            const body = { ...userFormData };
            if (editingUser && !body.password) delete body.password; // Don't update password if empty in edit mode

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to save user');
            }

            setSuccess(`User ${editingUser ? 'updated' : 'created'} successfully`);
            setShowUserModal(false);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel - User Management</h1>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="users-table-container">
                <div className="flex justify-between items-center mb-4">
                    <h2>Users</h2>
                    <button onClick={handleAddUser} className="btn btn-primary flex items-center gap-2">
                        <FaPlus /> Add User
                    </button>
                </div>
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
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="btn btn-icon-only text-accent"
                                            title="Edit User"
                                        >
                                            <FaEdit />
                                        </button>

                                        {!user.isActive ? (
                                            <button
                                                onClick={() => handleActivate(user.id)}
                                                disabled={loading}
                                                className="btn btn-success btn-sm"
                                            >
                                                Activate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDeactivate(user.id)}
                                                disabled={loading}
                                                className="btn btn-warning btn-sm"
                                            >
                                                Deactivate
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleManageProjects(user)}
                                            className="btn btn-icon-only text-info"
                                            title="Manage Projects"
                                        >
                                            <FaProjectDiagram />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="btn btn-icon-only text-red-500"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Project Access Modal */}
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="flex justify-between items-center mb-4">
                            <h3>Manage Access: {selectedUser.username}</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-muted hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <p className="text-sm text-muted mb-3">Select projects this user can access:</p>
                        <div className="project-list">
                            {projects.map(project => (
                                <div key={project.id} className="project-item-select">
                                    <label className="project-checkbox-label flex items-center gap-2 cursor-pointer p-2 hover:bg-bg-secondary rounded">
                                        <input
                                            type="checkbox"
                                            checked={userProjects.includes(project.id)}
                                            onChange={() => toggleProjectAccess(project.id)}
                                            className="form-checkbox"
                                        />
                                        <span className="project-name">{project.name}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions mt-4 flex justify-end gap-2">
                            <button onClick={() => setSelectedUser(null)} className="btn btn-outline">Cancel</button>
                            <button onClick={handleSaveProjectAccess} disabled={loading} className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit User Modal */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setShowUserModal(false)} className="text-muted hover:text-white">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSaveUser} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-1">Username</label>
                                <input
                                    type="text"
                                    value={userFormData.username}
                                    onChange={e => setUserFormData({ ...userFormData, username: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary"
                                    required
                                    disabled={!!editingUser} // Cannot change username
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-1">
                                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    value={userFormData.password}
                                    onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary"
                                    required={!editingUser}
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-1">Role</label>
                                <select
                                    value={userFormData.role}
                                    onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}
                                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary"
                                >
                                    <option value="user">User</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setShowUserModal(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
                                    <FaSave /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
