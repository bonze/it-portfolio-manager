import express from 'express';
import { dbOps } from './db.js';
import { login, authenticateToken, authorizeRole } from './auth.js';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auth
router.post('/login', login);

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await dbOps.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash(password, 10);

        // Insert new user with 'user' role and inactive status (requires admin approval)
        await dbOps.createUser(username, hashedPassword, 'user', false);

        res.status(201).json({ message: 'Registration successful! Your account is pending admin approval.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Admin: Get all users
router.get('/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const users = await dbOps.getAllUsers();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Activate user
router.put('/admin/users/:id/activate', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.updateUserStatus(parseInt(id), true);
        res.json({ message: 'User activated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Deactivate user
router.put('/admin/users/:id/deactivate', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.updateUserStatus(parseInt(id), false);
        res.json({ message: 'User deactivated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Get user's project access
router.get('/admin/users/:id/projects', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const projectIds = await dbOps.getUserProjectAccess(parseInt(id));
        res.json({ projectIds });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Set user's project access
router.put('/admin/users/:id/projects', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { projectIds } = req.body;
        await dbOps.setUserProjectAccess(parseInt(id), projectIds || []);
        res.json({ message: 'Project access updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Helper for CRUD
const createCrud = (entityName, tableName) => {
    // GET All
    router.get(`/${entityName}`, authenticateToken, async (req, res) => {
        try {
            let data;
            // For projects, filter by user access
            if (tableName === 'projects') {
                data = await dbOps.getProjectsByUserAccess(req.user.id, req.user.role);
            } else {
                data = await dbOps.getAll(tableName);
            }
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // POST (Create)
    router.post(`/${entityName}`, authenticateToken, authorizeRole(['admin', 'operator']), async (req, res) => {
        const item = req.body;
        try {
            await dbOps.insert(tableName, item);
            res.status(201).json(item);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    });

    // PUT (Update)
    router.put(`/${entityName}/:id`, authenticateToken, authorizeRole(['admin', 'operator']), async (req, res) => {
        const { id } = req.params;
        const item = req.body;
        try {
            // Check if this is a project update and if baseline changed
            if (tableName === 'projects') {
                const currentProject = await dbOps.getAll('projects').then(projects => projects.find(p => p.id === id));
                const currentBaseline = currentProject ? (currentProject.baseline || 0) : 0;
                const newBaseline = item.baseline || 0;

                // If baseline incremented, create snapshot BEFORE updating (or after? usually snapshot represents the state AT that version)
                // Actually, if we approve changes, we are saying "Current state is now v1". So we should save the state.
                // But usually 'baseline' means "This is the plan for v1".
                // So if we increment to v1, we snapshot the CURRENT state as v1.
                if (newBaseline > currentBaseline) {
                    // Update the project first to save the new baseline number
                    await dbOps.update(tableName, id, item);
                    // Then snapshot everything
                    await dbOps.createBaselineSnapshot(id, newBaseline);
                    return res.json(item);
                }
            }

            await dbOps.update(tableName, id, item);
            res.json(item);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Get Project Baselines
    if (tableName === 'projects') {
        router.get('/projects/:id/baselines', authenticateToken, async (req, res) => {
            try {
                const { id } = req.params;
                const baselines = await dbOps.getProjectBaselines(id);
                res.json(baselines);
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }

    // DELETE
    router.delete(`/${entityName}/:id`, authenticateToken, authorizeRole(['admin', 'operator']), async (req, res) => {
        const { id } = req.params;
        try {
            await dbOps.delete(tableName, id);
            res.json({ message: 'Deleted' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
};

createCrud('projects', 'projects');
createCrud('goals', 'goals');
createCrud('scopes', 'scopes');
createCrud('deliverables', 'deliverables');

// Export Excel
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const projects = await dbOps.getAll('projects');
        const goals = await dbOps.getAll('goals');
        const scopes = await dbOps.getAll('scopes');
        const deliverables = await dbOps.getAll('deliverables');

        const workbook = new ExcelJS.Workbook();

        // Sheet 1: Projects
        const projectsSheet = workbook.addWorksheet('Projects');
        projectsSheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'BusinessUnit', key: 'businessUnit', width: 25 },
            { header: 'Budget', key: 'budget', width: 15 }
        ];

        projects.forEach(p => {
            projectsSheet.addRow({
                name: p.name,
                description: p.description || '',
                owner: p.owner || '',
                status: p.status || 'Planning',
                businessUnit: p.businessUnit || '',
                budget: p.budget || 0
            });
        });

        // Sheet 2: Goals
        const goalsSheet = workbook.addWorksheet('Goals');
        goalsSheet.columns = [
            { header: 'Project Name', key: 'projectName', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 }
        ];

        goals.forEach(g => {
            const project = projects.find(p => p.id === g.projectId);
            if (project) {
                goalsSheet.addRow({
                    projectName: project.name,
                    description: g.description || g.title || '',
                    owner: g.owner || '',
                    budget: g.budget || 0
                });
            }
        });

        // Sheet 3: Scopes
        const scopesSheet = workbook.addWorksheet('Scopes');
        scopesSheet.columns = [
            { header: 'Goal Description', key: 'goalDescription', width: 50 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 },
            { header: 'Timeline', key: 'timeline', width: 20 }
        ];

        scopes.forEach(s => {
            const goal = goals.find(g => g.id === s.goalId);
            if (goal) {
                scopesSheet.addRow({
                    goalDescription: goal.description || goal.title || '',
                    description: s.description || s.title || '',
                    owner: s.owner || '',
                    budget: s.budget || 0,
                    timeline: s.timeline || 'TBD'
                });
            }
        });

        // Sheet 4: Deliverables
        const deliverablesSheet = workbook.addWorksheet('Deliverables');
        deliverablesSheet.columns = [
            { header: 'Scope Description(s)', key: 'scopeDescriptions', width: 50 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Assignee', key: 'assignee', width: 20 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        deliverables.forEach(d => {
            // Get scope descriptions
            const scopeIds = d.scopeIds || (d.scopeId ? [d.scopeId] : []);
            const scopeDescriptions = scopeIds
                .map(scopeId => {
                    const scope = scopes.find(s => s.id === scopeId);
                    return scope ? (scope.description || scope.title || '') : '';
                })
                .filter(desc => desc)
                .join(', ');

            if (scopeDescriptions) {
                deliverablesSheet.addRow({
                    scopeDescriptions,
                    description: d.description || d.title || '',
                    assignee: d.assignee || 'Unassigned',
                    owner: d.owner || '',
                    budget: d.budget || 0,
                    status: d.status || 0
                });
            }
        });

        // Style headers for all sheets
        [projectsSheet, goalsSheet, scopesSheet, deliverablesSheet].forEach(sheet => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=portfolio_export.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
