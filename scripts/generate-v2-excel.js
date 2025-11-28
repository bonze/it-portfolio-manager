import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWorkbook = async (isSample = false) => {
    const workbook = new ExcelJS.Workbook();

    // 0. Instructions Sheet
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.columns = [
        { header: 'Sheet', key: 'sheet', width: 15 },
        { header: 'Column Name', key: 'col', width: 25 },
        { header: 'Description', key: 'desc', width: 50 },
        { header: 'Example / Format', key: 'example', width: 30 }
    ];

    instructionsSheet.addRows([
        // Projects
        { sheet: 'Projects', col: 'Name', desc: 'Name of the project', example: 'Digital Transformation 2025' },
        { sheet: 'Projects', col: 'Description', desc: 'Brief description of the project', example: 'Overhaul of internal IT systems' },
        { sheet: 'Projects', col: 'BusinessUnit', desc: 'Department or Unit owning the project', example: 'IT Department' },
        { sheet: 'Projects', col: 'Owner', desc: 'Person responsible for the project success', example: 'CIO Office' },
        { sheet: 'Projects', col: 'PM', desc: 'Project Manager assigned', example: 'John Doe' },
        { sheet: 'Projects', col: 'Status', desc: 'Current status (Planning, In Progress, Completed, At Risk)', example: 'In Progress' },
        { sheet: 'Projects', col: 'Budget Plan', desc: 'Planned budget amount', example: '1000000 (Number)' },
        { sheet: 'Projects', col: 'Budget Actual', desc: 'Actual amount spent so far', example: '850000 (Number)' },
        { sheet: 'Projects', col: 'Budget Additional', desc: 'Any additional budget approved', example: '50000 (Number)' },
        { sheet: 'Projects', col: 'Vendor Name', desc: 'Name of the primary vendor/contractor', example: 'TechCorp Solutions' },
        { sheet: 'Projects', col: 'Vendor Contact', desc: 'Contact info for the vendor', example: 'contact@techcorp.com' },
        { sheet: 'Projects', col: 'Vendor Value', desc: 'Total contract value with the vendor', example: '900000 (Number)' },
        { sheet: 'Projects', col: 'Man Days Plan', desc: 'Planned effort in man-days', example: '500 (Number)' },
        { sheet: 'Projects', col: 'Man Days Actual', desc: 'Actual effort spent in man-days', example: '420 (Number)' },

        // Goals
        { sheet: 'Goals', col: 'Project Name', desc: 'Must match exactly a Name in Projects sheet', example: 'Digital Transformation 2025' },
        { sheet: 'Goals', col: 'Description', desc: 'Description of the strategic goal', example: 'Modernize Infrastructure' },
        { sheet: 'Goals', col: 'Owner', desc: 'Owner of this specific goal', example: 'Infra Team' },
        { sheet: 'Goals', col: 'Budget', desc: 'Budget allocated to this goal', example: '400000' },

        // Scopes
        { sheet: 'Scopes', col: 'Goal Description', desc: 'Must match exactly a Description in Goals sheet', example: 'Modernize Infrastructure' },
        { sheet: 'Scopes', col: 'Description', desc: 'Specific scope of work', example: 'Server Migration' },
        { sheet: 'Scopes', col: 'Timeline', desc: 'Expected timeline', example: 'Q1 2025' },

        // Deliverables
        { sheet: 'Deliverables', col: 'Scope Description(s)', desc: 'Match Scope Description. Comma separated for multiple.', example: 'Server Migration' },
        { sheet: 'Deliverables', col: 'Description', desc: 'Tangible deliverable item', example: 'Setup AWS Account' },
        { sheet: 'Deliverables', col: 'Assignee', desc: 'Person assigned to do the work', example: 'Alice' },
        { sheet: 'Deliverables', col: 'Status', desc: 'Completion percentage (0-100)', example: '100' }
    ]);

    // Style the header
    instructionsSheet.getRow(1).font = { bold: true };

    // 1. Projects Sheet
    const projectsSheet = workbook.addWorksheet('Projects');
    projectsSheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'desc', width: 40 },
        { header: 'BusinessUnit', key: 'unit', width: 20 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'PM', key: 'pm', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Budget Plan', key: 'budgetPlan', width: 15 },
        { header: 'Budget Actual', key: 'budgetActual', width: 15 },
        { header: 'Budget Additional', key: 'budgetAdd', width: 15 },
        { header: 'Vendor Name', key: 'vendorName', width: 25 },
        { header: 'Vendor Contact', key: 'vendorContact', width: 25 },
        { header: 'Vendor Value', key: 'vendorValue', width: 15 },
        { header: 'Man Days Plan', key: 'mdPlan', width: 15 },
        { header: 'Man Days Actual', key: 'mdActual', width: 15 }
    ];

    if (isSample) {
        projectsSheet.addRows([
            {
                name: 'Digital Transformation 2025',
                desc: 'Overhaul of internal IT systems',
                unit: 'IT Department',
                owner: 'CIO Office',
                pm: 'John Doe',
                status: 'In Progress',
                budgetPlan: 1000000,
                budgetActual: 850000,
                budgetAdd: 50000,
                vendorName: 'TechCorp Solutions',
                vendorContact: 'contact@techcorp.com',
                vendorValue: 900000,
                mdPlan: 500,
                mdActual: 420
            },
            {
                name: 'Customer App Upgrade',
                desc: 'Upgrade mobile app to v2.0',
                unit: 'Product',
                owner: 'Product Team',
                pm: 'Sarah Smith',
                status: 'Planning',
                budgetPlan: 500000,
                budgetActual: 50000,
                budgetAdd: 0,
                vendorName: 'AppDev Studio',
                vendorContact: 'hello@appdev.io',
                vendorValue: 450000,
                mdPlan: 300,
                mdActual: 20
            },
            {
                name: 'Legacy System Migration',
                desc: 'Migrate old ERP to Cloud',
                unit: 'Operations',
                owner: 'Ops Director',
                pm: 'Mike Johnson',
                status: 'At Risk',
                budgetPlan: 200000,
                budgetActual: 190000,
                budgetAdd: 0,
                vendorName: 'Cloud Experts',
                vendorContact: 'support@cloudexperts.com',
                vendorValue: 180000,
                mdPlan: 150,
                mdActual: 140
            }
        ]);
    }

    // 2. Goals Sheet
    const goalsSheet = workbook.addWorksheet('Goals');
    goalsSheet.columns = [
        { header: 'Project Name', key: 'project', width: 30 },
        { header: 'Description', key: 'desc', width: 40 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 }
    ];

    if (isSample) {
        goalsSheet.addRows([
            { project: 'Digital Transformation 2025', desc: 'Modernize Infrastructure', owner: 'Infra Team', budget: 400000 },
            { project: 'Digital Transformation 2025', desc: 'Automate Workflows', owner: 'Dev Team', budget: 600000 },
            { project: 'Customer App Upgrade', desc: 'UI/UX Redesign', owner: 'Design Team', budget: 100000 },
            { project: 'Customer App Upgrade', desc: 'Backend API Rewrite', owner: 'Backend Team', budget: 400000 }
        ]);
    }

    // 3. Scopes Sheet
    const scopesSheet = workbook.addWorksheet('Scopes');
    scopesSheet.columns = [
        { header: 'Goal Description', key: 'goal', width: 40 },
        { header: 'Description', key: 'desc', width: 40 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Timeline', key: 'timeline', width: 20 }
    ];

    if (isSample) {
        scopesSheet.addRows([
            { goal: 'Modernize Infrastructure', desc: 'Server Migration', owner: 'SysAdmin', budget: 200000, timeline: 'Q1 2025' },
            { goal: 'Modernize Infrastructure', desc: 'Network Upgrade', owner: 'NetAdmin', budget: 200000, timeline: 'Q2 2025' },
            { goal: 'Automate Workflows', desc: 'CI/CD Pipeline', owner: 'DevOps', budget: 300000, timeline: 'Q3 2025' }
        ]);
    }

    // 4. Deliverables Sheet
    const deliverablesSheet = workbook.addWorksheet('Deliverables');
    deliverablesSheet.columns = [
        { header: 'Scope Description(s)', key: 'scope', width: 40 },
        { header: 'Description', key: 'desc', width: 40 },
        { header: 'Assignee', key: 'assignee', width: 20 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Status', key: 'status', width: 10 }
    ];

    if (isSample) {
        deliverablesSheet.addRows([
            { scope: 'Server Migration', desc: 'Setup AWS Account', assignee: 'Alice', owner: 'SysAdmin', budget: 5000, status: 100 },
            { scope: 'Server Migration', desc: 'Migrate Database', assignee: 'Bob', owner: 'DBA', budget: 50000, status: 80 },
            { scope: 'Network Upgrade', desc: 'Replace Firewalls', assignee: 'Charlie', owner: 'NetSec', budget: 100000, status: 20 },
            { scope: 'CI/CD Pipeline', desc: 'Setup Jenkins', assignee: 'Dave', owner: 'DevOps', budget: 20000, status: 0 }
        ]);
    }

    const fileName = isSample ? 'sample_data_v2.xlsx' : 'project_template_v2.xlsx';
    const filePath = path.join(__dirname, '..', 'public', fileName);

    await workbook.xlsx.writeFile(filePath);
    console.log(`Generated ${fileName} in public/`);
};

const run = async () => {
    await createWorkbook(false); // Template
    await createWorkbook(true);  // Sample Data
};

run().catch(console.error);
