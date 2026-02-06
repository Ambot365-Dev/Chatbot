import React, { useState, useEffect, useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { Trash2, Copy, GripVertical, MoreVertical, X } from 'lucide-react';
import StepEditor from './StepEditor';

const StepCard = ({ step, dragHandleProps, isDragging }) => {
    const { deleteStep, duplicateStep, updateStep } = useFlow();
    const [isActive, setIsActive] = useState(false);
    const cardRef = useRef(null);

    // Click outside listener to handle "active" state visuals
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setIsActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTitleChange = (e) => {
        updateStep(step.id, { title: e.target.value });
    };

    const toggleRequired = () => {
        updateStep(step.id, { required: !step.required });
    };

    return (
        <div
            ref={cardRef}
            onClick={() => setIsActive(true)}
            className={`
        bg-white rounded-xl border transition-all duration-200 group relative
        ${isActive ? 'border-brand-500 shadow-lg ring-1 ring-brand-100 z-10' : 'border-gray-200 shadow-sm hover:shadow-md'}
        ${isDragging ? 'rotate-2 scale-[1.02] shadow-xl' : ''}
      `}
        >
            {/* Left Accent Bar for Active State */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 rounded-l-xl"></div>
            )}

            <div className="p-5 pl-7"> {/* pl-7 to account for accent bar */}

                {/* Header: Drag Handle + Title + Actions */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Drag Handle */}
                    <div
                        {...dragHandleProps}
                        className="mt-2 text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 -ml-2"
                    >
                        <GripVertical size={20} />
                    </div>

                    {/* Title Input */}
                    <div className="flex-1">
                        <input
                            type="text"
                            value={step.title}
                            onChange={handleTitleChange}
                            placeholder="Enter your question or message..."
                            className={`w-full text-lg font-medium text-gray-800 border-b transition-colors bg-transparent px-1 py-1 focus:outline-none ${!step.title.trim() ? 'border-red-300 bg-red-50' : 'border-transparent hover:border-gray-200 focus:border-brand-500'}`}
                        />
                        {!step.title.trim() && (
                            <div className="text-[10px] text-red-500 mt-1 px-1 font-medium animate-pulse">
                                * Required field
                            </div>
                        )}
                        <div className="mt-1 text-xs text-brand-600 font-semibold uppercase tracking-wide px-1">
                            {step.type === 'mcq' ? 'Multiple Choice' : step.type === 'yesno' ? 'Yes/No' : step.type}
                        </div>
                    </div>

                    {/* Type Selector (Simplification: just show type for now or maybe a dropdown later if requested) */}
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {step.type !== 'welcome' && step.type !== 'end' && (
                            <label className="flex items-center gap-2 text-xs text-gray-500 mr-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={step.required}
                                    onChange={toggleRequired}
                                    className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                                />
                                Required
                            </label>
                        )}
                    </div>
                </div>

                {/* Body: Editor */}
                <div className="pl-6">
                    <StepEditor step={step} updateStep={updateStep} />
                </div>

                {/* Footer Actions (Divider + Buttons) */}
                {isActive && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3 animated-fade-in">
                        <button
                            onClick={() => duplicateStep(step.id)}
                            className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                            title="Duplicate"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            onClick={() => deleteStep(step.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <div className="flex items-center gap-2">
                            {/* More settings could go here */}
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepCard;
