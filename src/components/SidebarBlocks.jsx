import React from 'react';
import { MessageSquare, Type, List, CheckSquare, Mail, Phone, Flag } from 'lucide-react';
import { useFlow } from '../context/FlowContext';

const BlockButton = ({ icon: Icon, label, type, onClick }) => (
    <button
        onClick={() => onClick(type)}
        className="flex items-center gap-3 w-full p-3 mb-2 text-left bg-white border border-gray-200 rounded-lg hover:border-brand-500 hover:shadow-md transition-all group"
    >
        <div className="p-2 bg-gray-50 rounded-md group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
    </button>
);

const SidebarBlocks = () => {
    const { addStep } = useFlow();

    const blocks = [
        { type: 'welcome', label: 'Welcome Screen', icon: MessageSquare },
        { type: 'text', label: 'Text Input', icon: Type },
        { type: 'mcq', label: 'Multichoice', icon: List },
        { type: 'yesno', label: 'Yes/No', icon: CheckSquare },
        { type: 'email', label: 'Email', icon: Mail },
        { type: 'phone', label: 'Phone', icon: Phone },
        { type: 'end', label: 'End Screen', icon: Flag },
    ];

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col p-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">Blocks</h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
                {blocks.map(block => (
                    <BlockButton
                        key={block.type}
                        {...block}
                        onClick={addStep}
                    />
                ))}
            </div>
            <div className="pt-4 border-t border-gray-100">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium">Tip: Click to add blocks to your flow.</p>
                </div>
            </div>
        </div>
    );
};

export default SidebarBlocks;
