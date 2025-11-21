import { v4 as uuidv4 } from 'uuid';

export const seedData = {
  projects: [
    {
      id: 'p-1',
      name: 'Digital Transformation 2025',
      businessUnit: 'IT Department',
      owner: 'IT Dept',
      pm: 'John Doe',
      budget: { plan: 1000000, actual: 850000, additional: 50000 },
      vendor: { name: 'TechCorp Solutions', contact: 'contact@techcorp.com', contractValue: 900000 },
      resources: { planManDays: 500, actualManDays: 420, planManMonths: 25, actualManMonths: 21 },
      description: 'Overhaul of internal IT systems.',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-2',
      name: 'Customer Experience Platform',
      businessUnit: 'Marketing',
      owner: 'Marketing Dept',
      pm: 'Sarah Chen',
      budget: { plan: 750000, actual: 320000, additional: 0 },
      vendor: { name: 'UX Innovations Ltd', contact: 'hello@uxinnovations.com', contractValue: 700000 },
      resources: { planManDays: 400, actualManDays: 180, planManMonths: 20, actualManMonths: 9 },
      description: 'Build unified customer engagement platform.',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-3',
      name: 'Supply Chain Optimization',
      businessUnit: 'Operations',
      owner: 'Operations',
      pm: 'Mike Johnson',
      budget: { plan: 500000, actual: 480000, additional: 20000 },
      vendor: { name: 'LogiTech Systems', contact: 'support@logitech-sys.com', contractValue: 480000 },
      resources: { planManDays: 300, actualManDays: 290, planManMonths: 15, actualManMonths: 14.5 },
      description: 'Streamline supply chain processes.',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-4',
      name: 'Data Analytics Infrastructure',
      businessUnit: 'IT Department',
      owner: 'Data Team',
      pm: 'Emily Wang',
      budget: { plan: 850000, actual: 620000, additional: 100000 },
      vendor: { name: 'DataViz Pro', contact: 'sales@datavizpro.com', contractValue: 800000 },
      resources: { planManDays: 450, actualManDays: 310, planManMonths: 22, actualManMonths: 15.5 },
      description: 'Build enterprise data warehouse and BI tools.',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-5',
      name: 'Mobile App Development',
      businessUnit: 'Product',
      owner: 'Product Team',
      pm: 'David Lee',
      budget: { plan: 600000, actual: 150000, additional: 0 },
      vendor: { name: 'MobileDev Studio', contact: 'info@mobiledev.io', contractValue: 580000 },
      resources: { planManDays: 350, actualManDays: 95, planManMonths: 17, actualManMonths: 4.75 },
      description: 'Launch customer-facing mobile application.',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-6',
      name: 'Cybersecurity Enhancement',
      businessUnit: 'IT Department',
      owner: 'Security Team',
      pm: 'Lisa Brown',
      budget: { plan: 400000, actual: 380000, additional: 30000 },
      vendor: { name: 'SecureNet Inc', contact: 'contact@securenet.com', contractValue: 410000 },
      resources: { planManDays: 250, actualManDays: 235, planManMonths: 12, actualManMonths: 11.75 },
      description: 'Strengthen security posture and compliance.',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-7',
      name: 'HR System Modernization',
      businessUnit: 'Human Resources',
      owner: 'HR Dept',
      pm: 'Tom Wilson',
      budget: { plan: 300000, actual: 300000, additional: 0 },
      vendor: { name: 'HR Tech Solutions', contact: 'support@hrtech.com', contractValue: 300000 },
      resources: { planManDays: 200, actualManDays: 200, planManMonths: 10, actualManMonths: 10 },
      description: 'Replace legacy HR management system.',
      status: 'Completed',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-8',
      name: 'E-commerce Platform Upgrade',
      businessUnit: 'Sales',
      owner: 'Sales Dept',
      pm: 'Anna Martinez',
      budget: { plan: 950000, actual: 720000, additional: 50000 },
      vendor: { name: 'E-Shop Builders', contact: 'hello@eshopbuilders.com', contractValue: 920000 },
      resources: { planManDays: 550, actualManDays: 410, planManMonths: 27, actualManMonths: 20.5 },
      description: 'Modernize online sales platform.',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-9',
      name: 'Office Automation Suite',
      businessUnit: 'Operations',
      owner: 'Operations',
      pm: 'Chris Taylor',
      budget: { plan: 250000, actual: 80000, additional: 0 },
      vendor: { name: 'AutoFlow Systems', contact: 'info@autoflow.com', contractValue: 240000 },
      resources: { planManDays: 150, actualManDays: 50, planManMonths: 7, actualManMonths: 2.5 },
      description: 'Automate routine office workflows.',
      status: 'On Hold',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'p-10',
      name: 'Cloud Infrastructure Migration',
      businessUnit: 'IT Department',
      owner: 'Infrastructure',
      pm: 'Rachel Green',
      budget: { plan: 1200000, actual: 450000, additional: 0 },
      vendor: { name: 'CloudMasters Inc', contact: 'sales@cloudmasters.com', contractValue: 1150000 },
      resources: { planManDays: 600, actualManDays: 220, planManMonths: 30, actualManMonths: 11 },
      description: 'Migrate all services to cloud infrastructure.',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    }
  ],
  goals: [
    // Project 1 goals
    {
      id: 'g-1',
      projectId: 'p-1',
      description: 'Modernize Legacy ERP',
      owner: 'Finance Dept',
      budget: { plan: 500000, actual: 420000, additional: 30000 },
      status: 'In Progress',
      kpis: [
        { id: 'kpi-g1-1', name: 'System Uptime', target: 99.9, actual: 99.5, unit: '%', status: 'At Risk' },
        { id: 'kpi-g1-2', name: 'User Adoption Rate', target: 90, actual: 85, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-2',
      projectId: 'p-1',
      description: 'Cloud Migration',
      owner: 'Infrastructure Team',
      budget: { plan: 300000, actual: 180000, additional: 0 },
      status: 'Pending',
      kpis: [
        { id: 'kpi-g2-1', name: 'Migration Completion', target: 100, actual: 60, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 2 goals
    {
      id: 'g-3',
      projectId: 'p-2',
      description: 'Build Customer Portal',
      owner: 'Product Team',
      budget: { plan: 400000, actual: 180000, additional: 0 },
      status: 'Planning',
      kpis: [
        { id: 'kpi-g3-1', name: 'Portal Features Completed', target: 100, actual: 45, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-4',
      projectId: 'p-2',
      description: 'Implement CRM Integration',
      owner: 'Marketing Tech',
      budget: { plan: 200000, actual: 90000, additional: 0 },
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 3 goals
    {
      id: 'g-5',
      projectId: 'p-3',
      description: 'Inventory Management System',
      owner: 'Logistics',
      budget: { plan: 250000, actual: 240000, additional: 10000 },
      status: 'In Progress',
      kpis: [
        { id: 'kpi-g5-1', name: 'Inventory Accuracy', target: 98, actual: 96, unit: '%', status: 'At Risk' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-6',
      projectId: 'p-3',
      description: 'Supplier Portal',
      owner: 'Procurement',
      budget: { plan: 150000, actual: 145000, additional: 5000 },
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 4 goals
    {
      id: 'g-7',
      projectId: 'p-4',
      description: 'Data Warehouse Implementation',
      owner: 'Data Engineering',
      budget: { plan: 500000, actual: 380000, additional: 60000 },
      status: 'In Progress',
      kpis: [
        { id: 'kpi-g7-1', name: 'Data Quality Score', target: 95, actual: 92, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-8',
      projectId: 'p-4',
      description: 'BI Dashboard Suite',
      owner: 'Analytics Team',
      budget: { plan: 250000, actual: 160000, additional: 20000 },
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 5 goals
    {
      id: 'g-9',
      projectId: 'p-5',
      description: 'iOS App Development',
      owner: 'Mobile Team',
      budget: { plan: 300000, actual: 80000, additional: 0 },
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-10',
      projectId: 'p-5',
      description: 'Android App Development',
      owner: 'Mobile Team',
      budget: { plan: 250000, actual: 60000, additional: 0 },
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 6 goals
    {
      id: 'g-11',
      projectId: 'p-6',
      description: 'Security Audit & Remediation',
      owner: 'Security',
      budget: { plan: 200000, actual: 190000, additional: 15000 },
      status: 'In Progress',
      kpis: [
        { id: 'kpi-g11-1', name: 'Vulnerabilities Fixed', target: 100, actual: 95, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-12',
      projectId: 'p-6',
      description: 'Compliance Framework',
      owner: 'Compliance',
      budget: { plan: 150000, actual: 140000, additional: 10000 },
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 7 goals
    {
      id: 'g-13',
      projectId: 'p-7',
      description: 'HRIS Implementation',
      owner: 'HR Tech',
      budget: { plan: 200000, actual: 200000, additional: 0 },
      status: 'Completed',
      kpis: [
        { id: 'kpi-g13-1', name: 'Employee Onboarding Time', target: 2, actual: 1.5, unit: 'days', status: 'Achieved' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 8 goals
    {
      id: 'g-14',
      projectId: 'p-8',
      description: 'Platform Redesign',
      owner: 'UX Team',
      budget: { plan: 400000, actual: 310000, additional: 25000 },
      status: 'In Progress',
      kpis: [
        { id: 'kpi-g14-1', name: 'Page Load Time', target: 2, actual: 2.5, unit: 'seconds', status: 'At Risk' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-15',
      projectId: 'p-8',
      description: 'Payment Gateway Integration',
      owner: 'Finance Tech',
      budget: { plan: 300000, actual: 240000, additional: 15000 },
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 9 goals
    {
      id: 'g-16',
      projectId: 'p-9',
      description: 'Workflow Automation',
      owner: 'Process Team',
      budget: { plan: 150000, actual: 50000, additional: 0 },
      status: 'On Hold',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Project 10 goals
    {
      id: 'g-17',
      projectId: 'p-10',
      description: 'AWS Migration',
      owner: 'Cloud Team',
      budget: { plan: 700000, actual: 280000, additional: 0 },
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'g-18',
      projectId: 'p-10',
      description: 'DevOps Transformation',
      owner: 'DevOps',
      budget: { plan: 400000, actual: 140000, additional: 0 },
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    }
  ],
  scopes: [
    // Goal 1 scopes
    {
      id: 's-1',
      goalId: 'g-1',
      description: 'Finance Module Upgrade',
      owner: 'Alice Smith',
      budget: { plan: 50000, actual: 45000, additional: 5000 },
      timeline: 'Q1 2025',
      status: 'In Progress',
      kpis: [
        { id: 'kpi-s1-1', name: 'Module Test Coverage', target: 90, actual: 85, unit: '%', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-2',
      goalId: 'g-1',
      description: 'HR Module Upgrade',
      owner: 'Bob Jones',
      budget: { plan: 30000, actual: 12000, additional: 0 },
      timeline: 'Q2 2025',
      status: 'Pending',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 3 scopes
    {
      id: 's-3',
      goalId: 'g-3',
      description: 'User Authentication System',
      owner: 'Security Dev',
      budget: { plan: 80000, actual: 35000, additional: 0 },
      timeline: 'Q1 2025',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-4',
      goalId: 'g-3',
      description: 'Customer Dashboard',
      owner: 'Frontend Team',
      budget: { plan: 120000, actual: 52000, additional: 0 },
      timeline: 'Q2 2025',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 5 scopes
    {
      id: 's-5',
      goalId: 'g-5',
      description: 'Real-time Tracking',
      owner: 'IoT Team',
      budget: { plan: 100000, actual: 95000, additional: 5000 },
      timeline: 'Q1 2025',
      status: 'In Progress',
      kpis: [
        { id: 'kpi-s5-1', name: 'Tracking Accuracy', target: 99, actual: 97, unit: '%', status: 'At Risk' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-6',
      goalId: 'g-5',
      description: 'Automated Reordering',
      owner: 'AI Team',
      budget: { plan: 80000, actual: 72000, additional: 3000 },
      timeline: 'Q2 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 7 scopes
    {
      id: 's-7',
      goalId: 'g-7',
      description: 'ETL Pipeline',
      owner: 'Data Eng',
      budget: { plan: 200000, actual: 165000, additional: 25000 },
      timeline: 'Q1 2025',
      status: 'In Progress',
      kpis: [
        { id: 'kpi-s7-1', name: 'Data Processing Speed', target: 1000, actual: 850, unit: 'GB/hr', status: 'On Track' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-8',
      goalId: 'g-7',
      description: 'Data Lake Setup',
      owner: 'Data Arch',
      budget: { plan: 150000, actual: 120000, additional: 15000 },
      timeline: 'Q2 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 9 scopes
    {
      id: 's-9',
      goalId: 'g-9',
      description: 'UI/UX Design',
      owner: 'Design Team',
      budget: { plan: 50000, actual: 18000, additional: 0 },
      timeline: 'Q1 2025',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-10',
      goalId: 'g-9',
      description: 'Core Features Development',
      owner: 'iOS Devs',
      budget: { plan: 150000, actual: 42000, additional: 0 },
      timeline: 'Q2 2025',
      status: 'Planning',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 11 scopes
    {
      id: 's-11',
      goalId: 'g-11',
      description: 'Penetration Testing',
      owner: 'Security Audit',
      budget: { plan: 80000, actual: 76000, additional: 8000 },
      timeline: 'Q1 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-12',
      goalId: 'g-11',
      description: 'Vulnerability Remediation',
      owner: 'Security Ops',
      budget: { plan: 70000, actual: 65000, additional: 5000 },
      timeline: 'Q2 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Goal 14 scopes
    {
      id: 's-13',
      goalId: 'g-14',
      description: 'Frontend Redesign',
      owner: 'UX/UI',
      budget: { plan: 150000, actual: 125000, additional: 12000 },
      timeline: 'Q1 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 's-14',
      goalId: 'g-14',
      description: 'Backend API Upgrade',
      owner: 'Backend Team',
      budget: { plan: 120000, actual: 98000, additional: 8000 },
      timeline: 'Q2 2025',
      status: 'In Progress',
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    }
  ],
  deliverables: [
    // Scope 1 deliverables
    {
      id: 'd-1',
      scopeIds: ['s-1'],
      description: 'Requirement Analysis Document',
      assignee: 'Alice',
      owner: 'BA Team',
      budget: { plan: 5000, actual: 5000, additional: 0 },
      status: 100,
      completionDate: '2024-12-01',
      kpis: [
        { id: 'kpi-d1-1', name: 'Requirement Coverage', target: 100, actual: 100, unit: '%', status: 'Achieved' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-2',
      scopeIds: ['s-1'],
      description: 'Vendor Selection',
      assignee: 'Bob',
      owner: 'Procurement',
      budget: { plan: 2000, actual: 1000, additional: 0 },
      status: 50,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-3',
      scopeIds: ['s-2'],
      description: 'Initial Audit',
      assignee: 'Charlie',
      owner: 'Audit Team',
      budget: { plan: 10000, actual: 0, additional: 0 },
      status: 0,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-4',
      scopeIds: ['s-1', 's-2'],
      description: 'Security Compliance Check',
      assignee: 'Dave',
      owner: 'Security Team',
      budget: { plan: 15000, actual: 3000, additional: 0 },
      status: 20,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 3 deliverables
    {
      id: 'd-5',
      scopeIds: ['s-3'],
      description: 'OAuth Implementation',
      assignee: 'Emma',
      owner: 'Auth Team',
      budget: { plan: 30000, actual: 0, additional: 0 },
      status: 0,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-6',
      scopeIds: ['s-3'],
      description: 'Multi-factor Authentication',
      assignee: 'Frank',
      owner: 'Security',
      budget: { plan: 25000, actual: 0, additional: 0 },
      status: 0,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 4 deliverables
    {
      id: 'd-7',
      scopeIds: ['s-4'],
      description: 'Dashboard Wireframes',
      assignee: 'Grace',
      owner: 'Design',
      budget: { plan: 15000, actual: 12000, additional: 0 },
      status: 80,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-8',
      scopeIds: ['s-4'],
      description: 'React Component Library',
      assignee: 'Henry',
      owner: 'Frontend',
      budget: { plan: 40000, actual: 12000, additional: 0 },
      status: 30,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 5 deliverables
    {
      id: 'd-9',
      scopeIds: ['s-5'],
      description: 'IoT Sensor Integration',
      assignee: 'Iris',
      owner: 'IoT',
      budget: { plan: 50000, actual: 30000, additional: 0 },
      status: 60,
      completionDate: null,
      kpis: [
        { id: 'kpi-d9-1', name: 'Sensor Response Time', target: 100, actual: 120, unit: 'ms', status: 'At Risk' }
      ],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-10',
      scopeIds: ['s-5'],
      description: 'Real-time Dashboard',
      assignee: 'Jack',
      owner: 'Frontend',
      budget: { plan: 30000, actual: 12000, additional: 0 },
      status: 40,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 7 deliverables
    {
      id: 'd-11',
      scopeIds: ['s-7'],
      description: 'Data Pipeline Architecture',
      assignee: 'Kelly',
      owner: 'Data Arch',
      budget: { plan: 80000, actual: 56000, additional: 0 },
      status: 70,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-12',
      scopeIds: ['s-7'],
      description: 'ETL Job Implementation',
      assignee: 'Leo',
      owner: 'Data Eng',
      budget: { plan: 60000, actual: 30000, additional: 0 },
      status: 50,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 9 deliverables
    {
      id: 'd-13',
      scopeIds: ['s-9'],
      description: 'Mobile UI Design',
      assignee: 'Mia',
      owner: 'Design',
      budget: { plan: 20000, actual: 0, additional: 0 },
      status: 0,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-14',
      scopeIds: ['s-9'],
      description: 'User Flow Documentation',
      assignee: 'Noah',
      owner: 'UX',
      budget: { plan: 10000, actual: 0, additional: 0 },
      status: 0,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 11 deliverables
    {
      id: 'd-15',
      scopeIds: ['s-11'],
      description: 'Security Assessment Report',
      assignee: 'Olivia',
      owner: 'Security',
      budget: { plan: 40000, actual: 36000, additional: 0 },
      status: 90,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-16',
      scopeIds: ['s-11'],
      description: 'Penetration Test Results',
      assignee: 'Paul',
      owner: 'Security',
      budget: { plan: 30000, actual: 22500, additional: 0 },
      status: 75,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Scope 13 deliverables
    {
      id: 'd-17',
      scopeIds: ['s-13'],
      description: 'Homepage Redesign',
      assignee: 'Quinn',
      owner: 'UX',
      budget: { plan: 50000, actual: 42500, additional: 0 },
      status: 85,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-18',
      scopeIds: ['s-13'],
      description: 'Product Page Templates',
      assignee: 'Rachel',
      owner: 'Frontend',
      budget: { plan: 40000, actual: 24000, additional: 0 },
      status: 60,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },

    // Cross-scope deliverables
    {
      id: 'd-19',
      scopeIds: ['s-7', 's-8'],
      description: 'Data Governance Framework',
      assignee: 'Sam',
      owner: 'Data Gov',
      budget: { plan: 50000, actual: 22500, additional: 0 },
      status: 45,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    },
    {
      id: 'd-20',
      scopeIds: ['s-13', 's-14'],
      description: 'API Documentation',
      assignee: 'Tina',
      owner: 'Tech Writing',
      budget: { plan: 15000, actual: 8250, additional: 0 },
      status: 55,
      completionDate: null,
      kpis: [],
      currentBaseline: 0,
      baselineHistory: [],
      pendingChanges: null
    }
  ]
};
