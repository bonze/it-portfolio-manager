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
    finalProducts: [
        { header: 'Project Name', key: 'projectName', width: 30 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 }
    ],
    phases: [
        { header: 'Final Product Description', key: 'finalProductDescription', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Timeline', key: 'timeline', width: 20 }
    ],
    deliverables: [
        { header: 'Phase Description', key: 'phaseDescription', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Status', key: 'status', width: 10 }
    ],
    workPackages: [
        { header: 'Deliverable Description', key: 'deliverableDescription', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Assignee', key: 'assignee', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Status', key: 'status', width: 10 }
    ]
};

// Generate Dynamic Sample Data
function generateSampleData() {
    const projects = [];
    const finalProducts = [];
    const phases = [];
    const deliverables = [];
    const workPackages = [];

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

        // Create 2-3 Final Products per Project
        const numFPs = 2 + (pIdx % 2); // 2 or 3
        for (let fp = 1; fp <= numFPs; fp++) {
            const fpDesc = `${p.name} - Product ${fp}`;
            finalProducts.push({
                projectName: p.name,
                description: fpDesc,
                owner: p.owner,
                budget: 30000
            });

            // Create 2-3 Phases per Final Product
            const numPhases = 2 + (fp % 2); // 2 or 3
            for (let ph = 1; ph <= numPhases; ph++) {
                const phaseDesc = `${fpDesc} - Phase ${ph}`;
                phases.push({
                    finalProductDescription: fpDesc,
                    description: phaseDesc,
                    owner: `Lead ${ph}`,
                    budget: 10000,
                    timeline: `Q${ph} 2025`
                });

                // Create 1-3 Deliverables per Phase
                const numDeliverables = 1 + (ph % 3); // 1, 2, or 3
                for (let d = 1; d <= numDeliverables; d++) {
                    const delDesc = `${phaseDesc} - Deliverable ${d}`;
                    deliverables.push({
                        phaseDescription: phaseDesc,
                        description: delDesc,
                        owner: `Lead ${ph}`,
                        budget: 5000,
                        status: 0 // Calculated from Work Packages
                    });

                    // Create 2-4 Work Packages per Deliverable
                    const numWPs = 2 + (d % 3); // 2, 3, or 4
                    for (let wp = 1; wp <= numWPs; wp++) {
                        workPackages.push({
                            deliverableDescription: delDesc,
                            description: `${delDesc} - WP ${wp}`,
                            assignee: `Dev ${wp}`,
                            budget: 1000,
                            status: (wp * 20) % 100
                        });
                    }
                }
            }
        }
    });

    return { projects, finalProducts, phases, deliverables, workPackages };
}

const SAMPLE_DATA = generateSampleData();

async function generateFile(filename, data = null) {
    const workbook = new ExcelJS.Workbook();

    // Create Sheets
    const projectsSheet = workbook.addWorksheet('Projects');
    const finalProductsSheet = workbook.addWorksheet('Final Products');
    const phasesSheet = workbook.addWorksheet('Phases');
    const deliverablesSheet = workbook.addWorksheet('Deliverables');
    const workPackagesSheet = workbook.addWorksheet('Work Packages');

    // Set Columns
    projectsSheet.columns = COLUMNS.projects;
    finalProductsSheet.columns = COLUMNS.finalProducts;
    phasesSheet.columns = COLUMNS.phases;
    deliverablesSheet.columns = COLUMNS.deliverables;
    workPackagesSheet.columns = COLUMNS.workPackages;

    // Style Headers
    [projectsSheet, finalProductsSheet, phasesSheet, deliverablesSheet, workPackagesSheet].forEach(sheet => {
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
        data.finalProducts.forEach(r => finalProductsSheet.addRow(r));
        data.phases.forEach(r => phasesSheet.addRow(r));
        data.deliverables.forEach(r => deliverablesSheet.addRow(r));
        data.workPackages.forEach(r => workPackagesSheet.addRow(r));
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
