import React, { useState } from 'react';
import {
    MessageSquare, Type, List, CheckSquare, Mail, Phone, Flag,
    Calendar, Hash, Link, Star, Upload, GripVertical, CircleDot,
    Clock, Info, User, MapPin, Sliders, Image as ImageIcon,
    Video, ExternalLink, Sparkles, MessageCircle, GitFork, ArrowRight,
    ChevronDown, ChevronRight
} from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useFlow } from '../context/FlowContext';

const BlockButton = ({ icon: Icon, label, description, onClick }) => (
    <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className="flex items-center gap-3 w-full p-3.5 text-left bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-200 group cursor-grab active:cursor-grabbing relative overflow-hidden"
    >
        {/* Top Accent Line ("Pipeline") */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="text-gray-300 group-hover:text-brand-300 transition-colors cursor-grab">
            <GripVertical size={16} />
        </div>

        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-brand-600 group-hover:shadow-sm transition-all duration-200">
            <Icon size={18} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
            {description && <span className="text-[10px] text-gray-400 group-hover:text-brand-400 font-medium">{description}</span>}
        </div>
    </div>
);

const SidebarBlocks = () => {
    const { addStep } = useFlow();
    const [openCategories, setOpenCategories] = useState({
        'frequently': true,
        'request': true,
        'send': true,
        'trigger': true
    });

    const toggleCategory = (key) => {
        setOpenCategories(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const categories = [
        {
            key: 'request',
            title: 'Request Information',
            items: [
                { type: 'text', label: 'Text Question', icon: Type, description: 'Capture text response' },
                { type: 'name', label: 'Name', icon: User, description: 'Capture user name' },
                { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Collect phone number' },
                { type: 'email', label: 'Email', icon: Mail, description: 'Collect email address' },
                { type: 'single-choice', label: 'Single Choice', icon: CircleDot, description: 'Radio button selection' },
                { type: 'mcq', label: 'Multiple Choice', icon: List, description: 'Select one option' },
                { type: 'date', label: 'Date', icon: Calendar, description: 'Capture a date' },
                { type: 'time', label: 'Time', icon: Clock, description: 'Capture a time' },
                { type: 'number', label: 'Numeric Input', icon: Hash, description: 'Capture a number' },
                { type: 'website', label: 'Website', icon: Link, description: 'Capture a URL' },
                { type: 'location', label: 'Location', icon: MapPin, description: 'Capture location' },
                { type: 'range', label: 'Range', icon: Sliders, description: 'Slider input' },
                { type: 'rating', label: 'Rating', icon: Star, description: 'User rating' },
                { type: 'file', label: 'File', icon: Upload, description: 'Allow file upload' },
                { type: 'yesno', label: 'Yes / No', icon: CheckSquare, description: 'Binary choice' },
            ]
        },
        {
            key: 'send',
            title: 'Send Information',
            items: [
                { type: 'statement', label: 'Message', icon: MessageSquare, description: 'Display text' },
                { type: 'image', label: 'Image/GIF', icon: ImageIcon, description: 'Send an image' },
                { type: 'video', label: 'Video', icon: Video, description: 'Send a video' },
                { type: 'link-out', label: 'Web Link', icon: ExternalLink, description: 'Send a link' },
            ]
        },
        {
            key: 'trigger',
            title: 'Trigger Action',
            items: [
                { type: 'live-chat', label: 'Live Chat', icon: MessageCircle, description: 'Handover to agent' },
                { type: 'date-time', label: 'Appointment', icon: Calendar, description: 'Book appointment' },
                { type: 'ai-response', label: 'AI Responses', icon: Sparkles, description: 'Generate AI reply' },
                { type: 'redirect', label: 'Redirect', icon: ArrowRight, description: 'Navigate user' },
                { type: 'end', label: 'End Screen', icon: Flag, description: 'End conversation' },
            ]
        }
    ];

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                <h2 className="font-bold text-gray-800 text-lg tracking-tight">Question Types</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">Drag & drop to build</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {categories.map((category) => (
                    <div key={category.key} className="mb-6">
                        <button
                            onClick={() => toggleCategory(category.key)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-md transition-colors mb-3 group"
                        >
                            <span className="group-hover:text-brand-600 transition-colors">{category.title}</span>
                            {openCategories[category.key] ?
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-brand-500" /> :
                                <ChevronRight size={14} className="text-gray-400 group-hover:text-brand-500" />
                            }
                        </button>

                        {openCategories[category.key] && (
                            <Droppable droppableId={`sidebar-${category.key}`} isDropDisabled={true}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-3 px-1 animate-fade-in-down"
                                    >
                                        {category.items.map((block, index) => (
                                            <Draggable key={block.type} draggableId={`sidebar-${block.type}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <BlockButton
                                                            icon={block.icon}
                                                            label={block.label}
                                                            description={block.description}
                                                            onClick={() => addStep(block.type)}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SidebarBlocks;
