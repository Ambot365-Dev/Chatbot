import React from 'react';
import { Circle, Square, Plus, X } from 'lucide-react';

const StepEditor = ({ step, updateStep }) => {

    const handleOptionChange = (index, value) => {
        const newOptions = [...step.options];
        newOptions[index] = value;
        updateStep(step.id, { options: newOptions });
    };

    const addOption = () => {
        updateStep(step.id, { options: [...(step.options || []), `Option ${(step.options?.length || 0) + 1}`] });
    };

    const removeOption = (index) => {
        const newOptions = step.options.filter((_, i) => i !== index);
        updateStep(step.id, { options: newOptions });
    };

    // Render based on type
    switch (step.type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'welcome':
        case 'end':
            return (
                <div className="py-2">
                    <input
                        disabled
                        type="text"
                        placeholder={step.type === 'welcome' || step.type === 'end' ? "(Message text is shown above)" : `User inputs ${step.type}...`}
                        className="w-full bg-gray-50 border-b border-gray-300 border-dashed py-2 px-3 text-sm text-gray-500 cursor-not-allowed select-none italic"
                    />
                </div>
            );

        case 'mcq':
        case 'yesno':
            return (
                <div className="space-y-3 py-2">
                    {(step.options || []).map((option, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                            <div className="text-gray-300">
                                {step.type === 'mcq' ? <Circle size={18} /> : <Square size={18} />}
                            </div>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-brand-500 focus:outline-none py-1 text-sm text-gray-700 transition-colors"
                            />
                            {step.options.length > 1 && (
                                <button
                                    onClick={() => removeOption(index)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center gap-3 pt-1">
                        <div className="text-brand-500 opacity-50">
                            {step.type === 'mcq' ? <Circle size={18} /> : <Square size={18} />}
                        </div>
                        <button
                            onClick={addOption}
                            className="text-sm text-gray-500 hover:text-brand-600 font-medium transition-colors flex items-center gap-1"
                        >
                            Add option
                        </button>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

export default StepEditor;
