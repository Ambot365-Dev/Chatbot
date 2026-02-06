import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FlowContext = createContext();

const initialSteps = [
    {
        id: 'welcome-1',
        type: 'welcome',
        title: 'Welcome to our service! How can we help you?',
        required: true,
    },
    {
        id: 'email-1',
        type: 'email',
        title: 'Please enter your email address:',
        required: true,
        placeholder: 'name@example.com'
    }
];

// Load from local storage if available
const loadInitialState = () => {
    const saved = localStorage.getItem('chatbot-flow');
    return saved ? JSON.parse(saved) : initialSteps;
};

const flowReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_STEP':
            return [...state, action.payload];

        case 'DELETE_STEP':
            return state.filter(step => step.id !== action.payload);

        case 'UPDATE_STEP':
            return state.map(step =>
                step.id === action.payload.id ? { ...step, ...action.payload.updates } : step
            );

        case 'DUPLICATE_STEP': {
            const index = state.findIndex(s => s.id === action.payload);
            const stepToCopy = state[index];
            const newStep = {
                ...stepToCopy,
                id: crypto.randomUUID(),
                title: `${stepToCopy.title} (Copy)`
            };
            const newState = [...state];
            newState.splice(index + 1, 0, newStep);
            return newState;
        }

        case 'REORDER_STEPS':
            return action.payload; // payload is the new array

        case 'INSERT_STEP': {
            const newState = [...state];
            newState.splice(action.payload.index, 0, action.payload.step);
            return newState;
        }

        default:
            return state;
    }
};

export const FlowProvider = ({ children }) => {
    const [steps, dispatch] = useReducer(flowReducer, [], loadInitialState);

    // Auto-save to localStorage
    useEffect(() => {
        localStorage.setItem('chatbot-flow', JSON.stringify(steps));
    }, [steps]);

    const addStep = (type) => {
        const newStep = {
            id: crypto.randomUUID(),
            type,
            title: type === 'welcome' ? 'Welcome message' : 'New Question',
            required: false,
            options: type === 'mcq' || type === 'yesno' ? ['Option 1'] : undefined,
        };
        dispatch({ type: 'ADD_STEP', payload: newStep });
    };

    const deleteStep = (id) => dispatch({ type: 'DELETE_STEP', payload: id });

    const updateStep = (id, updates) => dispatch({ type: 'UPDATE_STEP', payload: { id, updates } });

    const duplicateStep = (id) => dispatch({ type: 'DUPLICATE_STEP', payload: id });

    const reorderSteps = (newSteps) => dispatch({ type: 'REORDER_STEPS', payload: newSteps });

    const insertStep = (type, index) => {
        const newStep = {
            id: crypto.randomUUID(),
            type,
            title: type === 'welcome' ? 'Welcome message' : 'New Question',
            required: false,
            options: type === 'mcq' || type === 'yesno' ? ['Option 1'] : undefined,
        };
        dispatch({ type: 'INSERT_STEP', payload: { step: newStep, index } });
    };

    return (
        <FlowContext.Provider value={{
            steps,
            addStep,
            deleteStep,
            updateStep,
            duplicateStep,
            reorderSteps,
            insertStep
        }}>
            {children}
        </FlowContext.Provider>
    );
};

export const useFlow = () => {
    const context = useContext(FlowContext);
    if (!context) {
        throw new Error('useFlow must be used within a FlowProvider');
    }
    return context;
};
