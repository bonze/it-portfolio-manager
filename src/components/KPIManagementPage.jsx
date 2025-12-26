import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const KPIManagementPage = () => {
    const { state, dispatch } = useStore();
    const { kpis, projects, finalProducts, phases, deliverables, workPackages } = state;
    const navigate = useNavigate();

    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get entity name by ID and type
    const getEntityName = (entityType, entityId) => {
        let entity;
        switch (entityType) {
            case 'project':
                entity = projects.find(p => p.id === entityId);
                return entity?.name || 'Unknown Project';
            case 'final-product':
                entity = finalProducts.find(fp => fp.id === entityId);
                return entity?.description || 'Unknown Final Product';
            case 'phase':
                entity = phases.find(p => p.id === entityId);
                return entity?.description || 'Unknown Phase';
            case 'deliverable':
                entity = deliverables.find(d => d.id === entityId);
                return entity?.description || 'Unknown Deliverable';
            case 'work-package':
                entity = workPackages.find(wp => wp.id === entityId);
                return entity?.description || 'Unknown Work Package';
            default:
                return 'Unknown';
        }
    };

    // Calculate KPI status
    const getKPIStatus = (kpi) => {
        const achievement = (kpi.actual / kpi.target) * 100;
        if (achievement >= 100) return 'Achieved';
        if (achievement >= 80) return 'On Track';
        if (achievement >= 60) return 'At Risk';
        return 'Behind';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Achieved': return 'text-success-color';
            case 'On Track': return 'text-primary-color';
            case 'At Risk': return 'text-warning-color';
            case 'Behind': return 'text-error-color';
            default: return 'text-muted';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Achieved': return <FaCheckCircle />;
            case 'On Track': return <FaArrowUp />;
            case 'At Risk': return <FaExclamationTriangle />;
            case 'Behind': return <FaTimesCircle />;
            default: return <FaMinus />;
        }
    };

    // Filter KPIs
    const filteredKPIs = useMemo(() => {
        return kpis.filter(kpi => {
            const matchesType = filterType === 'all' || kpi.entityType === filterType;
            const status = getKPIStatus(kpi);
            const matchesStatus = filterStatus === 'all' || status === filterStatus;
            const matchesSearch = searchTerm === '' ||
                kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getEntityName(kpi.entityType, kpi.entityId).toLowerCase().includes(searchTerm.toLowerCase());

            return matchesType && matchesStatus && matchesSearch;
        });
    }, [kpis, filterType, filterStatus, searchTerm]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = kpis.length;
        const achieved = kpis.filter(kpi => getKPIStatus(kpi) === 'Achieved').length;
        const atRisk = kpis.filter(kpi => ['At Risk', 'Behind'].includes(getKPIStatus(kpi))).length;
        const avgPerformance = total > 0
            ? Math.round(kpis.reduce((sum, kpi) => sum + (kpi.actual / kpi.target) * 100, 0) / total)
            : 0;

        return { total, achieved, atRisk, avgPerformance };
    }, [kpis]);

    const handleDelete = async (kpiId) => {
        if (window.confirm('Are you sure you want to delete this KPI?')) {
            const kpi = kpis.find(k => k.id === kpiId);
            await dispatch({
                type: 'DELETE_KPI',
                payload: {
                    entityId: kpi.entityId,
                    entityType: kpi.entityType,
                    kpiId: kpiId
                }
            });
        }
    };

    return (
        <div className="w-full px-4 py-6 md:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
                    <FaTrophy className="text-accent-color" />
                    KPI Management
                </h1>
                <p className="text-muted mt-2">Manage and track Key Performance Indicators across all projects</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card">
                    <div className="text-sm text-muted mb-1">Total KPIs</div>
                    <div className="text-3xl font-bold text-accent-color">{stats.total}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Achieved</div>
                    <div className="text-3xl font-bold text-success-color">{stats.achieved}</div>
                    <div className="text-xs text-muted mt-1">
                        {stats.total > 0 ? Math.round((stats.achieved / stats.total) * 100) : 0}% Achievement Rate
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">At Risk</div>
                    <div className="text-3xl font-bold text-warning-color">{stats.atRisk}</div>
                    <div className="text-xs text-muted mt-1">Needs Attention</div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Avg Performance</div>
                    <div className="text-3xl font-bold text-primary-color">{stats.avgPerformance}%</div>
                    <div className="text-xs text-muted mt-1">Overall Progress</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search KPIs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Types</option>
                            <option value="project">Projects</option>
                            <option value="final-product">Final Products</option>
                            <option value="phase">Phases</option>
                            <option value="deliverable">Deliverables</option>
                            <option value="work-package">Work Packages</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Achieved">Achieved</option>
                            <option value="On Track">On Track</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Behind">Behind</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* KPI Table */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-color">
                                <th className="text-left p-3 text-sm font-semibold">Entity</th>
                                <th className="text-left p-3 text-sm font-semibold">KPI Name</th>
                                <th className="text-right p-3 text-sm font-semibold">Target</th>
                                <th className="text-right p-3 text-sm font-semibold">Actual</th>
                                <th className="text-center p-3 text-sm font-semibold">Progress</th>
                                <th className="text-center p-3 text-sm font-semibold">Status</th>
                                <th className="text-center p-3 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKPIs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-8 text-muted">
                                        No KPIs found. {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Add KPIs to your projects to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredKPIs.map(kpi => {
                                    const status = getKPIStatus(kpi);
                                    const progress = Math.round((kpi.actual / kpi.target) * 100);

                                    return (
                                        <tr key={kpi.id} className="border-b border-border-color hover:bg-bg-secondary">
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{getEntityName(kpi.entityType, kpi.entityId)}</span>
                                                    <span className="text-xs text-muted capitalize">{kpi.entityType.replace('-', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-sm">{kpi.name}</span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-sm">{kpi.target} {kpi.unit}</span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="text-sm font-medium">{kpi.actual} {kpi.unit}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-full bg-bg-secondary rounded-full h-2">
                                                        <div
                                                            className={`h-full rounded-full ${progress >= 100 ? 'bg-success-color' :
                                                                    progress >= 80 ? 'bg-primary-color' :
                                                                        progress >= 60 ? 'bg-warning-color' :
                                                                            'bg-error-color'
                                                                }`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted">{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className={`flex items-center justify-center gap-1 ${getStatusColor(status)}`}>
                                                    {getStatusIcon(status)}
                                                    <span className="text-sm">{status}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(kpi.id)}
                                                        className="text-error-color hover:text-error-color/80"
                                                        title="Delete KPI"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KPIManagementPage;
