import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wb = XLSX.utils.book_new();

// 0. Instructions Sheet
const instructionsData = [
    { Sheet: 'Projects', Column: 'Name', Description: 'Name of the project', ValidValues: 'Text (Required)' },
    { Sheet: 'Projects', Column: 'Description', Description: 'Brief details about the project', ValidValues: 'Text' },
    { Sheet: 'Projects', Column: 'Owner', Description: 'Department or Unit owning the project', ValidValues: 'Text' },
    { Sheet: 'Projects', Column: 'PM', Description: 'Project Manager Name', ValidValues: 'Text' },
    { Sheet: 'Projects', Column: 'Status', Description: 'Current state', ValidValues: 'Planning, In Progress, Completed, On Hold' },
    { Sheet: 'Projects', Column: 'BusinessUnit', Description: 'Business Unit responsible', ValidValues: 'Text' },
    { Sheet: 'Projects', Column: 'Budget', Description: 'Total allocated budget', ValidValues: 'Number (Currency)' },

    { Sheet: 'Goals', Column: 'Project Name', Description: 'Must match a Name in Projects sheet', ValidValues: 'Text (Required)' },
    { Sheet: 'Goals', Column: 'Description', Description: 'Goal objective', ValidValues: 'Text (Required)' },
    { Sheet: 'Goals', Column: 'Owner', Description: 'Owner of this goal', ValidValues: 'Text' },
    { Sheet: 'Goals', Column: 'Budget', Description: 'Budget allocated to this goal', ValidValues: 'Number' },

    { Sheet: 'Scopes', Column: 'Goal Description', Description: 'Must match a Description in Goals sheet', ValidValues: 'Text (Required)' },
    { Sheet: 'Scopes', Column: 'Description', Description: 'Scope details', ValidValues: 'Text (Required)' },
    { Sheet: 'Scopes', Column: 'Owner', Description: 'Owner of this scope', ValidValues: 'Text' },
    { Sheet: 'Scopes', Column: 'Budget', Description: 'Budget allocated to this scope', ValidValues: 'Number' },
    { Sheet: 'Scopes', Column: 'Timeline', Description: 'Expected timeframe', ValidValues: 'Text (e.g. Q1 2025)' },

    { Sheet: 'Deliverables', Column: 'Scope Description(s)', Description: 'Comma-separated list of Scope Descriptions this deliverable contributes to', ValidValues: 'Text (Required)' },
    { Sheet: 'Deliverables', Column: 'Description', Description: 'Deliverable name/output', ValidValues: 'Text (Required)' },
    { Sheet: 'Deliverables', Column: 'Assignee', Description: 'Person responsible', ValidValues: 'Text' },
    { Sheet: 'Deliverables', Column: 'Owner', Description: 'Unit/Team owning this output', ValidValues: 'Text' },
    { Sheet: 'Deliverables', Column: 'Budget', Description: 'Cost/Budget for this deliverable', ValidValues: 'Number' },
    { Sheet: 'Deliverables', Column: 'Status', Description: 'Completion percentage', ValidValues: 'Number (0-100)' },
];
const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
// Adjust column widths
wsInstructions['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 50 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

// 1. Projects Sheet
const projectsData = [
    { Name: 'Example Project', Description: 'Description of project', Owner: 'IT Dept', PM: 'Jane Doe', Status: 'Planning', BusinessUnit: 'Tech', Budget: 100000 }
];
const wsProjects = XLSX.utils.json_to_sheet(projectsData);
XLSX.utils.book_append_sheet(wb, wsProjects, 'Projects');

// 2. Goals Sheet
const goalsData = [
    { 'Project Name': 'Example Project', Description: 'Example Goal', Owner: 'Product Team', Budget: 50000 }
];
const wsGoals = XLSX.utils.json_to_sheet(goalsData);
XLSX.utils.book_append_sheet(wb, wsGoals, 'Goals');

// 3. Scopes Sheet
const scopesData = [
    { 'Goal Description': 'Example Goal', Description: 'Example Scope', Owner: 'Dev Team', Budget: 20000, Timeline: 'Q1 2025' }
];
const wsScopes = XLSX.utils.json_to_sheet(scopesData);
XLSX.utils.book_append_sheet(wb, wsScopes, 'Scopes');

// 4. Deliverables Sheet
const deliverablesData = [
    { 'Scope Description(s)': 'Example Scope', Description: 'Example Deliverable', Assignee: 'John Doe', Owner: 'Dev Team', Budget: 5000, Status: 0 }
];
const wsDeliverables = XLSX.utils.json_to_sheet(deliverablesData);
XLSX.utils.book_append_sheet(wb, wsDeliverables, 'Deliverables');

// Write file
const outputPath = path.resolve(__dirname, '../public/project_template.xlsx');

// Ensure public dir exists
if (!fs.existsSync(path.resolve(__dirname, '../public'))) {
    fs.mkdirSync(path.resolve(__dirname, '../public'));
}

XLSX.writeFile(wb, outputPath);
console.log(`Template generated at: ${outputPath}`);
