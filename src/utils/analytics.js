/**
 * Analytics utility functions for portfolio metrics
 */

// ============================================================================
// 1. EXECUTIVE SUMMARY METRICS
// ============================================================================

// ============================================================================
// 1. EXECUTIVE SUMMARY METRICS
// ============================================================================

export const calculatePortfolioMetrics = (projects, finalProducts, phases, deliverables, workPackages) => {
    const totalBudgetPlan = projects.reduce((sum, p) => {
        const budget = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        return sum + budget;
    }, 0);
    const totalBudgetActual = projects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);

    return {
        totalProjects: projects.length,
        totalBudget: totalBudgetPlan,
        totalBudgetActual,
        averageCompletion: projects.length > 0
            ? Math.round(projects.reduce((sum, p) => sum + (p.completion || 0), 0) / projects.length)
            : 0,
        activeProjects: projects.filter(p => p.status === 'In Progress').length,
        completedProjects: projects.filter(p => p.status === 'Completed').length,
        plannedProjects: projects.filter(p => p.status === 'Planning').length,
        onHoldProjects: projects.filter(p => p.status === 'On Hold').length
    };
};

export const calculatePortfolioHealthScore = (projects) => {
    if (projects.length === 0) return 0;

    let totalScore = 0;

    projects.forEach(p => {
        let projectScore = 0;

        // Completion score (40%)
        const completion = p.completion || 0;
        projectScore += (completion / 100) * 40;

        // Budget score (30%)
        const budgetPlan = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        const budgetActual = p.budget?.actual || 0;

        let budgetScore = 0;
        if (budgetPlan > 0) {
            const budgetVariance = ((budgetPlan - budgetActual) / budgetPlan) * 100;
            if (budgetVariance >= 0) {
                budgetScore = 30; // Under or on budget
            } else {
                budgetScore = Math.max(0, 30 + budgetVariance); // Over budget penalty
            }
        } else {
            // If no budget plan, assume full score if no actual spend, else 0
            budgetScore = budgetActual === 0 ? 30 : 0;
        }
        projectScore += budgetScore;

        // Status score (30%)
        if (p.status === 'Completed') projectScore += 30;
        else if (p.status === 'In Progress') projectScore += 20;
        else if (p.status === 'Planning') projectScore += 10;
        else projectScore += 0; // On Hold

        totalScore += projectScore;
    });

    return Math.round(totalScore / projects.length);
};

export const getBudgetUtilizationRate = (projects) => {
    const totalPlan = projects.reduce((sum, p) => {
        const budget = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        return sum + budget;
    }, 0);
    const totalActual = projects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);

    return totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0;
};

export const getTotalCostVariance = (projects) => {
    const totalPlan = projects.reduce((sum, p) => {
        const budget = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        return sum + budget;
    }, 0);
    const totalActual = projects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);

    return {
        variance: totalActual - totalPlan,
        variancePercent: totalPlan > 0 ? Math.round(((totalActual - totalPlan) / totalPlan) * 100) : 0,
        isOverBudget: totalActual > totalPlan
    };
};

// ============================================================================
// 2. FINANCIAL ANALYTICS
// ============================================================================

export const getBudgetByProject = (projects) => {
    return projects
        .map(p => ({
            name: p.name,
            budget: (p.budget?.plan || p.budget) || 0,
            actual: p.budget?.actual || 0,
            completion: p.completion || 0,
            variance: ((p.budget?.actual || 0) - ((p.budget?.plan || p.budget) || 0))
        }))
        .sort((a, b) => b.budget - a.budget);
};

export const getBudgetByBusinessUnit = (projects) => {
    const budgetMap = {};
    projects.forEach(p => {
        const unit = p.businessUnit || 'Unassigned';
        const plan = (p.budget?.plan || p.budget) || 0;
        const actual = p.budget?.actual || 0;

        if (!budgetMap[unit]) {
            budgetMap[unit] = { plan: 0, actual: 0 };
        }
        budgetMap[unit].plan += plan;
        budgetMap[unit].actual += actual;
    });

    return Object.entries(budgetMap).map(([unit, budget]) => ({
        label: unit,
        value: budget.plan,
        actual: budget.actual,
        variance: budget.actual - budget.plan
    }));
};

export const getOverBudgetProjects = (projects) => {
    return projects
        .filter(p => {
            const plan = (p.budget?.plan || p.budget) || 0;
            const actual = p.budget?.actual || 0;
            return actual > plan;
        })
        .map(p => ({
            name: p.name,
            plan: (p.budget?.plan || p.budget) || 0,
            actual: p.budget?.actual || 0,
            variance: (p.budget?.actual || 0) - ((p.budget?.plan || p.budget) || 0),
            variancePercent: ((p.budget?.plan || p.budget) || 0) > 0
                ? Math.round((((p.budget?.actual || 0) - ((p.budget?.plan || p.budget) || 0)) / ((p.budget?.plan || p.budget) || 0)) * 100)
                : 0
        }))
        .sort((a, b) => b.variancePercent - a.variancePercent);
};

export const getCostPerformanceIndex = (projects) => {
    const totalPlan = projects.reduce((sum, p) => {
        const budget = typeof p.budget === 'object' ? (p.budget?.plan || 0) : (p.budget || 0);
        return sum + budget;
    }, 0);
    const totalActual = projects.reduce((sum, p) => sum + (p.budget?.actual || 0), 0);

    // CPI = Planned Value / Actual Cost
    // CPI > 1 = Under budget (good)
    // CPI < 1 = Over budget (bad)
    return totalActual > 0 ? (totalPlan / totalActual).toFixed(2) : 0;
};

// ============================================================================
// 3. RESOURCE MANAGEMENT
// ============================================================================

export const getResourceUtilizationRate = (projects) => {
    const totalPlanDays = projects.reduce((sum, p) => sum + (p.resources?.planManDays || 0), 0);
    const totalActualDays = projects.reduce((sum, p) => sum + (p.resources?.actualManDays || 0), 0);

    return totalPlanDays > 0 ? Math.round((totalActualDays / totalPlanDays) * 100) : 0;
};

export const getResourceAllocationByUnit = (projects) => {
    const resourceMap = {};

    projects.forEach(p => {
        const unit = p.businessUnit || 'Unassigned';
        const planDays = p.resources?.planManDays || 0;
        const actualDays = p.resources?.actualManDays || 0;

        if (!resourceMap[unit]) {
            resourceMap[unit] = { plan: 0, actual: 0 };
        }
        resourceMap[unit].plan += planDays;
        resourceMap[unit].actual += actualDays;
    });

    return Object.entries(resourceMap).map(([unit, resources]) => ({
        label: unit,
        value: resources.plan,
        actual: resources.actual,
        utilization: resources.plan > 0 ? Math.round((resources.actual / resources.plan) * 100) : 0
    }));
};

export const getTopProjectManagers = (projects) => {
    const pmMap = {};
    projects.forEach(p => {
        if (p.pm) {
            if (!pmMap[p.pm]) {
                pmMap[p.pm] = { count: 0, completed: 0, totalBudget: 0 };
            }
            pmMap[p.pm].count++;
            pmMap[p.pm].totalBudget += (p.budget?.plan || p.budget) || 0;
            if (p.status === 'Completed') pmMap[p.pm].completed++;
        }
    });

    return Object.entries(pmMap)
        .map(([pm, data]) => ({
            name: pm,
            projectCount: data.count,
            completedCount: data.completed,
            totalBudget: data.totalBudget,
            successRate: Math.round((data.completed / data.count) * 100)
        }))
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 5);
};

export const getAssigneeWorkload = (workPackages) => {
    const workloadMap = {};
    workPackages.forEach(wp => {
        if (wp.assignee) {
            if (!workloadMap[wp.assignee]) {
                workloadMap[wp.assignee] = { total: 0, completed: 0 };
            }
            workloadMap[wp.assignee].total++;
            if (wp.status === 100) workloadMap[wp.assignee].completed++;
        }
    });

    return Object.entries(workloadMap)
        .map(([assignee, data]) => ({
            name: assignee,
            deliverableCount: data.total,
            completedCount: data.completed,
            completionRate: Math.round((data.completed / data.total) * 100)
        }))
        .sort((a, b) => b.deliverableCount - a.deliverableCount)
        .slice(0, 10);
};

export const getVendorPerformance = (projects) => {
    const vendorMap = {};

    projects.forEach(p => {
        if (p.vendor?.name) {
            if (!vendorMap[p.vendor.name]) {
                vendorMap[p.vendor.name] = {
                    projectCount: 0,
                    totalValue: 0,
                    completedProjects: 0,
                    avgCompletion: 0,
                    totalCompletion: 0
                };
            }
            vendorMap[p.vendor.name].projectCount++;
            vendorMap[p.vendor.name].totalValue += p.vendor.contractValue || 0;
            vendorMap[p.vendor.name].totalCompletion += p.completion || 0;
            if (p.status === 'Completed') vendorMap[p.vendor.name].completedProjects++;
        }
    });

    return Object.entries(vendorMap)
        .map(([vendor, data]) => ({
            name: vendor,
            projectCount: data.projectCount,
            totalValue: data.totalValue,
            completedProjects: data.completedProjects,
            avgCompletion: Math.round(data.totalCompletion / data.projectCount),
            successRate: Math.round((data.completedProjects / data.projectCount) * 100)
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10);
};

// ============================================================================
// 4. STATUS & DISTRIBUTION
// ============================================================================

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

export const getCompletionDistribution = (workPackages) => {
    const ranges = {
        '0-25%': 0,
        '25-50%': 0,
        '50-75%': 0,
        '75-100%': 0
    };

    workPackages.forEach(wp => {
        const status = wp.status || 0;
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

// ============================================================================
// 5. RISK & ISSUES
// ============================================================================

export const getAtRiskProjects = (projects) => {
    // Projects with completion < 50% OR over budget are considered at risk
    return projects
        .filter(p => {
            const lowCompletion = (p.completion || 0) < 50 && p.status !== 'Completed';
            const overBudget = (p.budget?.actual || 0) > ((p.budget?.plan || p.budget) || 0);
            return lowCompletion || overBudget;
        })
        .map(p => {
            const plan = (p.budget?.plan || p.budget) || 0;
            const actual = p.budget?.actual || 0;
            return {
                name: p.name,
                completion: p.completion || 0,
                status: p.status,
                budget: plan,
                actual,
                isOverBudget: actual > plan,
                riskLevel: (p.completion || 0) < 25 ? 'High' : (p.completion || 0) < 50 ? 'Medium' : 'Low'
            };
        })
        .sort((a, b) => a.completion - b.completion);
};

export const getBudgetRiskProjects = (projects) => {
    return projects
        .filter(p => {
            const plan = (p.budget?.plan || p.budget) || 0;
            const actual = p.budget?.actual || 0;
            const additional = p.budget?.additional || 0;
            // At risk if actual + additional > 90% of plan
            return ((actual + additional) / plan) > 0.9 && p.status !== 'Completed';
        })
        .map(p => ({
            name: p.name,
            plan: (p.budget?.plan || p.budget) || 0,
            actual: p.budget?.actual || 0,
            additional: p.budget?.additional || 0,
            remaining: ((p.budget?.plan || p.budget) || 0) - (p.budget?.actual || 0) - (p.budget?.additional || 0),
            utilizationRate: Math.round((((p.budget?.actual || 0) + (p.budget?.additional || 0)) / ((p.budget?.plan || p.budget) || 1)) * 100)
        }))
        .sort((a, b) => b.utilizationRate - a.utilizationRate);
};

export const getProjectRiskMatrix = (projects) => {
    // Risk Matrix: Impact (budget) vs Probability (low completion)
    return projects
        .filter(p => p.status !== 'Completed')
        .map(p => {
            const completion = p.completion || 0;
            const budget = (p.budget?.plan || p.budget) || 0;

            // Probability based on completion (inverse)
            let probability = 'Low';
            if (completion < 25) probability = 'High';
            else if (completion < 50) probability = 'Medium';

            // Impact based on budget size
            let impact = 'Low';
            if (budget > 1000000) impact = 'High';
            else if (budget > 500000) impact = 'Medium';

            return {
                name: p.name,
                probability,
                impact,
                completion,
                budget,
                riskScore: (probability === 'High' ? 3 : probability === 'Medium' ? 2 : 1) *
                    (impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1)
            };
        })
        .sort((a, b) => b.riskScore - a.riskScore);
};

// ============================================================================
// 6. TRENDS & FORECASTING
// ============================================================================

export const getCompletionTrend = (projects) => {
    // Group projects by status and calculate average completion
    const statusGroups = {};

    projects.forEach(p => {
        const status = p.status || 'Unknown';
        if (!statusGroups[status]) {
            statusGroups[status] = { total: 0, count: 0 };
        }
        statusGroups[status].total += p.completion || 0;
        statusGroups[status].count++;
    });

    return Object.entries(statusGroups).map(([status, data]) => ({
        status,
        avgCompletion: Math.round(data.total / data.count),
        projectCount: data.count
    }));
};

export const getBudgetTrend = (projects) => {
    // Calculate budget metrics by business unit
    const unitBudgets = {};

    projects.forEach(p => {
        const unit = p.businessUnit || 'Unassigned';
        if (!unitBudgets[unit]) {
            unitBudgets[unit] = { plan: 0, actual: 0, count: 0 };
        }
        unitBudgets[unit].plan += (p.budget?.plan || p.budget) || 0;
        unitBudgets[unit].actual += p.budget?.actual || 0;
        unitBudgets[unit].count++;
    });

    return Object.entries(unitBudgets).map(([unit, data]) => ({
        unit,
        plan: data.plan,
        actual: data.actual,
        variance: data.actual - data.plan,
        utilizationRate: Math.round((data.actual / data.plan) * 100),
        projectCount: data.count
    }));
};

// ============================================================================
// 7. KPI TRACKING
// ============================================================================

export const getKPIAchievementRate = (projects, finalProducts) => {
    let totalKPIs = 0;
    let achievedKPIs = 0;

    // Count project KPIs
    projects.forEach(p => {
        if (p.kpis && Array.isArray(p.kpis)) {
            totalKPIs += p.kpis.length;
            achievedKPIs += p.kpis.filter(kpi => kpi.actual >= kpi.target).length;
        }
    });

    // Count final product KPIs
    finalProducts.forEach(fp => {
        if (fp.kpis && Array.isArray(fp.kpis)) {
            totalKPIs += fp.kpis.length;
            achievedKPIs += fp.kpis.filter(kpi => kpi.actual >= kpi.target).length;
        }
    });

    return {
        total: totalKPIs,
        achieved: achievedKPIs,
        rate: totalKPIs > 0 ? Math.round((achievedKPIs / totalKPIs) * 100) : 0
    };
};
