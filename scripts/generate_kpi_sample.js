import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateKPISampleFile() {
    const workbook = new ExcelJS.Workbook();

    // Sheet: KPI Examples
    const kpiSheet = workbook.addWorksheet('KPI Examples');

    kpiSheet.columns = [
        { header: 'Entity Type', key: 'entityType', width: 20 },
        { header: 'Entity ID', key: 'entityId', width: 40 },
        { header: 'KPI Name', key: 'name', width: 40 },
        { header: 'Target', key: 'target', width: 15 },
        { header: 'Actual', key: 'actual', width: 15 },
        { header: 'Unit', key: 'unit', width: 15 },
        { header: 'Status', key: 'status', width: 15 }
    ];

    // Sample KPIs for different entity types
    const sampleKPIs = [
        // Project-level KPIs
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Overall Project Completion',
            target: 100,
            actual: 75,
            unit: '%',
            status: 'On Track'
        },
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Budget Utilization',
            target: 90,
            actual: 85,
            unit: '%',
            status: 'On Track'
        },
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Schedule Performance Index (SPI)',
            target: 1.0,
            actual: 0.95,
            unit: 'ratio',
            status: 'At Risk'
        },
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Cost Performance Index (CPI)',
            target: 1.0,
            actual: 1.05,
            unit: 'ratio',
            status: 'Ahead'
        },
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Defect Density',
            target: 5,
            actual: 3,
            unit: 'defects/KLOC',
            status: 'Ahead'
        },
        {
            entityType: 'project',
            entityId: 'project-001',
            name: 'Team Productivity',
            target: 80,
            actual: 85,
            unit: 'story points/sprint',
            status: 'Ahead'
        },

        // Final Product KPIs
        {
            entityType: 'final_product',
            entityId: 'fp-001',
            name: 'User Adoption Rate',
            target: 80,
            actual: 65,
            unit: '%',
            status: 'At Risk'
        },
        {
            entityType: 'final_product',
            entityId: 'fp-001',
            name: 'System Uptime',
            target: 99.9,
            actual: 99.95,
            unit: '%',
            status: 'Ahead'
        },
        {
            entityType: 'final_product',
            entityId: 'fp-001',
            name: 'Response Time',
            target: 2,
            actual: 1.5,
            unit: 'seconds',
            status: 'Ahead'
        },

        // Phase KPIs
        {
            entityType: 'phase',
            entityId: 'phase-001',
            name: 'Phase Completion',
            target: 100,
            actual: 90,
            unit: '%',
            status: 'On Track'
        },
        {
            entityType: 'phase',
            entityId: 'phase-001',
            name: 'Code Coverage',
            target: 80,
            actual: 85,
            unit: '%',
            status: 'Ahead'
        },
        {
            entityType: 'phase',
            entityId: 'phase-001',
            name: 'Test Pass Rate',
            target: 95,
            actual: 92,
            unit: '%',
            status: 'At Risk'
        },

        // Deliverable KPIs
        {
            entityType: 'deliverable',
            entityId: 'del-001',
            name: 'Quality Score',
            target: 90,
            actual: 88,
            unit: '%',
            status: 'On Track'
        },
        {
            entityType: 'deliverable',
            entityId: 'del-001',
            name: 'Customer Satisfaction',
            target: 4.5,
            actual: 4.7,
            unit: 'out of 5',
            status: 'Ahead'
        },
        {
            entityType: 'deliverable',
            entityId: 'del-001',
            name: 'Bug Resolution Time',
            target: 48,
            actual: 36,
            unit: 'hours',
            status: 'Ahead'
        },

        // Work Package KPIs
        {
            entityType: 'work_package',
            entityId: 'wp-001',
            name: 'Task Completion Rate',
            target: 100,
            actual: 95,
            unit: '%',
            status: 'On Track'
        },
        {
            entityType: 'work_package',
            entityId: 'wp-001',
            name: 'Velocity',
            target: 40,
            actual: 42,
            unit: 'points',
            status: 'Ahead'
        }
    ];

    // Add rows
    sampleKPIs.forEach(kpi => {
        kpiSheet.addRow(kpi);
    });

    // Style header
    kpiSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    kpiSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };

    // Add conditional formatting for Status column
    kpiSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const statusCell = row.getCell('status');
            const status = statusCell.value;

            if (status === 'Ahead') {
                statusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD4EDDA' }
                };
                statusCell.font = { color: { argb: 'FF155724' } };
            } else if (status === 'At Risk') {
                statusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF8D7DA' }
                };
                statusCell.font = { color: { argb: 'FF721C24' } };
            } else if (status === 'On Track') {
                statusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF3CD' }
                };
                statusCell.font = { color: { argb: 'FF856404' } };
            }
        }
    });

    // Add Instructions Sheet
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.columns = [
        { header: 'Field', key: 'field', width: 20 },
        { header: 'Description', key: 'description', width: 80 }
    ];

    const instructions = [
        { field: 'Entity Type', description: 'Type of entity: project, final_product, phase, deliverable, or work_package' },
        { field: 'Entity ID', description: 'The ID of the entity this KPI belongs to (must match an existing entity in your system)' },
        { field: 'KPI Name', description: 'Name of the KPI metric (e.g., "Code Coverage", "User Adoption Rate")' },
        { field: 'Target', description: 'Target value for this KPI (numeric)' },
        { field: 'Actual', description: 'Current actual value for this KPI (numeric)' },
        { field: 'Unit', description: 'Unit of measurement (e.g., %, ratio, hours, points, defects/KLOC)' },
        { field: 'Status', description: 'Current status: "On Track", "At Risk", "Ahead", or "Behind"' }
    ];

    instructions.forEach(inst => {
        instructionsSheet.addRow(inst);
    });

    instructionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    instructionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF28A745' }
    };

    // Add Common KPIs Reference Sheet
    const referenceSheet = workbook.addWorksheet('Common IT KPIs');
    referenceSheet.columns = [
        { header: 'Category', key: 'category', width: 25 },
        { header: 'KPI Name', key: 'name', width: 40 },
        { header: 'Typical Unit', key: 'unit', width: 20 },
        { header: 'Description', key: 'description', width: 60 }
    ];

    const commonKPIs = [
        { category: 'Project Management', name: 'Schedule Performance Index (SPI)', unit: 'ratio', description: 'Earned Value / Planned Value. >1 = ahead, <1 = behind' },
        { category: 'Project Management', name: 'Cost Performance Index (CPI)', unit: 'ratio', description: 'Earned Value / Actual Cost. >1 = under budget, <1 = over budget' },
        { category: 'Project Management', name: 'Budget Variance', unit: '%', description: 'Percentage difference between planned and actual budget' },
        { category: 'Project Management', name: 'Schedule Variance', unit: 'days', description: 'Difference between planned and actual timeline' },

        { category: 'Quality', name: 'Defect Density', unit: 'defects/KLOC', description: 'Number of defects per thousand lines of code' },
        { category: 'Quality', name: 'Code Coverage', unit: '%', description: 'Percentage of code covered by automated tests' },
        { category: 'Quality', name: 'Test Pass Rate', unit: '%', description: 'Percentage of tests that pass successfully' },
        { category: 'Quality', name: 'Bug Resolution Time', unit: 'hours', description: 'Average time to resolve bugs' },

        { category: 'Performance', name: 'System Uptime', unit: '%', description: 'Percentage of time system is available' },
        { category: 'Performance', name: 'Response Time', unit: 'seconds', description: 'Average system response time' },
        { category: 'Performance', name: 'Throughput', unit: 'transactions/sec', description: 'Number of transactions processed per second' },

        { category: 'User Adoption', name: 'User Adoption Rate', unit: '%', description: 'Percentage of target users actively using the system' },
        { category: 'User Adoption', name: 'Customer Satisfaction', unit: 'out of 5', description: 'User satisfaction score' },
        { category: 'User Adoption', name: 'Net Promoter Score (NPS)', unit: 'score', description: 'Likelihood of users recommending the system' },

        { category: 'Team Productivity', name: 'Velocity', unit: 'story points', description: 'Story points completed per sprint' },
        { category: 'Team Productivity', name: 'Sprint Burndown', unit: '%', description: 'Work completed vs planned in sprint' },
        { category: 'Team Productivity', name: 'Team Utilization', unit: '%', description: 'Percentage of team capacity utilized' }
    ];

    commonKPIs.forEach(kpi => {
        referenceSheet.addRow(kpi);
    });

    referenceSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    referenceSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF17A2B8' }
    };

    // Save file
    const outputPath = path.join(__dirname, '..', 'public', 'kpi_sample.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`KPI sample file generated: ${outputPath}`);
}

generateKPISampleFile().catch(console.error);
