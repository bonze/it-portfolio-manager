import React, { createContext, useReducer, useEffect, useContext } from 'react';
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

    // Data migration helper
    const migrateData = (data) => {
        const migrateEntity = (entity) => {
            const migrated = { ...entity };

            // Migrate budget from number to object
            if (typeof migrated.budget === 'number') {
                migrated.budget = {
                    plan: migrated.budget,
                    actual: 0,
                    additional: 0
                };
            } else if (!migrated.budget) {
                migrated.budget = { plan: 0, actual: 0, additional: 0 };
            }

            // Initialize vendor for projects
            if (!migrated.vendor && entity.pm !== undefined) { // Projects have pm field
                migrated.vendor = { name: '', contact: '', contractValue: 0 };
            }

            // Initialize resources
            if (!migrated.resources) {
                migrated.resources = {
                    planManDays: 0,
                    actualManDays: 0,
                    planManMonths: 0,
                    actualManMonths: 0
                };
            }

            // Initialize KPIs
            if (!migrated.kpis) {
                migrated.kpis = [];
            }

            // Initialize baseline tracking
            if (migrated.currentBaseline === undefined) {
                migrated.currentBaseline = 0;
                migrated.baselineHistory = [{
                    version: 0,
                    data: { ...migrated },
                    timestamp: Date.now(),
                    approvedBy: 'System Migration'
                }];
                migrated.pendingChanges = null;
            }

            return migrated;
        };

        return {
            projects: (data.projects || []).map(migrateEntity),
            goals: (data.goals || []).map(migrateEntity),
            scopes: (data.scopes || []).map(migrateEntity),
            deliverables: (data.deliverables || []).map(migrateEntity)
        };
    };

    // Load from localStorage or Seed Data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('it-portfolio-data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const migrated = migrateData(parsed);
                dispatch({ type: 'LOAD_DATA', payload: migrated });
            } catch (e) {
                console.error("Failed to parse local storage", e);
                const migrated = migrateData(seedData);
                dispatch({ type: 'LOAD_DATA', payload: migrated });
            }
        } else {
            const migrated = migrateData(seedData);
            dispatch({ type: 'LOAD_DATA', payload: migrated });
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (state.projects.length > 0) {
            localStorage.setItem('it-portfolio-data', JSON.stringify(state));
        }
    }, [state]);

    // Helper to calculate completion
    const calculateCompletion = (entityId, type) => {
        if (type === 'scope') {
            // Average of deliverables linked to this scope
            // Handle both old (scopeId) and new (scopeIds) format for backward compatibility during migration
            const relatedDeliverables = state.deliverables.filter(d => {
                if (d.scopeIds) return d.scopeIds.includes(entityId);
                return d.scopeId === entityId;
            });

            if (relatedDeliverables.length === 0) return 0;
            const total = relatedDeliverables.reduce((sum, d) => sum + (d.status || 0), 0);
            return Math.round(total / relatedDeliverables.length);
        }
        if (type === 'goal') {
            // Average of scopes
            const relatedScopes = state.scopes.filter(s => s.goalId === entityId);
            if (relatedScopes.length === 0) return 0;
            const total = relatedScopes.reduce((sum, s) => sum + calculateCompletion(s.id, 'scope'), 0);
            return Math.round(total / relatedScopes.length);
        }
        if (type === 'project') {
            // Average of goals
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
            dispatch,
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
