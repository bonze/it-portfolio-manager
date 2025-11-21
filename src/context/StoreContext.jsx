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
        case 'RESET_DATA':
            return seedData;
        default:
            return state;
    }
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load from localStorage or Seed Data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('it-portfolio-data');
        if (savedData) {
            try {
                dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
            } catch (e) {
                console.error("Failed to parse local storage", e);
                dispatch({ type: 'LOAD_DATA', payload: seedData });
            }
        } else {
            dispatch({ type: 'LOAD_DATA', payload: seedData });
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

    return (
        <StoreContext.Provider value={{ state, dispatch, calculateCompletion }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
