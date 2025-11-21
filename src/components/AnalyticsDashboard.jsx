import React from 'react';
import { useStore } from '../context/StoreContext';
import MetricCard from './MetricCard';
import PieChart from './PieChart';
import BarChart from './BarChart';
import {
    FaProjectDiagram,
    FaDollarSign,
    FaChartLine,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import {
    calculatePortfolioMetrics,
    getStatusDistribution,
    getBudgetByProject,
    getBudgetByBusinessUnit,
    getCompletionDistribution,
    getProjectsByBusinessUnit,
    getTopProjectManagers,
    getAssigneeWorkload,
    getAtRiskProjects
} from '../utils/analytics';

const AnalyticsDashboard = () => {
    const { state } = useStore();
    const { projects, goals, scopes, deliverables } = state;

    // Calculate metrics
    const portfolioMetrics = calculatePortfolioMetrics(projects, goals, scopes, deliverables);
    const statusDist = getStatusDistribution(projects);
    const budgetByProject = getBudgetByProject(projects).slice(0, 10);
    const budgetByUnit = getBudgetByBusinessUnit(projects);
    const completionDist = getCompletionDistribution(deliverables);
    const projectsByUnit = getProjectsByBusinessUnit(projects);
    const topPMs = getTopProjectManagers(projects);
    const assigneeWorkload = getAssigneeWorkload(deliverables);
    const atRiskProjects = getAtRiskProjects(projects);

    const formatCurrency = (value) => `$${value.toLocaleString()}`;

    return (
        <div className="max-w-full mx-auto p-6">
            <h1 className="text-3xl font-bold text-text-primary mb-8">Analytics Dashboard</h1>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    label="Total Projects"
                    value={portfolioMetrics.totalProjects}
                    icon={FaProjectDiagram}
                    color="accent"
                />
                <MetricCard
                    label="Total Budget"
                    value={formatCurrency(portfolioMetrics.totalBudget)}
                    icon={FaDollarSign}
                    color="success"
                />
                <MetricCard
                    label="Average Completion"
                    value={`${portfolioMetrics.averageCompletion}%`}
                    icon={FaChartLine}
                    color="primary"
                />
                <MetricCard
                    label="Active Projects"
                    value={portfolioMetrics.activeProjects}
                    icon={FaCheckCircle}
                    color="warning"
                />
            </div>

            {/* Charts Row 1 - Status & Budget Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
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

            {/* Charts Row 2 - Budget & Completion Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {budgetByProject.length > 0 && (
                    <BarChart
                        data={budgetByProject.map(p => ({ label: p.name, value: p.budget, completion: p.completion }))}
                        title="Top 10 Projects by Budget"
                        valueFormatter={formatCurrency}
                        showPercentage={true}
                    />
                )}
                {completionDist.length > 0 && (
                    <BarChart
                        data={completionDist}
                        title="Deliverable Completion Distribution"
                    />
                )}
            </div>

            {/* Charts Row 3 - Resource Allocation */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {projectsByUnit.length > 0 && (
                    <BarChart
                        data={projectsByUnit}
                        title="Projects by Business Unit"
                    />
                )}
                {topPMs.length > 0 && (
                    <div className="card p-4">
                        <h3 className="text-lg font-semibold mb-4">Top Project Managers</h3>
                        <div className="flex flex-col gap-2">
                            {topPMs.map((pm, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-bg-primary rounded">
                                    <span className="text-text-primary">{pm.name}</span>
                                    <span className="text-accent-color font-semibold">{pm.projectCount} projects</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Assignee Workload */}
            {assigneeWorkload.length > 0 && (
                <div className="mb-6">
                    <BarChart
                        data={assigneeWorkload.map(a => ({ label: a.name, value: a.deliverableCount }))}
                        title="Top 10 Assignees by Workload"
                    />
                </div>
            )}

            {/* At-Risk Projects */}
            {atRiskProjects.length > 0 && (
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <FaExclamationTriangle className="text-warning-color" />
                        <h3 className="text-lg font-semibold">At-Risk Projects (Completion &lt; 50%)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {atRiskProjects.map((project, idx) => (
                            <div key={idx} className="p-3 bg-bg-primary rounded border border-warning-color">
                                <div className="text-text-primary font-semibold mb-1">{project.name}</div>
                                <div className="text-sm text-muted">Status: {project.status}</div>
                                <div className="text-sm text-muted">Completion: {project.completion}%</div>
                                <div className="text-sm text-muted">Budget: {formatCurrency(project.budget)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
