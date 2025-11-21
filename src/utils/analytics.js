/**
 * Analytics utility functions for portfolio metrics
 */

export const calculatePortfolioMetrics = (projects, goals, scopes, deliverables) => {
    return {
        totalProjects: projects.length,
        totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
        averageCompletion: projects.length > 0
            ? Math.round(projects.reduce((sum, p) => sum + (p.completion || 0), 0) / projects.length)
            : 0,
        activeProjects: projects.filter(p => p.status === 'In Progress').length
    };
};

export const getStatusDistribution = (projects) => {
    const distribution = {};
    projects.forEach(p => {
        const status = p.status || 'Unknown';
        distribution[status] = (distribution[status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
        label: status,
        value: count,
        percentage: Math.round((count / projects.length) * 100)
    }));
};

export const getBudgetByProject = (projects) => {
    return projects
        .map(p => ({
            name: p.name,
            budget: p.budget || 0,
            completion: p.completion || 0
        }))
        .sort((a, b) => b.budget - a.budget);
};

export const getBudgetByBusinessUnit = (projects) => {
    const budgetMap = {};
    projects.forEach(p => {
        const unit = p.businessUnit || 'Unassigned';
        budgetMap[unit] = (budgetMap[unit] || 0) + (p.budget || 0);
    });
    return Object.entries(budgetMap).map(([unit, budget]) => ({
        label: unit,
        value: budget
    }));
};

export const getCompletionDistribution = (deliverables) => {
    const ranges = {
        '0-25%': 0,
        '25-50%': 0,
        '50-75%': 0,
        '75-100%': 0
    };

    deliverables.forEach(d => {
        const status = d.status || 0;
        if (status < 25) ranges['0-25%']++;
        else if (status < 50) ranges['25-50%']++;
        else if (status < 75) ranges['50-75%']++;
        else ranges['75-100%']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
        label: range,
        value: count
    }));
};

export const getProjectsByBusinessUnit = (projects) => {
    const unitMap = {};
    projects.forEach(p => {
        const unit = p.businessUnit || 'Unassigned';
        unitMap[unit] = (unitMap[unit] || 0) + 1;
    });
    return Object.entries(unitMap)
        .map(([unit, count]) => ({ label: unit, value: count }))
        .sort((a, b) => b.value - a.value);
};

export const getTopProjectManagers = (projects) => {
    const pmMap = {};
    projects.forEach(p => {
        if (p.pm) {
            pmMap[p.pm] = (pmMap[p.pm] || 0) + 1;
        }
    });
    return Object.entries(pmMap)
        .map(([pm, count]) => ({ name: pm, projectCount: count }))
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 5);
};

export const getAssigneeWorkload = (deliverables) => {
    const workloadMap = {};
    deliverables.forEach(d => {
        if (d.assignee) {
            workloadMap[d.assignee] = (workloadMap[d.assignee] || 0) + 1;
        }
    });
    return Object.entries(workloadMap)
        .map(([assignee, count]) => ({ name: assignee, deliverableCount: count }))
        .sort((a, b) => b.deliverableCount - a.deliverableCount)
        .slice(0, 10);
};

export const getAtRiskProjects = (projects) => {
    // Projects with completion < 50% are considered at risk
    return projects
        .filter(p => (p.completion || 0) < 50 && p.status !== 'Completed')
        .map(p => ({
            name: p.name,
            completion: p.completion || 0,
            status: p.status,
            budget: p.budget || 0
        }))
        .sort((a, b) => a.completion - b.completion);
};
