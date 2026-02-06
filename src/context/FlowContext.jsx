import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

const FlowContext = createContext();

const initialData = {
    steps: [
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
    ],
    edges: [
        { id: 'e-welcome-1-email-1', source: 'welcome-1', target: 'email-1' }
    ]
};

// Load from local storage if available
const loadInitialState = () => {
    const saved = localStorage.getItem('chatbot-flow-data');
    return saved ? JSON.parse(saved) : initialData;
};

const flowReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_STEP':
            return { ...state, steps: [...state.steps, action.payload] };

        case 'DELETE_STEP': // Remove step AND connected edges
            return {
                ...state,
                steps: state.steps.filter(step => step.id !== action.payload),
                edges: state.edges.filter(edge => edge.source !== action.payload && edge.target !== action.payload)
            };

        case 'UPDATE_STEP':
            return {
                ...state,
                steps: state.steps.map(step =>
                    step.id === action.payload.id ? { ...step, ...action.payload.updates } : step
                )
            };

        case 'DUPLICATE_STEP': {
            const index = state.steps.findIndex(s => s.id === action.payload);
            const stepToCopy = state.steps[index];
            const newStep = {
                ...stepToCopy,
                id: crypto.randomUUID(),
                title: `${stepToCopy.title} (Copy)`
            };
            const newSteps = [...state.steps];
            newSteps.splice(index + 1, 0, newStep);
            return { ...state, steps: newSteps };
        }

        case 'REORDER_STEPS':
            return { ...state, steps: action.payload };

        case 'INSERT_STEP': {
            const newSteps = [...state.steps];
            newSteps.splice(action.payload.index, 0, action.payload.step);
            return { ...state, steps: newSteps };
        }

        // --- Edge Actions ---
        case 'ADD_EDGE':
            return { ...state, edges: addEdge(action.payload, state.edges) };

        case 'SET_EDGES':
            return { ...state, edges: action.payload };

        case 'EDGES_CHANGE':
            return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };

        default:
            return state;
    }
};

export const FlowProvider = ({ children }) => {
    const [state, dispatch] = useReducer(flowReducer, initialData, loadInitialState);

    // Auto-save to localStorage
    useEffect(() => {
        localStorage.setItem('chatbot-flow-data', JSON.stringify(state));
    }, [state]);

    const addStep = (type) => {
        let title = 'New Question';
        if (type === 'welcome') title = 'Welcome message';
        else if (type === 'statement') title = 'Information';
        else if (type === 'name') title = 'What is your name?';
        else if (type === 'location') title = 'Please share your location';
        else if (type === 'image') title = 'Image Message';
        else if (type === 'video') title = 'Video Message';
        else if (type === 'link-out') title = 'Visit Link';
        else if (type === 'live-chat') title = 'Connect to Agent';
        else if (type === 'ai-response') title = 'AI Response';
        else if (type === 'redirect') title = 'Redirecting...';
        else if (type === 'date-time') title = 'Book Appointment';

        const newStep = {
            id: crypto.randomUUID(),
            type,
            title,
            required: false,
            options: type === 'mcq' || type === 'yesno' || type === 'single-choice' ? ['Option 1'] : undefined,
            ratingScale: type === 'rating' ? 5 : undefined,
            range: type === 'range' ? { min: 0, max: 100 } : undefined,
        };
        dispatch({ type: 'ADD_STEP', payload: newStep });
    };

    const deleteStep = (id) => dispatch({ type: 'DELETE_STEP', payload: id });

    const updateStep = (id, updates) => dispatch({ type: 'UPDATE_STEP', payload: { id, updates } });

    const duplicateStep = (id) => dispatch({ type: 'DUPLICATE_STEP', payload: id });

    const reorderSteps = (newSteps) => dispatch({ type: 'REORDER_STEPS', payload: newSteps });

    const insertStep = (type, index) => {
        let title = 'New Question';
        if (type === 'welcome') title = 'Welcome message';
        else if (type === 'statement') title = 'Information';
        else if (type === 'name') title = 'What is your name?';
        else if (type === 'location') title = 'Please share your location';
        else if (type === 'image') title = 'Image Message';
        else if (type === 'video') title = 'Video Message';
        else if (type === 'link-out') title = 'Visit Link';
        else if (type === 'live-chat') title = 'Connect to Agent';
        else if (type === 'ai-response') title = 'AI Response';
        else if (type === 'redirect') title = 'Redirecting...';
        else if (type === 'date-time') title = 'Book Appointment';

        const newStep = {
            id: crypto.randomUUID(),
            type,
            title,
            required: false,
            options: type === 'mcq' || type === 'yesno' || type === 'single-choice' ? ['Option 1'] : undefined,
            ratingScale: type === 'rating' ? 5 : undefined,
            range: type === 'range' ? { min: 0, max: 100 } : undefined,
        };
        dispatch({ type: 'INSERT_STEP', payload: { step: newStep, index } });
    };

    // Edge Helpers
    const onEdgesChange = (changes) => dispatch({ type: 'EDGES_CHANGE', payload: changes });
    const onConnect = (connection) => dispatch({ type: 'ADD_EDGE', payload: connection });
    const setEdges = (edges) => dispatch({ type: 'SET_EDGES', payload: edges });

    return (
        <FlowContext.Provider value={{
            steps: state.steps, // Expose steps directly for backward compatibility
            edges: state.edges,
            addStep,
            deleteStep,
            updateStep,
            duplicateStep,
            reorderSteps,
            insertStep,
            onEdgesChange,
            onConnect,
            setEdges
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
