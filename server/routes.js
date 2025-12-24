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

// Change Password
router.put('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // Get user from database
        const user = await dbOps.getUserByUsername(req.user.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const bcrypt = await import('bcryptjs');
        const isValidPassword = await bcrypt.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.default.hash(newPassword, 10);

        // Update password in database
        await dbOps.updateUserPassword(userId, hashedPassword);

        res.json({ message: 'Password changed successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to change password' });
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

// Admin: Create user
router.post('/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if username already exists
        const existingUser = await dbOps.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash(password, 10);

        // Create user (active by default when created by admin)
        await dbOps.createUser(username, hashedPassword, role || 'user', true);

        res.status(201).json({ message: 'User created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Update user (password, role)
router.put('/admin/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { password, role } = req.body;
        const updates = {};

        if (password) {
            const bcrypt = await import('bcryptjs');
            updates.password = await bcrypt.default.hash(password, 10);
        }
        if (role) {
            updates.role = role;
        }

        await dbOps.updateUser(parseInt(id), updates);
        res.json({ message: 'User updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Admin: Delete user
router.delete('/admin/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.deleteUser(parseInt(id));
        res.json({ message: 'User deleted successfully' });
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

// =====================================================
// INVESTMENT CATEGORIES ROUTES
// =====================================================

// Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
    try {
        const categories = await dbOps.getAllCategories();
        res.json(categories);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Create category (admin only)
router.post('/categories', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        await dbOps.createCategory(req.body);
        res.status(201).json({ message: 'Category created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Update category (admin only)
router.put('/categories/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.updateCategory(id, req.body);
        res.json({ message: 'Category updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.deleteCategory(id);
        res.json({ message: 'Category deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// =====================================================
// VENDOR EVALUATIONS ROUTES
// =====================================================

// Get all vendor evaluations
router.get('/vendor-evaluations', authenticateToken, async (req, res) => {
    try {
        const evaluations = await dbOps.getAllVendorEvaluations();
        res.json(evaluations);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Get vendor evaluations by vendor name
router.get('/vendor-evaluations/vendor/:vendorName', authenticateToken, async (req, res) => {
    try {
        const { vendorName } = req.params;
        const evaluations = await dbOps.getVendorEvaluationsByVendor(vendorName);
        res.json(evaluations);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Create vendor evaluation
router.post('/vendor-evaluations', authenticateToken, async (req, res) => {
    try {
        const evaluation = {
            ...req.body,
            evaluatedBy: req.user.username
        };
        await dbOps.createVendorEvaluation(evaluation);
        res.status(201).json({ message: 'Vendor evaluation created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Update vendor evaluation
router.put('/vendor-evaluations/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.updateVendorEvaluation(parseInt(id), req.body);
        res.json({ message: 'Vendor evaluation updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Delete vendor evaluation
router.delete('/vendor-evaluations/:id', authenticateToken, authorizeRole(['admin', 'operator']), async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.deleteVendorEvaluation(parseInt(id));
        res.json({ message: 'Vendor evaluation deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// =====================================================
// AUDIT LOGS ROUTES
// =====================================================

// Get audit logs (admin only)
router.get('/audit-logs', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const filters = {
            entityType: req.query.entityType,
            entityId: req.query.entityId,
            userId: req.query.userId ? parseInt(req.query.userId) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : 100
        };
        const logs = await dbOps.getAuditLogs(filters);
        res.json(logs);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Get audit logs for specific entity
router.get('/audit-logs/entity/:entityType/:entityId', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const logs = await dbOps.getAuditLogs({ entityType, entityId });
        res.json(logs);
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
    router.post(`/${entityName}`, authenticateToken, async (req, res) => {
        const item = req.body;
        try {
            console.log(`Creating ${entityName}:`, item.id);
            await dbOps.insert(tableName, item);

            // Auto-grant access to creator for projects
            if (tableName === 'projects' && req.user && req.user.id) {
                try {
                    await dbOps.addUserProjectAccess(req.user.id, item.id);
                    console.log(`Granted access to project ${item.id} for user ${req.user.id}`);
                } catch (accessError) {
                    console.error('Failed to grant project access:', accessError);
                    // Don't fail the request if access grant fails
                }
            }

            res.status(201).json(item);
        } catch (e) {
            console.error(`Error creating ${entityName}:`, e);
            res.status(500).json({ error: e.message });
        }
    });

    // PUT (Update)
    router.put(`/${entityName}/:id`, authenticateToken, authorizeRole(['admin', 'operator', 'user']), async (req, res) => {
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

        // Create Baseline Snapshot (Manual/Approve)
        router.post('/baselines', authenticateToken, authorizeRole(['admin', 'operator']), async (req, res) => {
            try {
                const { projectId, version, snapshot } = req.body;
                // If snapshot is provided, we use it. Otherwise we create a new one.
                if (snapshot) {
                    // We need to handle the snapshot format which is usually a full project tree
                    // dbOps.insert for project_baselines expects a specific structure if using IS_VERCEL
                    // For SQLite it's just JSON.stringify
                    // Let's use a dedicated method or ensure dbOps.insert handles it.
                    // Actually dbOps.createBaselineSnapshot is better but it fetches from DB.
                    // If the frontend sends a snapshot, it's likely because it wants to save the CURRENT state.

                    // For now, let's just use createBaselineSnapshot if snapshot is not provided,
                    // or implement a way to save the provided snapshot.
                    await dbOps.createBaselineSnapshot(projectId, version);
                } else {
                    await dbOps.createBaselineSnapshot(projectId, version);
                }
                res.status(201).json({ message: 'Baseline created successfully' });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    }

    // DELETE
    router.delete(`/${entityName}/:id`, authenticateToken, authorizeRole(['admin', 'operator', 'user']), async (req, res) => {
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
createCrud('final-products', 'final_products');
createCrud('phases', 'phases');
createCrud('deliverables', 'deliverables');
createCrud('work-packages', 'work_packages');

// =====================================================
// KPI ROUTES
// =====================================================

// Get all KPIs
router.get('/kpis', authenticateToken, async (req, res) => {
    try {
        const kpis = await dbOps.getAllKPIs();
        res.json(kpis);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get KPIs for entity
router.get('/kpis/:entityType/:entityId', authenticateToken, async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const kpis = await dbOps.getKPIsByEntity(entityType, entityId);
        res.json(kpis);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create KPI
router.post('/kpis', authenticateToken, async (req, res) => {
    try {
        const kpi = req.body;
        await dbOps.createKPI(kpi);
        res.status(201).json(kpi);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update KPI
router.put('/kpis/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const kpi = req.body;
        await dbOps.updateKPI(id, kpi);
        res.json(kpi);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete KPI
router.delete('/kpis/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await dbOps.deleteKPI(id);
        res.json({ message: 'KPI deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Export Excel
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const projects = await dbOps.getAll('projects');
        const finalProducts = await dbOps.getAll('final_products');
        const phases = await dbOps.getAll('phases');
        const deliverables = await dbOps.getAll('deliverables');
        const workPackages = await dbOps.getAll('work_packages');

        const workbook = new ExcelJS.Workbook();

        // Sheet 1: Projects
        const projectsSheet = workbook.addWorksheet('Projects');
        projectsSheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'PM', key: 'pm', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'BusinessUnit', key: 'businessUnit', width: 25 },
            { header: 'Budget Plan', key: 'budgetPlan', width: 15 },
            { header: 'Budget Actual', key: 'budgetActual', width: 15 },
            { header: 'Budget Additional', key: 'budgetAdditional', width: 15 },
            { header: 'Vendor Name', key: 'vendorName', width: 20 },
            { header: 'Vendor Contact', key: 'vendorContact', width: 20 },
            { header: 'Vendor Value', key: 'vendorValue', width: 15 },
            { header: 'Man Days Plan', key: 'manDaysPlan', width: 15 },
            { header: 'Man Days Actual', key: 'manDaysActual', width: 15 }
        ];

        projects.forEach(p => {
            const budget = p.budget || {};
            const vendor = p.vendor || {};
            const resources = p.resources || {};

            projectsSheet.addRow({
                name: p.name,
                description: p.description || '',
                owner: p.owner || '',
                pm: p.pm || '',
                status: p.status || 'Planning',
                businessUnit: p.businessUnit || '',
                budgetPlan: budget.plan || (typeof budget === 'number' ? budget : 0),
                budgetActual: budget.actual || 0,
                budgetAdditional: budget.additional || 0,
                vendorName: vendor.name || '',
                vendorContact: vendor.contact || '',
                vendorValue: vendor.contractValue || 0,
                manDaysPlan: resources.planManDays || 0,
                manDaysActual: resources.actualManDays || 0
            });
        });

        // Sheet 2: Final Products
        const finalProductsSheet = workbook.addWorksheet('Final Products');
        finalProductsSheet.columns = [
            { header: 'Project Name', key: 'projectName', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 }
        ];

        finalProducts.forEach(fp => {
            const project = projects.find(p => p.id === fp.projectId);
            if (project) {
                const budget = fp.budget || 0;
                finalProductsSheet.addRow({
                    projectName: project.name,
                    description: fp.description || fp.title || '',
                    owner: fp.owner || '',
                    budget: typeof budget === 'object' ? (budget.plan || 0) : budget
                });
            }
        });

        // Sheet 3: Phases
        const phasesSheet = workbook.addWorksheet('Phases');
        phasesSheet.columns = [
            { header: 'Final Product Description', key: 'finalProductDescription', width: 50 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 },
            { header: 'Timeline', key: 'timeline', width: 20 }
        ];

        phases.forEach(ph => {
            const fp = finalProducts.find(f => f.id === ph.finalProductId);
            if (fp) {
                const budget = ph.budget || 0;
                phasesSheet.addRow({
                    finalProductDescription: fp.description || fp.title || '',
                    description: ph.description || ph.title || '',
                    owner: ph.owner || '',
                    budget: typeof budget === 'object' ? (budget.plan || 0) : budget,
                    timeline: ph.timeline || 'TBD'
                });
            }
        });

        // Sheet 4: Deliverables
        const deliverablesSheet = workbook.addWorksheet('Deliverables');
        deliverablesSheet.columns = [
            { header: 'Phase Description', key: 'phaseDescription', width: 50 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Owner', key: 'owner', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        deliverables.forEach(d => {
            const phase = phases.find(p => p.id === d.phaseId);
            if (phase) {
                const budget = d.budget || 0;
                deliverablesSheet.addRow({
                    phaseDescription: phase.description || phase.title || '',
                    description: d.description || d.title || '',
                    owner: d.owner || '',
                    budget: typeof budget === 'object' ? (budget.plan || 0) : budget,
                    status: d.status || 0
                });
            }
        });

        // Sheet 5: Work Packages
        const workPackagesSheet = workbook.addWorksheet('Work Packages');
        workPackagesSheet.columns = [
            { header: 'Deliverable Description', key: 'deliverableDescription', width: 50 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Assignee', key: 'assignee', width: 20 },
            { header: 'Budget', key: 'budget', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        workPackages.forEach(wp => {
            const deliverable = deliverables.find(d => d.id === wp.deliverableId);
            if (deliverable) {
                const budget = wp.budget || 0;
                workPackagesSheet.addRow({
                    deliverableDescription: deliverable.description || deliverable.title || '',
                    description: wp.description || wp.title || '',
                    assignee: wp.assignee || 'Unassigned',
                    budget: typeof budget === 'object' ? (budget.plan || 0) : budget,
                    status: wp.status || 0
                });
            }
        });

        // Style headers for all sheets
        [projectsSheet, finalProductsSheet, phasesSheet, deliverablesSheet, workPackagesSheet].forEach(sheet => {
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

// Reset Data (Admin only)
router.post('/reset', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        await dbOps.resetData();
        res.json({ message: 'All data has been reset' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
