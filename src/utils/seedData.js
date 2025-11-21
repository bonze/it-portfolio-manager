import { v4 as uuidv4 } from 'uuid';

export const seedData = {
  projects: [
    {
      id: 'p-1',
      name: 'Digital Transformation 2025',
      businessUnit: 'IT Department',
      owner: 'IT Dept',
      pm: 'John Doe',
      budget: 1000000,
      description: 'Overhaul of internal IT systems.',
      status: 'In Progress',
    },
    {
      id: 'p-2',
      name: 'Customer Experience Platform',
      businessUnit: 'Marketing',
      owner: 'Marketing Dept',
      pm: 'Sarah Chen',
      budget: 750000,
      description: 'Build unified customer engagement platform.',
      status: 'Planning',
    },
    {
      id: 'p-3',
      name: 'Supply Chain Optimization',
      businessUnit: 'Operations',
      owner: 'Operations',
      pm: 'Mike Johnson',
      budget: 500000,
      description: 'Streamline supply chain processes.',
      status: 'In Progress',
    },
    {
      id: 'p-4',
      name: 'Data Analytics Infrastructure',
      businessUnit: 'IT Department',
      owner: 'Data Team',
      pm: 'Emily Wang',
      budget: 850000,
      description: 'Build enterprise data warehouse and BI tools.',
      status: 'In Progress',
    },
    {
      id: 'p-5',
      name: 'Mobile App Development',
      businessUnit: 'Product',
      owner: 'Product Team',
      pm: 'David Lee',
      budget: 600000,
      description: 'Launch customer-facing mobile application.',
      status: 'Planning',
    },
    {
      id: 'p-6',
      name: 'Cybersecurity Enhancement',
      businessUnit: 'IT Department',
      owner: 'Security Team',
      pm: 'Lisa Brown',
      budget: 400000,
      description: 'Strengthen security posture and compliance.',
      status: 'In Progress',
    },
    {
      id: 'p-7',
      name: 'HR System Modernization',
      businessUnit: 'Human Resources',
      owner: 'HR Dept',
      pm: 'Tom Wilson',
      budget: 300000,
      description: 'Replace legacy HR management system.',
      status: 'Completed',
    },
    {
      id: 'p-8',
      name: 'E-commerce Platform Upgrade',
      businessUnit: 'Sales',
      owner: 'Sales Dept',
      pm: 'Anna Martinez',
      budget: 950000,
      description: 'Modernize online sales platform.',
      status: 'In Progress',
    },
    {
      id: 'p-9',
      name: 'Office Automation Suite',
      businessUnit: 'Operations',
      owner: 'Operations',
      pm: 'Chris Taylor',
      budget: 250000,
      description: 'Automate routine office workflows.',
      status: 'On Hold',
    },
    {
      id: 'p-10',
      name: 'Cloud Infrastructure Migration',
      businessUnit: 'IT Department',
      owner: 'Infrastructure',
      pm: 'Rachel Green',
      budget: 1200000,
      description: 'Migrate all services to cloud infrastructure.',
      status: 'Planning',
    }
  ],
  goals: [
    // Project 1 goals
    { id: 'g-1', projectId: 'p-1', description: 'Modernize Legacy ERP', owner: 'Finance Dept', budget: 500000, status: 'In Progress' },
    { id: 'g-2', projectId: 'p-1', description: 'Cloud Migration', owner: 'Infrastructure Team', budget: 300000, status: 'Pending' },

    // Project 2 goals
    { id: 'g-3', projectId: 'p-2', description: 'Build Customer Portal', owner: 'Product Team', budget: 400000, status: 'Planning' },
    { id: 'g-4', projectId: 'p-2', description: 'Implement CRM Integration', owner: 'Marketing Tech', budget: 200000, status: 'Planning' },

    // Project 3 goals
    { id: 'g-5', projectId: 'p-3', description: 'Inventory Management System', owner: 'Logistics', budget: 250000, status: 'In Progress' },
    { id: 'g-6', projectId: 'p-3', description: 'Supplier Portal', owner: 'Procurement', budget: 150000, status: 'In Progress' },

    // Project 4 goals
    { id: 'g-7', projectId: 'p-4', description: 'Data Warehouse Implementation', owner: 'Data Engineering', budget: 500000, status: 'In Progress' },
    { id: 'g-8', projectId: 'p-4', description: 'BI Dashboard Suite', owner: 'Analytics Team', budget: 250000, status: 'In Progress' },

    // Project 5 goals
    { id: 'g-9', projectId: 'p-5', description: 'iOS App Development', owner: 'Mobile Team', budget: 300000, status: 'Planning' },
    { id: 'g-10', projectId: 'p-5', description: 'Android App Development', owner: 'Mobile Team', budget: 250000, status: 'Planning' },

    // Project 6 goals
    { id: 'g-11', projectId: 'p-6', description: 'Security Audit & Remediation', owner: 'Security', budget: 200000, status: 'In Progress' },
    { id: 'g-12', projectId: 'p-6', description: 'Compliance Framework', owner: 'Compliance', budget: 150000, status: 'In Progress' },

    // Project 7 goals
    { id: 'g-13', projectId: 'p-7', description: 'HRIS Implementation', owner: 'HR Tech', budget: 200000, status: 'Completed' },

    // Project 8 goals
    { id: 'g-14', projectId: 'p-8', description: 'Platform Redesign', owner: 'UX Team', budget: 400000, status: 'In Progress' },
    { id: 'g-15', projectId: 'p-8', description: 'Payment Gateway Integration', owner: 'Finance Tech', budget: 300000, status: 'In Progress' },

    // Project 9 goals
    { id: 'g-16', projectId: 'p-9', description: 'Workflow Automation', owner: 'Process Team', budget: 150000, status: 'On Hold' },

    // Project 10 goals
    { id: 'g-17', projectId: 'p-10', description: 'AWS Migration', owner: 'Cloud Team', budget: 700000, status: 'Planning' },
    { id: 'g-18', projectId: 'p-10', description: 'DevOps Transformation', owner: 'DevOps', budget: 400000, status: 'Planning' }
  ],
  scopes: [
    // Goal 1 scopes
    { id: 's-1', goalId: 'g-1', description: 'Finance Module Upgrade', owner: 'Alice Smith', budget: 50000, timeline: 'Q1 2025', status: 'In Progress' },
    { id: 's-2', goalId: 'g-1', description: 'HR Module Upgrade', owner: 'Bob Jones', budget: 30000, timeline: 'Q2 2025', status: 'Pending' },

    // Goal 3 scopes
    { id: 's-3', goalId: 'g-3', description: 'User Authentication System', owner: 'Security Dev', budget: 80000, timeline: 'Q1 2025', status: 'Planning' },
    { id: 's-4', goalId: 'g-3', description: 'Customer Dashboard', owner: 'Frontend Team', budget: 120000, timeline: 'Q2 2025', status: 'Planning' },

    // Goal 5 scopes
    { id: 's-5', goalId: 'g-5', description: 'Real-time Tracking', owner: 'IoT Team', budget: 100000, timeline: 'Q1 2025', status: 'In Progress' },
    { id: 's-6', goalId: 'g-5', description: 'Automated Reordering', owner: 'AI Team', budget: 80000, timeline: 'Q2 2025', status: 'In Progress' },

    // Goal 7 scopes
    { id: 's-7', goalId: 'g-7', description: 'ETL Pipeline', owner: 'Data Eng', budget: 200000, timeline: 'Q1 2025', status: 'In Progress' },
    { id: 's-8', goalId: 'g-7', description: 'Data Lake Setup', owner: 'Data Arch', budget: 150000, timeline: 'Q2 2025', status: 'In Progress' },

    // Goal 9 scopes
    { id: 's-9', goalId: 'g-9', description: 'UI/UX Design', owner: 'Design Team', budget: 50000, timeline: 'Q1 2025', status: 'Planning' },
    { id: 's-10', goalId: 'g-9', description: 'Core Features Development', owner: 'iOS Devs', budget: 150000, timeline: 'Q2 2025', status: 'Planning' },

    // Goal 11 scopes
    { id: 's-11', goalId: 'g-11', description: 'Penetration Testing', owner: 'Security Audit', budget: 80000, timeline: 'Q1 2025', status: 'In Progress' },
    { id: 's-12', goalId: 'g-11', description: 'Vulnerability Remediation', owner: 'Security Ops', budget: 70000, timeline: 'Q2 2025', status: 'In Progress' },

    // Goal 14 scopes
    { id: 's-13', goalId: 'g-14', description: 'Frontend Redesign', owner: 'UX/UI', budget: 150000, timeline: 'Q1 2025', status: 'In Progress' },
    { id: 's-14', goalId: 'g-14', description: 'Backend API Upgrade', owner: 'Backend Team', budget: 120000, timeline: 'Q2 2025', status: 'In Progress' }
  ],
  deliverables: [
    // Scope 1 deliverables
    { id: 'd-1', scopeIds: ['s-1'], description: 'Requirement Analysis Document', assignee: 'Alice', owner: 'BA Team', budget: 5000, status: 100, completionDate: '2024-12-01' },
    { id: 'd-2', scopeIds: ['s-1'], description: 'Vendor Selection', assignee: 'Bob', owner: 'Procurement', budget: 2000, status: 50, completionDate: null },
    { id: 'd-3', scopeIds: ['s-2'], description: 'Initial Audit', assignee: 'Charlie', owner: 'Audit Team', budget: 10000, status: 0, completionDate: null },
    { id: 'd-4', scopeIds: ['s-1', 's-2'], description: 'Security Compliance Check', assignee: 'Dave', owner: 'Security Team', budget: 15000, status: 20, completionDate: null },

    // Scope 3 deliverables
    { id: 'd-5', scopeIds: ['s-3'], description: 'OAuth Implementation', assignee: 'Emma', owner: 'Auth Team', budget: 30000, status: 0, completionDate: null },
    { id: 'd-6', scopeIds: ['s-3'], description: 'Multi-factor Authentication', assignee: 'Frank', owner: 'Security', budget: 25000, status: 0, completionDate: null },

    // Scope 4 deliverables
    { id: 'd-7', scopeIds: ['s-4'], description: 'Dashboard Wireframes', assignee: 'Grace', owner: 'Design', budget: 15000, status: 80, completionDate: null },
    { id: 'd-8', scopeIds: ['s-4'], description: 'React Component Library', assignee: 'Henry', owner: 'Frontend', budget: 40000, status: 30, completionDate: null },

    // Scope 5 deliverables
    { id: 'd-9', scopeIds: ['s-5'], description: 'IoT Sensor Integration', assignee: 'Iris', owner: 'IoT', budget: 50000, status: 60, completionDate: null },
    { id: 'd-10', scopeIds: ['s-5'], description: 'Real-time Dashboard', assignee: 'Jack', owner: 'Frontend', budget: 30000, status: 40, completionDate: null },

    // Scope 7 deliverables
    { id: 'd-11', scopeIds: ['s-7'], description: 'Data Pipeline Architecture', assignee: 'Kelly', owner: 'Data Arch', budget: 80000, status: 70, completionDate: null },
    { id: 'd-12', scopeIds: ['s-7'], description: 'ETL Job Implementation', assignee: 'Leo', owner: 'Data Eng', budget: 60000, status: 50, completionDate: null },

    // Scope 9 deliverables
    { id: 'd-13', scopeIds: ['s-9'], description: 'Mobile UI Design', assignee: 'Mia', owner: 'Design', budget: 20000, status: 0, completionDate: null },
    { id: 'd-14', scopeIds: ['s-9'], description: 'User Flow Documentation', assignee: 'Noah', owner: 'UX', budget: 10000, status: 0, completionDate: null },

    // Scope 11 deliverables
    { id: 'd-15', scopeIds: ['s-11'], description: 'Security Assessment Report', assignee: 'Olivia', owner: 'Security', budget: 40000, status: 90, completionDate: null },
    { id: 'd-16', scopeIds: ['s-11'], description: 'Penetration Test Results', assignee: 'Paul', owner: 'Security', budget: 30000, status: 75, completionDate: null },

    // Scope 13 deliverables
    { id: 'd-17', scopeIds: ['s-13'], description: 'Homepage Redesign', assignee: 'Quinn', owner: 'UX', budget: 50000, status: 85, completionDate: null },
    { id: 'd-18', scopeIds: ['s-13'], description: 'Product Page Templates', assignee: 'Rachel', owner: 'Frontend', budget: 40000, status: 60, completionDate: null },

    // Cross-scope deliverables
    { id: 'd-19', scopeIds: ['s-7', 's-8'], description: 'Data Governance Framework', assignee: 'Sam', owner: 'Data Gov', budget: 50000, status: 45, completionDate: null },
    { id: 'd-20', scopeIds: ['s-13', 's-14'], description: 'API Documentation', assignee: 'Tina', owner: 'Tech Writing', budget: 15000, status: 55, completionDate: null }
  ]
};
