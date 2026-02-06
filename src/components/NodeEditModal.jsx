import React, { useEffect, useRef } from 'react';
import { X, Trash2, Copy } from 'lucide-react';
import StepEditor from './StepEditor';
import { useFlow } from '../context/FlowContext';

const NodeEditModal = ({ stepId, onClose }) => {
    const { steps, updateStep, deleteStep, duplicateStep } = useFlow();
    const modalRef = useRef(null);

    // Find the step data
    const step = steps.find(s => s.id === stepId);

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close on click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!step) return null;

    const handleTitleChange = (e) => {
        updateStep(step.id, { title: e.target.value });
    };

    const toggleRequired = () => {
        updateStep(step.id, { required: !step.required });
    };

    const handleDelete = () => {
        deleteStep(step.id);
        onClose();
    };

    const handleDuplicate = () => {
        duplicateStep(step.id);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-scale-up border border-gray-100"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Edit {step.type}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Title Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Question / Message
                        </label>
                        <input
                            type="text"
                            value={step.title}
                            onChange={handleTitleChange}
                            placeholder="Enter your question..."
                            className="w-full text-lg font-medium text-gray-800 border-b border-gray-200 focus:border-brand-500 hover:border-gray-300 py-2 bg-transparent transition-colors focus:outline-none"
                            autoFocus
                        />
                        {!step.title.trim() && (
                            <p className="text-xs text-red-500 mt-1">* Required</p>
                        )}
                    </div>

                    {/* Step Specific Editor */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Settings
                        </label>
                        <StepEditor step={step} updateStep={updateStep} />
                    </div>

                    {/* Common toggles */}
                    {step.type !== 'welcome' && step.type !== 'end' && (
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={step.required}
                                    onChange={toggleRequired}
                                    className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                                />
                                Required Answer
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={handleDuplicate}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
                        >
                            <Copy size={16} />
                            Duplicate
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeEditModal;
