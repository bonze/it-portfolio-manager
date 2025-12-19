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

// Sample Data
const SAMPLE_DATA = {
    projects: [
        {
            name: 'Digital Transformation 2025',
            description: 'Overhaul of legacy systems and migration to cloud',
            owner: 'John Doe',
            pm: 'Alice Smith',
            status: 'In Progress',
            businessUnit: 'IT',
            budgetPlan: 500000,
            budgetActual: 150000,
            budgetAdditional: 0,
            vendorName: 'TechCorp',
            vendorContact: 'sales@techcorp.com',
            vendorValue: 200000,
            manDaysPlan: 1000,
            manDaysActual: 250
        },
        {
            name: 'Mobile App Revamp',
            description: 'Redesign of customer facing mobile application',
            owner: 'Jane Roe',
            pm: 'Bob Jones',
            status: 'Planning',
            businessUnit: 'Marketing',
            budgetPlan: 150000,
            budgetActual: 0,
            budgetAdditional: 0,
            vendorName: 'AppStudio',
            vendorContact: 'contact@appstudio.com',
            vendorValue: 100000,
            manDaysPlan: 300,
            manDaysActual: 0
        }
    ],
    goals: [
        {
            projectName: 'Digital Transformation 2025',
            description: 'Migrate Core Database',
            owner: 'Mike Database',
            budget: 100000
        },
        {
            projectName: 'Digital Transformation 2025',
            description: 'Implement New CRM',
            owner: 'Sarah Sales',
            budget: 200000
        },
        {
            projectName: 'Mobile App Revamp',
            description: 'UI/UX Redesign',
            owner: 'Designer Dan',
            budget: 50000
        }
    ],
    scopes: [
        {
            goalDescription: 'Migrate Core Database',
            description: 'Schema Design',
            owner: 'Mike Database',
            budget: 20000,
            timeline: 'Q1 2025'
        },
        {
            goalDescription: 'Migrate Core Database',
            description: 'Data Migration Scripts',
            owner: 'Dev Dave',
            budget: 30000,
            timeline: 'Q2 2025'
        },
        {
            goalDescription: 'Implement New CRM',
            description: 'Vendor Selection',
            owner: 'Sarah Sales',
            budget: 10000,
            timeline: 'Q1 2025'
        }
    ],
    deliverables: [
        {
            scopeDescriptions: 'Schema Design',
            description: 'ERD Diagram',
            assignee: 'Architect Ann',
            owner: 'Mike Database',
            budget: 5000,
            status: 100
        },
        {
            scopeDescriptions: 'Schema Design',
            description: 'Database Setup Scripts',
            assignee: 'Dev Dave',
            owner: 'Mike Database',
            budget: 15000,
            status: 50
        },
        {
            scopeDescriptions: 'Data Migration Scripts',
            description: 'ETL Pipeline',
            assignee: 'Data Don',
            owner: 'Dev Dave',
            budget: 30000,
            status: 0
        }
    ]
};

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
