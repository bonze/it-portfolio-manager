import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import YearFilter from './YearFilter';
import BusinessUnitFilter from './BusinessUnitFilter';
import MetricCard from './MetricCard';
import PieChart from './PieChart';
import BarChart from './BarChart';
import {
    FaProjectDiagram,
    FaDollarSign,
    FaChartLine,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUsers,
    FaClock,
    FaChartPie,
    FaBalanceScale,
    FaTrophy,
    FaShieldAlt
} from 'react-icons/fa';
import {
    calculatePortfolioMetrics,
    calculatePortfolioHealthScore,
    getBudgetUtilizationRate,
    getTotalCostVariance,
    getStatusDistribution,
    getBudgetByProject,
    getBudgetByBusinessUnit,
    getOverBudgetProjects,
    getCostPerformanceIndex,
    getResourceUtilizationRate,
    getResourceAllocationByUnit,
    getCompletionDistribution,
    getProjectsByBusinessUnit,
    getTopProjectManagers,
    getAssigneeWorkload,
    getVendorPerformance,
    getAtRiskProjects,
    getBudgetRiskProjects,
    getProjectRiskMatrix,
    getCompletionTrend,
    getBudgetTrend,
    getKPIAchievementRate
} from '../utils/analytics';

const AnalyticsDashboard = () => {
    const { state, calculateTimeline } = useStore();
    const { projects: allProjects, finalProducts: allFinalProducts, phases: allPhases, deliverables: allDeliverables, workPackages: allWorkPackages, kpis: allKpis } = state;
    const currentYear = new Date().getFullYear();
    const [selectedYears, setSelectedYears] = useState([currentYear]);
    const [selectedBUs, setSelectedBUs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Filter projects
    const projects = allProjects.filter(project => {
        const timeline = calculateTimeline(project.id, 'project');
        const projectYear = timeline.startDate ? new Date(timeline.startDate).getFullYear() : (project.year || currentYear);
        const matchesYear = selectedYears.includes(projectYear);
        const matchesBU = selectedBUs.length === 0 || selectedBUs.includes(project.businessUnit);
        return matchesYear && matchesBU;
    });

    const projectIds = new Set(projects.map(p => p.id));

    // Filter child entities
    const finalProducts = allFinalProducts.filter(fp => projectIds.has(fp.projectId));
    const finalProductIds = new Set(finalProducts.map(fp => fp.id));

    const phases = allPhases.filter(p => finalProductIds.has(p.finalProductId));
    const phaseIds = new Set(phases.map(p => p.id));

    const deliverables = allDeliverables.filter(d => phaseIds.has(d.phaseId));
    const deliverableIds = new Set(deliverables.map(d => d.id));

    const workPackages = allWorkPackages.filter(wp => deliverableIds.has(wp.deliverableId));
    const workPackageIds = new Set(workPackages.map(wp => wp.id));

    // Filter KPIs
    const kpis = allKpis.filter(kpi => {
        if (kpi.entityType === 'project') return projectIds.has(kpi.entityId);
        if (kpi.entityType === 'final-product') return finalProductIds.has(kpi.entityId);
        if (kpi.entityType === 'phase') return phaseIds.has(kpi.entityId);
        if (kpi.entityType === 'deliverable') return deliverableIds.has(kpi.entityId);
        if (kpi.entityType === 'work-package') return workPackageIds.has(kpi.entityId);
        return false;
    });

    // Calculate all metrics
    const portfolioMetrics = calculatePortfolioMetrics(projects, finalProducts, phases, deliverables, workPackages);
    const healthScore = calculatePortfolioHealthScore(projects);
    const budgetUtilization = getBudgetUtilizationRate(projects);
    const costVariance = getTotalCostVariance(projects);
    const cpi = getCostPerformanceIndex(projects);
    const resourceUtilization = getResourceUtilizationRate(projects);
    const kpiAchievement = getKPIAchievementRate(kpis);

    const statusDist = getStatusDistribution(projects);
    const budgetByProject = getBudgetByProject(projects).slice(0, 10);
    const budgetByUnit = getBudgetByBusinessUnit(projects);
    const overBudgetProjects = getOverBudgetProjects(projects);
    const completionDist = getCompletionDistribution(workPackages);
    const projectsByUnit = getProjectsByBusinessUnit(projects);
    const topPMs = getTopProjectManagers(projects);
    const assigneeWorkload = getAssigneeWorkload(workPackages);
    const vendorPerformance = getVendorPerformance(projects);
    const atRiskProjects = getAtRiskProjects(projects);
    const budgetRiskProjects = getBudgetRiskProjects(projects);
    const riskMatrix = getProjectRiskMatrix(projects);
    const completionTrend = getCompletionTrend(projects);
    const budgetTrend = getBudgetTrend(projects);
    const resourceAllocation = getResourceAllocationByUnit(projects);

    const formatCurrency = (value) => `$${value.toLocaleString()}`;

    const tabs = [
        { id: 'overview', label: 'Executive Overview', icon: FaChartPie },
        { id: 'financial', label: 'Financial Analytics', icon: FaDollarSign },
        { id: 'resources', label: 'Resource Management', icon: FaUsers },
        { id: 'risks', label: 'Risk & Issues', icon: FaExclamationTriangle },
        { id: 'performance', label: 'Performance & KPIs', icon: FaTrophy }
    ];

    return (
        <div className="w-full px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-50">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <BusinessUnitFilter
                        projects={allProjects}
                        selectedBUs={selectedBUs}
                        onChange={setSelectedBUs}
                        align="responsive"
                    />
                    <YearFilter
                        selectedYears={selectedYears}
                        onChange={setSelectedYears}
                        align="responsive"
                    />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-accent-color text-white'
                                : 'bg-bg-secondary text-text-primary hover:bg-bg-primary'
                                }`}
                        >
                            <Icon />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div>
                    {/* Executive Summary Cards */}
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Executive Summary</h2>
                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-4 mb-8">
                        <MetricCard
                            label="Portfolio Health Score"
                            value={`${healthScore}/100`}
                            icon={FaShieldAlt}
                            color={healthScore >= 75 ? 'success' : healthScore >= 50 ? 'warning' : 'error'}
                        />
                        <MetricCard
                            label="Total Projects"
                            value={portfolioMetrics.totalProjects}
                            icon={FaProjectDiagram}
                            color="accent"
                            subtitle={`${portfolioMetrics.activeProjects} active, ${portfolioMetrics.completedProjects} completed`}
                        />
                        <MetricCard
                            label="Total Budget"
                            value={formatCurrency(portfolioMetrics.totalBudget)}
                            icon={FaDollarSign}
                            color="success"
                            subtitle={`Utilized: ${budgetUtilization}%`}
                        />
                        <MetricCard
                            label="Average Completion"
                            value={`${portfolioMetrics.averageCompletion}%`}
                            icon={FaChartLine}
                            color="primary"
                        />
                    </div>

                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-4 mb-8">
                        <MetricCard
                            label="Cost Variance"
                            value={formatCurrency(Math.abs(costVariance.variance))}
                            icon={FaBalanceScale}
                            color={costVariance.isOverBudget ? 'error' : 'success'}
                            subtitle={`${costVariance.isOverBudget ? 'Over' : 'Under'} budget (${costVariance.variancePercent}%)`}
                        />
                        <MetricCard
                            label="Cost Performance Index"
                            value={cpi}
                            icon={FaChartLine}
                            color={cpi >= 1 ? 'success' : 'warning'}
                            subtitle={cpi >= 1 ? 'Under budget' : 'Over budget'}
                        />
                        <MetricCard
                            label="Resource Utilization"
                            value={`${resourceUtilization}%`}
                            icon={FaUsers}
                            color={resourceUtilization <= 100 ? 'success' : 'warning'}
                        />
                        <MetricCard
                            label="Projects At Risk"
                            value={atRiskProjects.length}
                            icon={FaExclamationTriangle}
                            color={atRiskProjects.length > 0 ? 'warning' : 'success'}
                        />
                    </div>

                    {/* Status & Distribution Charts */}
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4 mt-8">Portfolio Distribution</h2>
                    <div className="grid grid-cols-1 grid-cols-lg-2 gap-4 md:gap-6 mb-6">
                        {statusDist.length > 0 && (
                            <PieChart
                                data={statusDist}
                                title="Project Status Distribution"
                            />
                        )}
                        {budgetByUnit.length > 0 && (
                            <PieChart
                                data={budgetByUnit}
                                title="Budget by Business Unit"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 grid-cols-lg-2 gap-4 md:gap-6 mb-6">
                        {projectsByUnit.length > 0 && (
                            <BarChart
                                data={projectsByUnit}
                                title="Projects by Business Unit"
                            />
                        )}
                        {completionDist.length > 0 && (
                            <BarChart
                                data={completionDist}
                                title="Deliverable Completion Distribution"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* FINANCIAL TAB */}
            {activeTab === 'financial' && (
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Financial Performance</h2>

                    {/* Financial Summary Cards */}
                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-4 mb-8">
                        <MetricCard
                            label="Total Planned Budget"
                            value={formatCurrency(portfolioMetrics.totalBudget)}
                            icon={FaDollarSign}
                            color="primary"
                        />
                        <MetricCard
                            label="Total Actual Spend"
                            value={formatCurrency(portfolioMetrics.totalBudgetActual)}
                            icon={FaDollarSign}
                            color="accent"
                        />
                        <MetricCard
                            label="Budget Utilization"
                            value={`${budgetUtilization}%`}
                            icon={FaChartLine}
                            color={budgetUtilization <= 90 ? 'success' : 'warning'}
                        />
                        <MetricCard
                            label="Over-Budget Projects"
                            value={overBudgetProjects.length}
                            icon={FaExclamationTriangle}
                            color={overBudgetProjects.length > 0 ? 'error' : 'success'}
                        />
                    </div>

                    {/* Budget Charts */}
                    <div className="grid grid-cols-1 grid-cols-lg-2 gap-4 md:gap-6 mb-6">
                        {budgetByProject.length > 0 && (
                            <BarChart
                                data={budgetByProject.map(p => ({
                                    label: p.name,
                                    value: p.budget,
                                    completion: p.completion
                                }))}
                                title="Top 10 Projects by Budget"
                                valueFormatter={formatCurrency}
                                showPercentage={true}
                            />
                        )}
                        {budgetTrend.length > 0 && (
                            <BarChart
                                data={budgetTrend.map(t => ({
                                    label: t.unit,
                                    value: t.actual
                                }))}
                                title="Actual Spend by Business Unit"
                                valueFormatter={formatCurrency}
                            />
                        )}
                    </div>

                    {/* Over-Budget Projects Table */}
                    {overBudgetProjects.length > 0 && (
                        <div className="card p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaExclamationTriangle className="text-error-color" />
                                Over-Budget Projects
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-color">
                                            <th className="text-left p-2">Project</th>
                                            <th className="text-right p-2">Planned</th>
                                            <th className="text-right p-2">Actual</th>
                                            <th className="text-right p-2">Variance</th>
                                            <th className="text-right p-2">%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overBudgetProjects.map((p, idx) => (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{p.name}</td>
                                                <td className="text-right p-2">{formatCurrency(p.plan)}</td>
                                                <td className="text-right p-2">{formatCurrency(p.actual)}</td>
                                                <td className="text-right p-2 text-error-color">
                                                    +{formatCurrency(p.variance)}
                                                </td>
                                                <td className="text-right p-2 text-error-color">
                                                    +{p.variancePercent}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Resource Management</h2>

                    {/* Resource Summary */}
                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-4 mb-8">
                        <MetricCard
                            label="Resource Utilization"
                            value={`${resourceUtilization}%`}
                            icon={FaUsers}
                            color={resourceUtilization <= 100 ? 'success' : 'warning'}
                        />
                        <MetricCard
                            label="Active Project Managers"
                            value={topPMs.length}
                            icon={FaUsers}
                            color="accent"
                        />
                        <MetricCard
                            label="Active Assignees"
                            value={assigneeWorkload.length}
                            icon={FaUsers}
                            color="primary"
                        />
                    </div>

                    {/* Resource Charts */}
                    <div className="grid grid-cols-1 grid-cols-lg-2 gap-4 md:gap-6 mb-6">
                        {resourceAllocation.length > 0 && (
                            <BarChart
                                data={resourceAllocation.map(r => ({
                                    label: r.label,
                                    value: r.actual
                                }))}
                                title="Resource Allocation by Business Unit (Man-Days)"
                            />
                        )}
                        {assigneeWorkload.length > 0 && (
                            <BarChart
                                data={assigneeWorkload.map(a => ({
                                    label: a.name,
                                    value: a.deliverableCount
                                }))}
                                title="Top 10 Assignees by Workload"
                            />
                        )}
                    </div>

                    {/* Project Managers Performance */}
                    {topPMs.length > 0 && (
                        <div className="card p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Top Project Managers</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-color">
                                            <th className="text-left p-2">Project Manager</th>
                                            <th className="text-right p-2">Projects</th>
                                            <th className="text-right p-2">Completed</th>
                                            <th className="text-right p-2">Success Rate</th>
                                            <th className="text-right p-2">Total Budget</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topPMs.map((pm, idx) => (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{pm.name}</td>
                                                <td className="text-right p-2">{pm.projectCount}</td>
                                                <td className="text-right p-2">{pm.completedCount}</td>
                                                <td className="text-right p-2">
                                                    <span className={pm.successRate >= 80 ? 'text-success-color' : 'text-warning-color'}>
                                                        {pm.successRate}%
                                                    </span>
                                                </td>
                                                <td className="text-right p-2">{formatCurrency(pm.totalBudget)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Vendor Performance */}
                    {vendorPerformance.length > 0 && (
                        <div className="card p-4">
                            <h3 className="text-lg font-semibold mb-4">Vendor Performance</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-color">
                                            <th className="text-left p-2">Vendor</th>
                                            <th className="text-right p-2">Projects</th>
                                            <th className="text-right p-2">Contract Value</th>
                                            <th className="text-right p-2">Avg Completion</th>
                                            <th className="text-right p-2">Success Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendorPerformance.map((v, idx) => (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{v.name}</td>
                                                <td className="text-right p-2">{v.projectCount}</td>
                                                <td className="text-right p-2">{formatCurrency(v.totalValue)}</td>
                                                <td className="text-right p-2">{v.avgCompletion}%</td>
                                                <td className="text-right p-2">
                                                    <span className={v.successRate >= 80 ? 'text-success-color' : 'text-warning-color'}>
                                                        {v.successRate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* RISKS TAB */}
            {activeTab === 'risks' && (
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Risk & Issues Management</h2>

                    {/* Risk Summary */}
                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-4 mb-8">
                        <MetricCard
                            label="Total At-Risk Projects"
                            value={atRiskProjects.length}
                            icon={FaExclamationTriangle}
                            color={atRiskProjects.length > 0 ? 'error' : 'success'}
                        />
                        <MetricCard
                            label="High Risk Projects"
                            value={atRiskProjects.filter(p => p.riskLevel === 'High').length}
                            icon={FaExclamationTriangle}
                            color="error"
                        />
                        <MetricCard
                            label="Budget Risk Projects"
                            value={budgetRiskProjects.length}
                            icon={FaDollarSign}
                            color={budgetRiskProjects.length > 0 ? 'warning' : 'success'}
                        />
                        <MetricCard
                            label="Critical Projects"
                            value={riskMatrix.filter(p => p.riskScore >= 6).length}
                            icon={FaShieldAlt}
                            color="error"
                        />
                    </div>

                    {/* At-Risk Projects */}
                    {atRiskProjects.length > 0 && (
                        <div className="card p-4 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaExclamationTriangle className="text-warning-color" />
                                <h3 className="text-lg font-semibold">At-Risk Projects</h3>
                            </div>
                            <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-3">
                                {atRiskProjects.map((project, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 bg-bg-primary rounded border ${project.riskLevel === 'High' ? 'border-error-color' :
                                            project.riskLevel === 'Medium' ? 'border-warning-color' :
                                                'border-border-color'
                                            }`}
                                    >
                                        <div className="text-text-primary font-semibold mb-1">{project.name}</div>
                                        <div className="text-sm text-muted">Status: {project.status}</div>
                                        <div className="text-sm text-muted">Completion: {project.completion}%</div>
                                        <div className="text-sm text-muted">Budget: {formatCurrency(project.budget)}</div>
                                        {project.isOverBudget && (
                                            <div className="text-sm text-error-color mt-1">⚠️ Over Budget</div>
                                        )}
                                        <div className={`text-sm mt-1 font-semibold ${project.riskLevel === 'High' ? 'text-error-color' :
                                            project.riskLevel === 'Medium' ? 'text-warning-color' :
                                                'text-success-color'
                                            }`}>
                                            Risk: {project.riskLevel}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Budget Risk Projects */}
                    {budgetRiskProjects.length > 0 && (
                        <div className="card p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Budget Risk Projects (≥90% Utilized)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-color">
                                            <th className="text-left p-2">Project</th>
                                            <th className="text-right p-2">Planned</th>
                                            <th className="text-right p-2">Actual</th>
                                            <th className="text-right p-2">Remaining</th>
                                            <th className="text-right p-2">Utilization</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {budgetRiskProjects.map((p, idx) => (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{p.name}</td>
                                                <td className="text-right p-2">{formatCurrency(p.plan)}</td>
                                                <td className="text-right p-2">{formatCurrency(p.actual)}</td>
                                                <td className="text-right p-2">
                                                    <span className={p.remaining < 0 ? 'text-error-color' : 'text-warning-color'}>
                                                        {formatCurrency(p.remaining)}
                                                    </span>
                                                </td>
                                                <td className="text-right p-2">
                                                    <span className={p.utilizationRate >= 100 ? 'text-error-color' : 'text-warning-color'}>
                                                        {p.utilizationRate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Risk Matrix */}
                    {riskMatrix.length > 0 && (
                        <div className="card p-4">
                            <h3 className="text-lg font-semibold mb-4">Project Risk Matrix</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-color">
                                            <th className="text-left p-2">Project</th>
                                            <th className="text-center p-2">Probability</th>
                                            <th className="text-center p-2">Impact</th>
                                            <th className="text-right p-2">Completion</th>
                                            <th className="text-right p-2">Budget</th>
                                            <th className="text-center p-2">Risk Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskMatrix.slice(0, 10).map((p, idx) => (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{p.name}</td>
                                                <td className="text-center p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${p.probability === 'High' ? 'bg-error-color text-white' :
                                                        p.probability === 'Medium' ? 'bg-warning-color text-white' :
                                                            'bg-success-color text-white'
                                                        }`}>
                                                        {p.probability}
                                                    </span>
                                                </td>
                                                <td className="text-center p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${p.impact === 'High' ? 'bg-error-color text-white' :
                                                        p.impact === 'Medium' ? 'bg-warning-color text-white' :
                                                            'bg-success-color text-white'
                                                        }`}>
                                                        {p.impact}
                                                    </span>
                                                </td>
                                                <td className="text-right p-2">{p.completion}%</td>
                                                <td className="text-right p-2">{formatCurrency(p.budget)}</td>
                                                <td className="text-center p-2">
                                                    <span className={`font-bold ${p.riskScore >= 6 ? 'text-error-color' :
                                                        p.riskScore >= 4 ? 'text-warning-color' :
                                                            'text-success-color'
                                                        }`}>
                                                        {p.riskScore}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Performance & KPIs</h2>

                    {/* Performance Summary */}
                    <div className="horizontal-scroll grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-4 mb-8">
                        <MetricCard
                            label="KPI Achievement Rate"
                            value={`${kpiAchievement.rate}%`}
                            icon={FaTrophy}
                            color={kpiAchievement.rate >= 80 ? 'success' : kpiAchievement.rate >= 60 ? 'warning' : 'error'}
                            subtitle={`${kpiAchievement.achieved} of ${kpiAchievement.total} KPIs`}
                        />
                        <MetricCard
                            label="Completed Projects"
                            value={portfolioMetrics.completedProjects}
                            icon={FaCheckCircle}
                            color="success"
                            subtitle={`${Math.round((portfolioMetrics.completedProjects / portfolioMetrics.totalProjects) * 100)}% of total`}
                        />
                        <MetricCard
                            label="In Progress"
                            value={portfolioMetrics.activeProjects}
                            icon={FaClock}
                            color="accent"
                        />
                        <MetricCard
                            label="On Hold"
                            value={portfolioMetrics.onHoldProjects}
                            icon={FaExclamationTriangle}
                            color="warning"
                        />
                    </div>

                    {/* Performance Trends */}
                    <div className="grid grid-cols-1 grid-cols-lg-2 gap-4 md:gap-6 mb-6">
                        {completionTrend.length > 0 && (
                            <BarChart
                                data={completionTrend.map(t => ({
                                    label: t.status,
                                    value: t.avgCompletion
                                }))}
                                title="Average Completion by Status"
                            />
                        )}
                        {budgetTrend.length > 0 && (
                            <BarChart
                                data={budgetTrend.map(t => ({
                                    label: t.unit,
                                    value: t.utilizationRate
                                }))}
                                title="Budget Utilization by Business Unit (%)"
                            />
                        )}
                    </div>

                    {/* Detailed Performance Table */}
                    <div className="card p-4">
                        <h3 className="text-lg font-semibold mb-4">Project Performance Summary</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border-color">
                                        <th className="text-left p-2">Project</th>
                                        <th className="text-center p-2">Status</th>
                                        <th className="text-right p-2">Completion</th>
                                        <th className="text-right p-2">Budget</th>
                                        <th className="text-right p-2">CPI</th>
                                        <th className="text-center p-2">Health</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.slice(0, 15).map((p, idx) => {
                                        const plan = (p.budget?.plan || p.budget) || 1;
                                        const actual = p.budget?.actual || 0;
                                        const projectCPI = actual > 0 ? (plan / actual).toFixed(2) : 'N/A';
                                        const completion = p.completion || 0;
                                        const health = completion >= 75 ? 'Good' : completion >= 50 ? 'Fair' : 'Poor';

                                        return (
                                            <tr key={idx} className="border-b border-border-color">
                                                <td className="p-2">{p.name}</td>
                                                <td className="text-center p-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'Completed' ? 'bg-success-color text-white' :
                                                        p.status === 'In Progress' ? 'bg-accent-color text-white' :
                                                            p.status === 'Planning' ? 'bg-primary-color text-white' :
                                                                'bg-warning-color text-white'
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="text-right p-2">{completion}%</td>
                                                <td className="text-right p-2">{formatCurrency(plan)}</td>
                                                <td className="text-right p-2">
                                                    <span className={typeof projectCPI === 'number' && projectCPI >= 1 ? 'text-success-color' : 'text-warning-color'}>
                                                        {projectCPI}
                                                    </span>
                                                </td>
                                                <td className="text-center p-2">
                                                    <span className={`font-semibold ${health === 'Good' ? 'text-success-color' :
                                                        health === 'Fair' ? 'text-warning-color' :
                                                            'text-error-color'
                                                        }`}>
                                                        {health}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
