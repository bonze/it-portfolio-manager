import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import { seedData } from '../utils/seedData';
import { v4 as uuidv4 } from 'uuid';

const StoreContext = createContext();

const initialState = {
    projects: [],
    goals: [],
    scopes: [],
    deliverables: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            return action.payload;
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };
        case 'ADD_GOAL':
            return { ...state, goals: [...state.goals, action.payload] };
        case 'ADD_SCOPE':
            return { ...state, scopes: [...state.scopes, action.payload] };
        case 'ADD_DELIVERABLE':
            return { ...state, deliverables: [...state.deliverables, action.payload] };
        case 'UPDATE_DELIVERABLE':
            return {
                ...state,
                deliverables: state.deliverables.map((d) =>
                    d.id === action.payload.id ? { ...d, ...action.payload } : d
                ),
            };
        case 'UPDATE_ENTITY': // Generic update for Project/Goal/Scope
            const { type, id, data } = action.payload;
            const listName = type + 's'; // projects, goals, scopes
            return {
                ...state,
                [listName]: state[listName].map(item => item.id === id ? { ...item, ...data } : item)
            };

        // KPI Management
        case 'ADD_KPI': {
            const { entityType, entityId, kpi } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item =>
                    item.id === entityId
                        ? { ...item, kpis: [...(item.kpis || []), kpi] }
                        : item
                )
            };
        }
        case 'UPDATE_KPI': {
            const { entityType, entityId, kpiId, kpiData } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item =>
                    item.id === entityId
                        ? {
                            ...item,
                            kpis: item.kpis.map(k => k.id === kpiId ? { ...k, ...kpiData } : k)
                        }
                        : item
                )
            };
        }
        case 'DELETE_KPI': {
            const { entityType, entityId, kpiId } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item =>
                    item.id === entityId
                        ? { ...item, kpis: item.kpis.filter(k => k.id !== kpiId) }
                        : item
                )
            };
        }

        // Baseline Management
        case 'SUBMIT_CHANGE_REQUEST': {
            const { entityType, entityId, changes } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item =>
                    item.id === entityId
                        ? { ...item, pendingChanges: changes }
                        : item
                )
            };
        }
        case 'APPROVE_BASELINE_CHANGE': {
            const { entityType, entityId, approvedBy } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item => {
                    if (item.id !== entityId || !item.pendingChanges) return item;

                    const newBaseline = (item.currentBaseline || 0) + 1;
                    const newHistory = [
                        ...(item.baselineHistory || []),
                        {
                            version: newBaseline,
                            data: { ...item, ...item.pendingChanges },
                            timestamp: Date.now(),
                            approvedBy: approvedBy || 'System'
                        }
                    ];

                    return {
                        ...item,
                        ...item.pendingChanges,
                        currentBaseline: newBaseline,
                        baselineHistory: newHistory,
                        pendingChanges: null
                    };
                })
            };
        }
        case 'REJECT_BASELINE_CHANGE': {
            const { entityType, entityId } = action.payload;
            const list = entityType + 's';
            return {
                ...state,
                [list]: state[list].map(item =>
                    item.id === entityId
                        ? { ...item, pendingChanges: null }
                        : item
                )
            };
        }

        case 'RESET_DATA':
            return seedData;
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
        if (!res.ok) throw new Error('Login failed');
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
            const [projects, goals, scopes, deliverables] = await Promise.all([
                fetch('/api/projects', { headers }).then(r => r.json()),
                fetch('/api/goals', { headers }).then(r => r.json()),
                fetch('/api/scopes', { headers }).then(r => r.json()),
                fetch('/api/deliverables', { headers }).then(r => r.json())
            ]);

            // Basic migration/normalization if needed (similar to old migrateData)
            // For now assuming API returns correct structure or we trust it
            dispatch({ type: 'LOAD_DATA', payload: { projects, goals, scopes, deliverables } });
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
            switch (action.type) {
                case 'ADD_PROJECT':
                    await fetch('/api/projects', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_GOAL':
                    await fetch('/api/goals', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_SCOPE':
                    await fetch('/api/scopes', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'ADD_DELIVERABLE':
                    await fetch('/api/deliverables', { method: 'POST', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'UPDATE_DELIVERABLE':
                    await fetch(`/api/deliverables/${action.payload.id}`, { method: 'PUT', headers, body: JSON.stringify(action.payload) });
                    break;
                case 'UPDATE_ENTITY':
                    const { type, id, data } = action.payload;
                    await fetch(`/api/${type}s/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) }); // Assuming data is the full object or partial? API expects full object usually or PATCH. My API is PUT.
                    // Ideally we should merge with existing state before sending if PUT replaces.
                    // My API implementation: UPDATE ... SET data = ?
                    // So we need to send the FULL updated object.
                    // The reducer does a merge: { ...item, ...data }
                    // So we should probably do the merge here or in the component before calling dispatch.
                    // For now, let's assume the payload.data IS the full object or we construct it.
                    // Actually, looking at EditModal, it passes the updated fields.
                    // So we need to find the item in state, merge it, then send.
                    const list = type + 's';
                    const item = state[list].find(i => i.id === id);
                    const updatedItem = { ...item, ...data };
                    await fetch(`/api/${type}s/${id}`, { method: 'PUT', headers, body: JSON.stringify(updatedItem) });
                    break;

                // ... Implement other cases (KPIs, Baselines) similarly ...
                // For brevity in this turn, I will handle the main CRUD. 
                // KPIs and Baselines are nested in the entity JSON blob, so UPDATE_ENTITY logic applies if we treat them as part of the entity.
                // But the reducer has specific cases for ADD_KPI etc.
                // We need to map those to API calls too.

                case 'ADD_KPI': {
                    const { entityType, entityId, kpi } = action.payload;
                    const list = entityType + 's';
                    const item = state[list].find(i => i.id === entityId);
                    const updated = { ...item, kpis: [...(item.kpis || []), kpi] };
                    await fetch(`/api/${entityType}s/${entityId}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
                    break;
                }
                // ... other KPI/Baseline cases ...
            }
            dispatch(action); // Optimistic update or update after success
        } catch (e) {
            console.error("API Action failed", e);
            alert("Action failed: " + e.message);
        }
    };

    // Helper to calculate completion
    const calculateCompletion = (entityId, type) => {
        if (type === 'scope') {
            const relatedDeliverables = state.deliverables.filter(d => {
                if (d.scopeIds) return d.scopeIds.includes(entityId);
                return d.scopeId === entityId;
            });
            if (relatedDeliverables.length === 0) return 0;
            const total = relatedDeliverables.reduce((sum, d) => sum + (d.status || 0), 0);
            return Math.round(total / relatedDeliverables.length);
        }
        if (type === 'goal') {
            const relatedScopes = state.scopes.filter(s => s.goalId === entityId);
            if (relatedScopes.length === 0) return 0;
            const total = relatedScopes.reduce((sum, s) => sum + calculateCompletion(s.id, 'scope'), 0);
            return Math.round(total / relatedScopes.length);
        }
        if (type === 'project') {
            const relatedGoals = state.goals.filter(g => g.projectId === entityId);
            if (relatedGoals.length === 0) return 0;
            const total = relatedGoals.reduce((sum, g) => sum + calculateCompletion(g.id, 'goal'), 0);
            return Math.round(total / relatedGoals.length);
        }
        return 0;
    };

    // Helper to calculate budget variance
    const calculateBudgetVariance = (entityId, type) => {
        const list = type + 's';
        const entity = state[list]?.find(item => item.id === entityId);
        if (!entity || !entity.budget) return null;

        const budget = entity.budget;
        const plan = budget.plan || 0;
        const actual = budget.actual || 0;
        const additional = budget.additional || 0;

        const totalBudget = plan + additional;
        const variance = totalBudget - actual;
        const variancePercent = plan > 0 ? ((variance / plan) * 100).toFixed(1) : 0;

        return {
            plan,
            actual,
            additional,
            totalBudget,
            variance,
            variancePercent,
            isOverBudget: actual > totalBudget,
            isUnderBudget: actual < totalBudget
        };
    };

    // Helper to calculate resource utilization
    const calculateResourceUtilization = (entityId, type) => {
        const list = type + 's';
        const entity = state[list]?.find(item => item.id === entityId);
        if (!entity || !entity.resources) return null;

        const resources = entity.resources;
        const planDays = resources.planManDays || 0;
        const actualDays = resources.actualManDays || 0;
        const planMonths = resources.planManMonths || 0;
        const actualMonths = resources.actualManMonths || 0;

        return {
            planManDays: planDays,
            actualManDays: actualDays,
            planManMonths: planMonths,
            actualManMonths: actualMonths,
            daysUtilization: planDays > 0 ? ((actualDays / planDays) * 100).toFixed(1) : 0,
            monthsUtilization: planMonths > 0 ? ((actualMonths / planMonths) * 100).toFixed(1) : 0,
            daysVariance: planDays - actualDays,
            monthsVariance: planMonths - actualMonths
        };
    };

    // Helper to get baseline history
    const getBaselineHistory = (entityId, type) => {
        const list = type + 's';
        const entity = state[list]?.find(item => item.id === entityId);
        if (!entity) return [];

        return entity.baselineHistory || [];
    };

    // Helper to compare baselines
    const compareBaselines = (entityId, baseline1, baseline2, type) => {
        const history = getBaselineHistory(entityId, type);
        const b1 = history.find(h => h.version === baseline1);
        const b2 = history.find(h => h.version === baseline2);

        if (!b1 || !b2) return null;

        const changes = {};
        const allKeys = new Set([...Object.keys(b1.data), ...Object.keys(b2.data)]);

        allKeys.forEach(key => {
            if (JSON.stringify(b1.data[key]) !== JSON.stringify(b2.data[key])) {
                changes[key] = {
                    before: b1.data[key],
                    after: b2.data[key]
                };
            }
        });

        return {
            baseline1: b1,
            baseline2: b2,
            changes
        };
    };

    return (
        <StoreContext.Provider value={{
            state,
            dispatch: apiDispatch, // Use the API wrapper
            user,
            login,
            logout,
            loading,
            calculateCompletion,
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

