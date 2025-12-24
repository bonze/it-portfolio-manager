import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const StoreContext = createContext();

const initialState = {
    projects: [],
    finalProducts: [],
    phases: [],
    deliverables: [],
    workPackages: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            return action.payload;
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'DELETE_PROJECTS':
            return {
                ...state,
                projects: state.projects.filter(p => !action.payload.ids.includes(p.id))
            };
        case 'ADD_FINAL_PRODUCT':
            return { ...state, finalProducts: [...state.finalProducts, action.payload] };
        case 'ADD_PHASE':
            return { ...state, phases: [...state.phases, action.payload] };
        case 'ADD_DELIVERABLE':
            return { ...state, deliverables: [...state.deliverables, action.payload] };
        case 'ADD_WORK_PACKAGE':
            return { ...state, workPackages: [...state.workPackages, action.payload] };
        case 'UPDATE_WORK_PACKAGE':
            return {
                ...state,
                workPackages: state.workPackages.map((wp) =>
                    wp.id === action.payload.id ? { ...wp, ...action.payload } : wp
                ),
            };
        case 'UPDATE_ENTITY': // Generic update
            const { type, id, data } = action.payload;
            // Map type to list name: project->projects, final-product->finalProducts, phase->phases, etc.
            let listName = '';
            if (type === 'project') listName = 'projects';
            else if (type === 'final-product') listName = 'finalProducts';
            else if (type === 'phase') listName = 'phases';
            else if (type === 'deliverable') listName = 'deliverables';
            else if (type === 'work-package') listName = 'workPackages';

            if (!listName) return state;

            return {
                ...state,
                [listName]: state[listName].map(item => item.id === id ? { ...item, ...data } : item)
            };

        // --- KPI Management ---
        case 'ADD_KPI': {
            const { entityId, entityType, kpi } = action.payload;
            let list = '';
            if (entityType === 'project') list = 'projects';
            else if (entityType === 'final-product') list = 'finalProducts';
            else if (entityType === 'phase') list = 'phases';
            else if (entityType === 'deliverable') list = 'deliverables';
            else if (entityType === 'work-package') list = 'workPackages';

            if (!list) return state;

            return {
                ...state,
                [list]: state[list].map(item => {
                    if (item.id === entityId) {
                        return { ...item, kpis: [...(item.kpis || []), kpi] };
                    }
                    return item;
                })
            };
        }
        case 'UPDATE_KPI': {
            const { entityId, entityType, kpi } = action.payload;
            let list = '';
            if (entityType === 'project') list = 'projects';
            else if (entityType === 'final-product') list = 'finalProducts';
            else if (entityType === 'phase') list = 'phases';
            else if (entityType === 'deliverable') list = 'deliverables';
            else if (entityType === 'work-package') list = 'workPackages';

            if (!list) return state;

            return {
                ...state,
                [list]: state[list].map(item => {
                    if (item.id === entityId) {
                        return {
                            ...item,
                            kpis: item.kpis.map(k => k.id === kpi.id ? kpi : k)
                        };
                    }
                    return item;
                })
            };
        }
        case 'DELETE_KPI': {
            const { entityId, entityType, kpiId } = action.payload;
            let list = '';
            if (entityType === 'project') list = 'projects';
            else if (entityType === 'final-product') list = 'finalProducts';
            else if (entityType === 'phase') list = 'phases';
            else if (entityType === 'deliverable') list = 'deliverables';
            else if (entityType === 'work-package') list = 'workPackages';

            if (!list) return state;

            return {
                ...state,
                [list]: state[list].map(item => {
                    if (item.id === entityId) {
                        return {
                            ...item,
                            kpis: item.kpis.filter(k => k.id !== kpiId)
                        };
                    }
                    return item;
                })
            };
        }

        // --- Baseline Management ---
        case 'SUBMIT_CHANGE_REQUEST': {
            const { projectId, request } = action.payload;
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === projectId ? { ...p, pendingChanges: request } : p
                )
            };
        }
        case 'APPROVE_BASELINE_CHANGE': {
            const { projectId, newBaselineVersion, snapshot } = action.payload;
            return {
                ...state,
                projects: state.projects.map(p => {
                    if (p.id === projectId) {
                        return {
                            ...p,
                            baseline: newBaselineVersion,
                            baselineHistory: [...(p.baselineHistory || []), snapshot],
                            pendingChanges: null
                        };
                    }
                    return p;
                })
            };
        }
        case 'REJECT_BASELINE_CHANGE': {
            const { projectId } = action.payload;
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === projectId ? { ...p, pendingChanges: null } : p
                )
            };
        }

        case 'RESET_DATA':
            return initialState;
        default:
            return state;
    }
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auth Logic
    const login = async (username, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            let errorMessage = 'Login failed';
            try {
                const data = await res.json();
                errorMessage = data.message || errorMessage;
            } catch (e) {
                const text = await res.text();
                errorMessage = text || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchData(data.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        dispatch({ type: 'LOAD_DATA', payload: initialState });
    };

    // Data Fetching
    const fetchData = async (token) => {
        if (!token) return;
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const fetchJson = async (url) => {
                const r = await fetch(url, { headers });
                if (!r.ok) {
                    const text = await r.text();
                    console.error(`Fetch error for ${url}: ${r.status} ${text}`);
                    return []; // Return empty array on error to prevent crash
                }
                return await r.json();
            };

            const [projects, finalProducts, phases, deliverables, workPackages] = await Promise.all([
                fetchJson('/api/projects'),
                fetchJson('/api/final-products'),
                fetchJson('/api/phases'),
                fetchJson('/api/deliverables'),
                fetchJson('/api/work-packages')
            ]);

            dispatch({
                type: 'LOAD_DATA',
                payload: {
                    projects: Array.isArray(projects) ? projects : [],
                    finalProducts: Array.isArray(finalProducts) ? finalProducts : [],
                    phases: Array.isArray(phases) ? phases : [],
                    deliverables: Array.isArray(deliverables) ? deliverables : [],
                    workPackages: Array.isArray(workPackages) ? workPackages : []
                }
            });
        } catch (e) {
            console.error("Failed to fetch data", e);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            fetchData(token);
        }
        setLoading(false);
    }, []);

    // API Wrappers for Dispatch
    const apiDispatch = async (action) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            let res;
            switch (action.type) {
                case 'ADD_PROJECT':
                    res = await fetch('/api/projects', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_FINAL_PRODUCT':
                    res = await fetch('/api/final-products', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_PHASE':
                    res = await fetch('/api/phases', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_DELIVERABLE':
                    res = await fetch('/api/deliverables', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_WORK_PACKAGE':
                    res = await fetch('/api/work-packages', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'UPDATE_WORK_PACKAGE': {
                    const existingWP = state.workPackages.find(wp => wp.id === action.payload.id);
                    const updatedWP = { ...existingWP, ...action.payload };
                    res = await fetch(`/api/work-packages/${action.payload.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(updatedWP)
                    });
                    break;
                }
                case 'DELETE_PROJECTS':
                    const { ids } = action.payload;
                    const results = await Promise.all(ids.map(id =>
                        fetch(`/api/projects/${id}`, { method: 'DELETE', headers })
                    ));
                    if (results.some(r => !r.ok)) throw new Error('Failed to delete some projects');
                    break;

                case 'UPDATE_ENTITY':
                    const { type, id, data } = action.payload;
                    let listName = '';
                    if (type === 'project') listName = 'projects';
                    else if (type === 'final-product') listName = 'finalProducts';
                    else if (type === 'phase') listName = 'phases';
                    else if (type === 'deliverable') listName = 'deliverables';
                    else if (type === 'work-package') listName = 'workPackages';

                    if (listName) {
                        const item = state[listName].find(i => i.id === id);
                        const updatedItem = { ...item, ...data };
                        const endpoint = type + 's';
                        res = await fetch(`/api/${endpoint}/${id}`, { method: 'PUT', headers, body: JSON.stringify(updatedItem) });
                    }
                    break;

                case 'ADD_KPI': {
                    const { entityId, entityType, kpi } = action.payload;
                    res = await fetch('/api/kpis', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ ...kpi, entityId, entityType })
                    });
                    break;
                }
                case 'UPDATE_KPI':
                    res = await fetch(`/api/kpis/${action.payload.kpi.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(action.payload.kpi)
                    });
                    break;
                case 'DELETE_KPI':
                    res = await fetch(`/api/kpis/${action.payload.kpiId}`, { method: 'DELETE', headers });
                    break;

                case 'SUBMIT_CHANGE_REQUEST':
                    const projectToSubmit = state.projects.find(p => p.id === action.payload.projectId);
                    const updatedProjectToSubmit = { ...projectToSubmit, pendingChanges: action.payload.request };
                    res = await fetch(`/api/projects/${action.payload.projectId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(updatedProjectToSubmit)
                    });
                    break;
                case 'APPROVE_BASELINE_CHANGE':
                    const res1 = await fetch('/api/baselines', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            projectId: action.payload.projectId,
                            version: action.payload.newBaselineVersion,
                            snapshot: action.payload.snapshot
                        })
                    });
                    if (!res1.ok) throw new Error('Failed to create baseline snapshot');

                    const projectToApprove = state.projects.find(p => p.id === action.payload.projectId);
                    const updatedProjectToApprove = {
                        ...projectToApprove,
                        baseline: action.payload.newBaselineVersion,
                        pendingChanges: null
                    };
                    res = await fetch(`/api/projects/${action.payload.projectId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(updatedProjectToApprove)
                    });
                    break;
                case 'REJECT_BASELINE_CHANGE':
                    const projectToReject = state.projects.find(p => p.id === action.payload.projectId);
                    const updatedProjectToReject = { ...projectToReject, pendingChanges: null };
                    res = await fetch(`/api/projects/${action.payload.projectId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(updatedProjectToReject)
                    });
                    break;

                case 'RESET_DATA':
                    res = await fetch('/api/reset', { method: 'POST', headers });
                    if (res.ok) {
                        alert('All data has been reset successfully.');
                        dispatch({ type: 'RESET_DATA' }); // Clear local state immediately
                        fetchData(token); // Refresh data
                    }
                    break;
            }

            if (res && !res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `API error: ${res.status}`);
            }

            dispatch(action); // Update local state only if API call succeeded
        } catch (e) {
            console.error("API Action failed", e);
            alert("Action failed: " + e.message);
            throw e; // Re-throw to allow caller to handle if needed
        }
    };

    // Helper to calculate completion
    const calculateCompletion = (entityId, type, customData = null) => {
        const parseStatus = (val) => {
            const num = parseInt(val, 10);
            return isNaN(num) ? 0 : num;
        };

        const dataSource = customData || state;

        try {
            if (type === 'work-package') {
                const wp = Array.isArray(dataSource.workPackages) ? dataSource.workPackages.find(w => w.id === entityId) : null;
                return wp ? parseStatus(wp.status) : 0;
            }
            if (type === 'deliverable') {
                const relatedWPs = Array.isArray(dataSource.workPackages) ? dataSource.workPackages.filter(wp => wp.deliverableId === entityId) : [];
                if (relatedWPs.length === 0) {
                    const d = Array.isArray(dataSource.deliverables) ? dataSource.deliverables.find(i => i.id === entityId) : null;
                    return d ? parseStatus(d.status) : 0;
                }
                const total = relatedWPs.reduce((sum, wp) => sum + parseStatus(wp.status), 0);
                return Math.round(total / relatedWPs.length);
            }
            if (type === 'phase') {
                const relatedDeliverables = Array.isArray(dataSource.deliverables) ? dataSource.deliverables.filter(d => d.phaseId === entityId) : [];
                if (relatedDeliverables.length === 0) return 0;
                const total = relatedDeliverables.reduce((sum, d) => sum + calculateCompletion(d.id, 'deliverable', dataSource), 0);
                return Math.round(total / relatedDeliverables.length);
            }
            if (type === 'final-product') {
                const relatedPhases = Array.isArray(dataSource.phases) ? dataSource.phases.filter(p => p.finalProductId === entityId) : [];
                if (relatedPhases.length === 0) return 0;
                const total = relatedPhases.reduce((sum, p) => sum + calculateCompletion(p.id, 'phase', dataSource), 0);
                return Math.round(total / relatedPhases.length);
            }
            if (type === 'project') {
                const relatedFPs = Array.isArray(dataSource.finalProducts) ? dataSource.finalProducts.filter(fp => fp.projectId === entityId) : [];
                if (relatedFPs.length === 0) return 0;
                const total = relatedFPs.reduce((sum, fp) => sum + calculateCompletion(fp.id, 'final-product', dataSource), 0);
                return Math.round(total / relatedFPs.length);
            }
        } catch (e) {
            console.error("Error in calculateCompletion:", e);
            return 0;
        }
        return 0;
    };

    // Helper to calculate timeline (Hierarchical)
    const calculateTimeline = (entityId, type, customData = null) => {
        const dataSource = customData || state;
        let item = null;
        let children = [];
        let childType = '';

        try {
            if (type === 'project') {
                // Handle both state (projects array) and snapshot (single project object)
                if (Array.isArray(dataSource.projects)) {
                    item = dataSource.projects.find(p => p.id === entityId);
                } else if (dataSource.project && dataSource.project.id === entityId) {
                    item = dataSource.project;
                }
                children = Array.isArray(dataSource.finalProducts) ? dataSource.finalProducts.filter(fp => fp.projectId === entityId) : [];
                childType = 'final-product';
            } else if (type === 'final-product') {
                item = Array.isArray(dataSource.finalProducts) ? dataSource.finalProducts.find(fp => fp.id === entityId) : null;
                children = Array.isArray(dataSource.phases) ? dataSource.phases.filter(p => p.finalProductId === entityId) : [];
                childType = 'phase';
            } else if (type === 'phase') {
                item = Array.isArray(dataSource.phases) ? dataSource.phases.find(p => p.id === entityId) : null;
                children = Array.isArray(dataSource.deliverables) ? dataSource.deliverables.filter(d => d.phaseId === entityId) : [];
                childType = 'deliverable';
            } else if (type === 'deliverable') {
                item = Array.isArray(dataSource.deliverables) ? dataSource.deliverables.find(d => d.id === entityId) : null;
                children = Array.isArray(dataSource.workPackages) ? dataSource.workPackages.filter(wp => wp.deliverableId === entityId) : [];
                childType = 'work-package';
            } else if (type === 'work-package') {
                item = Array.isArray(dataSource.workPackages) ? dataSource.workPackages.find(wp => wp.id === entityId) : null;
            }
        } catch (e) {
            console.error("Error in calculateTimeline data access:", e);
            return { startDate: '', endDate: '', actualStartDate: '', actualEndDate: '' };
        }

        if (!item) return { startDate: '', endDate: '', actualStartDate: '', actualEndDate: '' };

        if (type === 'work-package' || children.length === 0) {
            return {
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                actualStartDate: item.actualStartDate || '',
                actualEndDate: item.actualEndDate || ''
            };
        }

        const childTimelines = children.map(c => calculateTimeline(c.id, childType, dataSource));

        const getMinDate = (dates) => {
            const validDates = dates.filter(d => d && d !== '');
            if (validDates.length === 0) return '';
            return validDates.reduce((min, d) => (d < min ? d : min), validDates[0]);
        };

        const getMaxDate = (dates) => {
            const validDates = dates.filter(d => d && d !== '');
            if (validDates.length === 0) return '';
            return validDates.reduce((max, d) => (d > max ? d : max), validDates[0]);
        };

        const allChildrenCompleted = children.every(c => calculateCompletion(c.id, childType, dataSource) >= 100);

        return {
            startDate: getMinDate(childTimelines.map(t => t.startDate)),
            endDate: getMaxDate(childTimelines.map(t => t.endDate)),
            actualStartDate: getMinDate(childTimelines.map(t => t.actualStartDate)),
            actualEndDate: allChildrenCompleted ? getMaxDate(childTimelines.map(t => t.actualEndDate)) : ''
        };
    };

    // Helper to calculate budget variance (Hierarchical)
    const calculateBudgetVariance = (entityId, type) => {
        let item = null;
        let children = [];
        let childType = '';

        if (type === 'project') {
            item = state.projects.find(p => p.id === entityId);
            children = state.finalProducts.filter(fp => fp.projectId === entityId);
            childType = 'final-product';
        } else if (type === 'final-product') {
            item = state.finalProducts.find(fp => fp.id === entityId);
            children = state.phases.filter(p => p.finalProductId === entityId);
            childType = 'phase';
        } else if (type === 'phase') {
            item = state.phases.find(p => p.id === entityId);
            children = state.deliverables.filter(d => d.phaseId === entityId);
            childType = 'deliverable';
        } else if (type === 'deliverable') {
            item = state.deliverables.find(d => d.id === entityId);
            children = state.workPackages.filter(wp => wp.deliverableId === entityId);
            childType = 'work-package';
        } else if (type === 'work-package') {
            item = state.workPackages.find(wp => wp.id === entityId);
        }

        if (!item) return null;

        let plan = 0;
        let actual = 0;
        let additional = 0;

        // If item has its own budget defined, use it
        if (item.budget && (typeof item.budget === 'number' || (typeof item.budget === 'object' && (item.budget.plan || item.budget.actual)))) {
            if (typeof item.budget === 'object') {
                plan = item.budget.plan || 0;
                actual = item.budget.actual || 0;
                additional = item.budget.additional || 0;
            } else {
                plan = item.budget || 0;
            }
        } else if (children.length > 0) {
            // Otherwise roll up from children
            children.forEach(child => {
                const childMetrics = calculateBudgetVariance(child.id, childType);
                if (childMetrics) {
                    plan += childMetrics.plan;
                    actual += childMetrics.actual;
                    additional += childMetrics.additional;
                }
            });
        }

        const totalBudget = plan + additional;
        const variance = actual - totalBudget;
        const variancePercent = totalBudget > 0 ? Math.round((variance / totalBudget) * 100) : 0;
        const isOverBudget = variance > 0;

        return {
            plan,
            actual,
            additional,
            totalBudget,
            variance,
            variancePercent,
            isOverBudget
        };
    };

    // Helper to calculate resource utilization (Hierarchical)
    const calculateResourceUtilization = (entityId, type) => {
        let item = null;
        let children = [];
        let childType = '';

        if (type === 'project') {
            item = state.projects.find(p => p.id === entityId);
            children = state.finalProducts.filter(fp => fp.projectId === entityId);
            childType = 'final-product';
        } else if (type === 'final-product') {
            item = state.finalProducts.find(fp => fp.id === entityId);
            children = state.phases.filter(p => p.finalProductId === entityId);
            childType = 'phase';
        } else if (type === 'phase') {
            item = state.phases.find(p => p.id === entityId);
            children = state.deliverables.filter(d => d.phaseId === entityId);
            childType = 'deliverable';
        } else if (type === 'deliverable') {
            item = state.deliverables.find(d => d.id === entityId);
            children = state.workPackages.filter(wp => wp.deliverableId === entityId);
            childType = 'work-package';
        } else if (type === 'work-package') {
            item = state.workPackages.find(wp => wp.id === entityId);
        }

        if (!item) return null;

        let planManDays = 0;
        let actualManDays = 0;

        // If item has its own resources defined
        if (item.resources && (item.resources.planManDays || item.resources.actualManDays)) {
            planManDays = item.resources.planManDays || 0;
            actualManDays = item.resources.actualManDays || 0;
        } else if (children.length > 0) {
            // Roll up from children
            children.forEach(child => {
                const childRes = calculateResourceUtilization(child.id, childType);
                if (childRes) {
                    planManDays += childRes.planManDays;
                    actualManDays += childRes.actualManDays;
                }
            });
        }

        const daysUtilization = planManDays > 0 ? Math.round((actualManDays / planManDays) * 100) : 0;

        return {
            planManDays,
            actualManDays,
            daysUtilization
        };
    };

    // Helper to get baseline history
    const getBaselineHistory = (projectId) => {
        const project = state.projects.find(p => p.id === projectId);
        return project ? (project.baselineHistory || []) : [];
    };

    // Helper to compare baselines
    const compareBaselines = (projectId, version1, version2) => {
        const history = getBaselineHistory(projectId);
        // Find snapshots. If version is 'current', construct snapshot from current state
        const getSnapshot = (v) => {
            if (v === 'current') {
                const project = state.projects.find(p => p.id === projectId);
                // Construct a snapshot of current state (simplified)
                return {
                    project,
                    finalProducts: state.finalProducts.filter(fp => fp.projectId === projectId),
                    phases: state.phases.filter(p => state.finalProducts.some(fp => fp.projectId === projectId && fp.id === p.finalProductId)),
                    // ... deeper levels if needed for comparison
                };
            }
            return history.find(h => h.version === v)?.snapshot;
        };

        const s1 = getSnapshot(version1);
        const s2 = getSnapshot(version2);

        if (!s1 || !s2) return null;

        // Perform comparison (simplified diff)
        const changes = [];

        // Compare Project Budget
        if (s1.project.budget.plan !== s2.project.budget.plan) {
            changes.push({ field: 'Project Budget Plan', v1: s1.project.budget.plan, v2: s2.project.budget.plan });
        }

        // Compare Final Products Count
        if (s1.finalProducts.length !== s2.finalProducts.length) {
            changes.push({ field: 'Final Products Count', v1: s1.finalProducts.length, v2: s2.finalProducts.length });
        }

        return changes;
    };

    return (
        <StoreContext.Provider value={{
            state,
            dispatch: apiDispatch,
            user,
            login,
            logout,
            loading,
            calculateCompletion,
            calculateTimeline,
            calculateBudgetVariance,
            calculateResourceUtilization,
            getBaselineHistory,
            compareBaselines
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);

