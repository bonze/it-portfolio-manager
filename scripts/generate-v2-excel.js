import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWorkbook = async (isSample = false) => {
    const workbook = new ExcelJS.Workbook();

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
import ExcelJS from 'exceljs';
    import fs from 'fs';
    import path from 'path';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const createWorkbook = async (isSample = false) => {
        const workbook = new ExcelJS.Workbook();

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
