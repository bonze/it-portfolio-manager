import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

// Define Columns
const COLUMNS = {
    projects: [
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
    ],
    goals: [
        { header: 'Project Name', key: 'projectName', width: 30 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 }
    ],
    scopes: [
        { header: 'Goal Description', key: 'goalDescription', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Timeline', key: 'timeline', width: 20 }
    ],
    deliverables: [
        { header: 'Scope Description(s)', key: 'scopeDescriptions', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Assignee', key: 'assignee', width: 20 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Status', key: 'status', width: 10 }
    ]
};

// Generate Dynamic Sample Data
function generateSampleData() {
    const projects = [];
    const goals = [];
    const scopes = [];
    const deliverables = [];

    const projectList = [
        { name: 'Cloud Migration 2025', bu: 'Infrastructure', owner: 'John Doe' },
        { name: 'AI Customer Support', bu: 'Innovation', owner: 'Alice Smith' },
        { name: 'Enterprise Security Audit', bu: 'Security', owner: 'Bob Jones' },
        { name: 'Mobile App Redesign', bu: 'Product', owner: 'Jane Roe' },
        { name: 'Data Warehouse Revamp', bu: 'Data', owner: 'Mike Data' }
    ];

    projectList.forEach((p, pIdx) => {
        // Create Project
        projects.push({
            name: p.name,
            description: `Strategic initiative for ${p.bu}`,
            owner: p.owner,
            pm: `PM ${p.owner.split(' ')[0]}`,
            status: ['Planning', 'In Progress', 'On Hold'][pIdx % 3],
            businessUnit: p.bu,
            budgetPlan: 100000 * (pIdx + 1),
            budgetActual: 20000 * (pIdx + 1),
            budgetAdditional: 0,
            vendorName: `Vendor ${String.fromCharCode(65 + pIdx)}`,
            vendorContact: `contact@vendor${String.fromCharCode(65 + pIdx)}.com`,
            vendorValue: 50000 * (pIdx + 1),
            manDaysPlan: 100 * (pIdx + 1),
            manDaysActual: 20 * (pIdx + 1)
        });

        // Create 2-3 Goals per Project
        const numGoals = 2 + (pIdx % 2); // 2 or 3
        for (let g = 1; g <= numGoals; g++) {
            const goalDesc = `${p.name} - Goal ${g}`;
            goals.push({
                projectName: p.name,
                description: goalDesc,
                owner: p.owner,
                budget: 30000
            });

            // Create 2-3 Scopes per Goal
            const numScopes = 2 + (g % 2); // 2 or 3
            for (let s = 1; s <= numScopes; s++) {
                const scopeDesc = `${goalDesc} - Scope ${s}`;
                scopes.push({
                    goalDescription: goalDesc,
                    description: scopeDesc,
                    owner: `Lead ${s}`,
                    budget: 10000,
                    timeline: `Q${s} 2025`
                });

                // Create 1-3 Deliverables per Scope
                const numDeliverables = 1 + (s % 3); // 1, 2, or 3
                for (let d = 1; d <= numDeliverables; d++) {
                    deliverables.push({
                        scopeDescriptions: scopeDesc,
                        description: `${scopeDesc} - Deliverable ${d}`,
                        assignee: `Dev ${d}`,
                        owner: `Lead ${s}`,
                        budget: 5000,
                        status: (d * 20) % 100
                    });
                }
            }
        }
    });

    return { projects, goals, scopes, deliverables };
}

const SAMPLE_DATA = generateSampleData();

async function generateFile(filename, data = null) {
    const workbook = new ExcelJS.Workbook();

    // Create Sheets
    const projectsSheet = workbook.addWorksheet('Projects');
    const goalsSheet = workbook.addWorksheet('Goals');
    const scopesSheet = workbook.addWorksheet('Scopes');
    const deliverablesSheet = workbook.addWorksheet('Deliverables');

    // Set Columns
    projectsSheet.columns = COLUMNS.projects;
    goalsSheet.columns = COLUMNS.goals;
    scopesSheet.columns = COLUMNS.scopes;
    deliverablesSheet.columns = COLUMNS.deliverables;

    // Style Headers
    [projectsSheet, goalsSheet, scopesSheet, deliverablesSheet].forEach(sheet => {
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
    });

    // Add Data if provided
    if (data) {
        data.projects.forEach(r => projectsSheet.addRow(r));
        data.goals.forEach(r => goalsSheet.addRow(r));
        data.scopes.forEach(r => scopesSheet.addRow(r));
        data.deliverables.forEach(r => deliverablesSheet.addRow(r));
    }

    // Write File
    const filePath = path.join(PUBLIC_DIR, filename);
    await workbook.xlsx.writeFile(filePath);
    console.log(`Generated ${filename}`);
}

async function main() {
    try {
        // Generate Template (Empty)
        await generateFile('project_template.xlsx');

        // Generate Sample Data
        await generateFile('sample_data.xlsx', SAMPLE_DATA);

    } catch (error) {
        console.error('Error generating files:', error);
    }
}

main();
