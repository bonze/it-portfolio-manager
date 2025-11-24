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

// Helper for CRUD
const createCrud = (entityName, tableName) => {
    // GET All
    router.get(`/${entityName}`, authenticateToken, async (req, res) => {
        try {
            const data = await dbOps.getAll(tableName);
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
            await dbOps.update(tableName, id, item);
            res.json(item);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

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

        const templatePath = path.join(__dirname, '../public/project_template.xlsx');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ error: 'Template not found' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet(1) || workbook.addWorksheet('Export');

        let rowId = 2;
        const lastRow = worksheet.lastRow ? worksheet.lastRow.number : 1;
        rowId = lastRow + 1;

        projects.forEach(p => {
            const pGoals = goals.filter(g => g.projectId === p.id);
            if (pGoals.length === 0) {
                worksheet.getRow(rowId).values = [p.name, '', '', '', ''];
                rowId++;
            }
            pGoals.forEach(g => {
                const gScopes = scopes.filter(s => s.goalId === g.id);
                if (gScopes.length === 0) {
                    worksheet.getRow(rowId).values = [p.name, g.title, '', '', ''];
                    rowId++;
                }
                gScopes.forEach(s => {
                    const sDeliverables = deliverables.filter(d => d.scopeIds ? d.scopeIds.includes(s.id) : d.scopeId === s.id);
                    if (sDeliverables.length === 0) {
                        worksheet.getRow(rowId).values = [p.name, g.title, s.title, '', ''];
                        rowId++;
                    }
                    sDeliverables.forEach(d => {
                        worksheet.getRow(rowId).values = [
                            p.name,
                            g.title,
                            s.title,
                            d.title,
                            d.status + '%',
                            d.startDate,
                            d.endDate,
                            d.budget ? (d.budget.plan || d.budget) : ''
                        ];
                        rowId++;
                    });
                });
            });
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
