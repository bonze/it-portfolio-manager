import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createSampleData() {
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

    projectsSheet.addRows([
        {
            name: 'Digital Transformation Initiative',
            description: 'Modernize core business systems and processes',
            owner: 'John Smith',
            status: 'In Progress',
            businessUnit: 'IT Department',
            budget: 500000
        },
        {
            name: 'Customer Portal Upgrade',
            description: 'Enhance customer self-service capabilities',
            owner: 'Sarah Johnson',
            status: 'Planning',
            businessUnit: 'Customer Service',
            budget: 250000
        },
        {
            name: 'Data Analytics Platform',
            description: 'Build enterprise-wide analytics and reporting platform',
            owner: 'Michael Chen',
            status: 'In Progress',
            businessUnit: 'Data & Analytics',
            budget: 750000
        }
    ]);

    // Sheet 2: Goals
    const goalsSheet = workbook.addWorksheet('Goals');
    goalsSheet.columns = [
        { header: 'Project Name', key: 'projectName', width: 30 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 }
    ];

    goalsSheet.addRows([
        // Digital Transformation Initiative goals
        {
            projectName: 'Digital Transformation Initiative',
            description: 'Migrate legacy systems to cloud',
            owner: 'John Smith',
            budget: 200000
        },
        {
            projectName: 'Digital Transformation Initiative',
            description: 'Implement new ERP system',
            owner: 'John Smith',
            budget: 300000
        },
        // Customer Portal Upgrade goals
        {
            projectName: 'Customer Portal Upgrade',
            description: 'Redesign user interface',
            owner: 'Sarah Johnson',
            budget: 100000
        },
        {
            projectName: 'Customer Portal Upgrade',
            description: 'Add mobile app support',
            owner: 'Sarah Johnson',
            budget: 150000
        },
        // Data Analytics Platform goals
        {
            projectName: 'Data Analytics Platform',
            description: 'Build data warehouse',
            owner: 'Michael Chen',
            budget: 400000
        },
        {
            projectName: 'Data Analytics Platform',
            description: 'Create executive dashboards',
            owner: 'Michael Chen',
            budget: 350000
        }
    ]);

    // Sheet 3: Scopes
    const scopesSheet = workbook.addWorksheet('Scopes');
    scopesSheet.columns = [
        { header: 'Goal Description', key: 'goalDescription', width: 50 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Owner', key: 'owner', width: 20 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Timeline', key: 'timeline', width: 20 }
    ];

    scopesSheet.addRows([
        // Cloud migration scopes
        {
            goalDescription: 'Migrate legacy systems to cloud',
            description: 'AWS infrastructure setup',
            owner: 'DevOps Team',
            budget: 80000,
            timeline: 'Q1 2024'
        },
        {
            goalDescription: 'Migrate legacy systems to cloud',
            description: 'Application migration',
            owner: 'Development Team',
            budget: 120000,
            timeline: 'Q2 2024'
        },
        // ERP implementation scopes
        {
            goalDescription: 'Implement new ERP system',
            description: 'Requirements gathering',
            owner: 'Business Analysts',
            budget: 50000,
            timeline: 'Q1 2024'
        },
        {
            goalDescription: 'Implement new ERP system',
            description: 'System configuration',
            owner: 'ERP Consultants',
            budget: 150000,
            timeline: 'Q2-Q3 2024'
        },
        {
            goalDescription: 'Implement new ERP system',
            description: 'User training',
            owner: 'Training Team',
            budget: 100000,
            timeline: 'Q3 2024'
        },
        // UI redesign scopes
        {
            goalDescription: 'Redesign user interface',
            description: 'UX research and design',
            owner: 'UX Team',
            budget: 40000,
            timeline: 'Q1 2024'
        },
        {
            goalDescription: 'Redesign user interface',
            description: 'Frontend development',
            owner: 'Frontend Team',
            budget: 60000,
            timeline: 'Q2 2024'
        },
        // Mobile app scopes
        {
            goalDescription: 'Add mobile app support',
            description: 'iOS app development',
            owner: 'Mobile Team',
            budget: 75000,
            timeline: 'Q2 2024'
        },
        {
            goalDescription: 'Add mobile app support',
            description: 'Android app development',
            owner: 'Mobile Team',
            budget: 75000,
            timeline: 'Q2 2024'
        },
        // Data warehouse scopes
        {
            goalDescription: 'Build data warehouse',
            description: 'Data modeling',
            owner: 'Data Architects',
            budget: 100000,
            timeline: 'Q1 2024'
        },
        {
            goalDescription: 'Build data warehouse',
            description: 'ETL pipeline development',
            owner: 'Data Engineers',
            budget: 200000,
            timeline: 'Q2 2024'
        },
        {
            goalDescription: 'Build data warehouse',
            description: 'Data quality framework',
            owner: 'Data Quality Team',
            budget: 100000,
            timeline: 'Q2 2024'
        },
        // Dashboard scopes
        {
            goalDescription: 'Create executive dashboards',
            description: 'Dashboard design',
            owner: 'BI Team',
            budget: 100000,
            timeline: 'Q2 2024'
        },
        {
            goalDescription: 'Create executive dashboards',
            description: 'Report development',
            owner: 'BI Developers',
            budget: 150000,
            timeline: 'Q3 2024'
        },
        {
            goalDescription: 'Create executive dashboards',
            description: 'User training',
            owner: 'Training Team',
            budget: 100000,
            timeline: 'Q3 2024'
        }
    ]);

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

    deliverablesSheet.addRows([
        // AWS infrastructure deliverables
        {
            scopeDescriptions: 'AWS infrastructure setup',
            description: 'VPC and network configuration',
            assignee: 'Alex Wong',
            owner: 'DevOps Team',
            budget: 20000,
            status: 100
        },
        {
            scopeDescriptions: 'AWS infrastructure setup',
            description: 'Security groups and IAM setup',
            assignee: 'Alex Wong',
            owner: 'DevOps Team',
            budget: 30000,
            status: 75
        },
        {
            scopeDescriptions: 'AWS infrastructure setup',
            description: 'Monitoring and logging setup',
            assignee: 'Maria Garcia',
            owner: 'DevOps Team',
            budget: 30000,
            status: 50
        },
        // Application migration deliverables
        {
            scopeDescriptions: 'Application migration',
            description: 'Database migration',
            assignee: 'David Lee',
            owner: 'Development Team',
            budget: 40000,
            status: 25
        },
        {
            scopeDescriptions: 'Application migration',
            description: 'Application code refactoring',
            assignee: 'Emma Wilson',
            owner: 'Development Team',
            budget: 50000,
            status: 10
        },
        {
            scopeDescriptions: 'Application migration',
            description: 'Testing and validation',
            assignee: 'QA Team',
            owner: 'Development Team',
            budget: 30000,
            status: 0
        },
        // Requirements gathering deliverables
        {
            scopeDescriptions: 'Requirements gathering',
            description: 'Business process documentation',
            assignee: 'Lisa Brown',
            owner: 'Business Analysts',
            budget: 25000,
            status: 100
        },
        {
            scopeDescriptions: 'Requirements gathering',
            description: 'Functional requirements specification',
            assignee: 'Tom Anderson',
            owner: 'Business Analysts',
            budget: 25000,
            status: 80
        },
        // System configuration deliverables
        {
            scopeDescriptions: 'System configuration',
            description: 'ERP module setup',
            assignee: 'ERP Consultant A',
            owner: 'ERP Consultants',
            budget: 75000,
            status: 40
        },
        {
            scopeDescriptions: 'System configuration',
            description: 'Integration with existing systems',
            assignee: 'ERP Consultant B',
            owner: 'ERP Consultants',
            budget: 75000,
            status: 20
        },
        // UX research deliverables
        {
            scopeDescriptions: 'UX research and design',
            description: 'User research and personas',
            assignee: 'UX Researcher',
            owner: 'UX Team',
            budget: 15000,
            status: 100
        },
        {
            scopeDescriptions: 'UX research and design',
            description: 'Wireframes and prototypes',
            assignee: 'UX Designer',
            owner: 'UX Team',
            budget: 25000,
            status: 90
        },
        // Frontend development deliverables
        {
            scopeDescriptions: 'Frontend development',
            description: 'Component library',
            assignee: 'Frontend Dev 1',
            owner: 'Frontend Team',
            budget: 30000,
            status: 60
        },
        {
            scopeDescriptions: 'Frontend development',
            description: 'Page implementation',
            assignee: 'Frontend Dev 2',
            owner: 'Frontend Team',
            budget: 30000,
            status: 40
        },
        // Mobile app deliverables
        {
            scopeDescriptions: 'iOS app development, Android app development',
            description: 'Shared backend API',
            assignee: 'Backend Team',
            owner: 'Mobile Team',
            budget: 50000,
            status: 70
        },
        {
            scopeDescriptions: 'iOS app development',
            description: 'iOS native features',
            assignee: 'iOS Developer',
            owner: 'Mobile Team',
            budget: 25000,
            status: 50
        },
        {
            scopeDescriptions: 'Android app development',
            description: 'Android native features',
            assignee: 'Android Developer',
            owner: 'Mobile Team',
            budget: 25000,
            status: 45
        },
        // Data modeling deliverables
        {
            scopeDescriptions: 'Data modeling',
            description: 'Dimensional model design',
            assignee: 'Data Architect 1',
            owner: 'Data Architects',
            budget: 50000,
            status: 100
        },
        {
            scopeDescriptions: 'Data modeling',
            description: 'Data dictionary',
            assignee: 'Data Architect 2',
            owner: 'Data Architects',
            budget: 50000,
            status: 85
        },
        // ETL pipeline deliverables
        {
            scopeDescriptions: 'ETL pipeline development',
            description: 'Data extraction jobs',
            assignee: 'Data Engineer 1',
            owner: 'Data Engineers',
            budget: 70000,
            status: 60
        },
        {
            scopeDescriptions: 'ETL pipeline development',
            description: 'Data transformation logic',
            assignee: 'Data Engineer 2',
            owner: 'Data Engineers',
            budget: 70000,
            status: 50
        },
        {
            scopeDescriptions: 'ETL pipeline development',
            description: 'Data loading automation',
            assignee: 'Data Engineer 3',
            owner: 'Data Engineers',
            budget: 60000,
            status: 30
        }
    ]);

    // Style headers
    [projectsSheet, goalsSheet, scopesSheet, deliverablesSheet].forEach(sheet => {
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    });

    // Save file
    const filePath = path.join(__dirname, '../public/sample_data.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`Sample data created at: ${filePath}`);
}

createSampleData().catch(console.error);
