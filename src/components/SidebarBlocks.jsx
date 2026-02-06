import React from 'react';
import { MessageSquare, Type, List, CheckSquare, Mail, Phone, Flag, Calendar, Hash, Link, Star, Upload, GripVertical } from 'lucide-react';
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

    const blocks = [
        { type: 'welcome', label: 'Welcome Screen', icon: MessageSquare, description: 'Start the conversation' },
        { type: 'text', label: 'Text Input', icon: Type, description: 'Capture text response' },
        { type: 'mcq', label: 'Multiple Choice', icon: List, description: 'Select one option' },
        { type: 'yesno', label: 'Yes / No', icon: CheckSquare, description: 'Binary choice' },
        { type: 'email', label: 'Email', icon: Mail, description: 'Collect email address' },
        { type: 'phone', label: 'Phone Number', icon: Phone, description: 'Collect phone number' },
        { type: 'date', label: 'Date', icon: Calendar, description: 'Capture a date' },
        { type: 'number', label: 'Number', icon: Hash, description: 'Capture a number' },
        { type: 'website', label: 'Website', icon: Link, description: 'Capture a URL' },
        { type: 'rating', label: 'Rating', icon: Star, description: 'User rating' },
        { type: 'file', label: 'File Upload', icon: Upload, description: 'Allow file upload' },
        { type: 'end', label: 'End Screen', icon: Flag, description: 'End conversation' },
    ];

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col p-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">Blocks</h2>

            <Droppable droppableId="sidebar-blocks" isDropDisabled={true}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 overflow-y-auto scrollbar-hide space-y-2"
                    >
                        {blocks.map((block, index) => (
                            <Draggable key={block.type} draggableId={block.type} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="mb-2" // Add margin here instead of inside button for smoother drag
                                    >
                                        <BlockButton
                                            {...block}
                                            onClick={() => addStep(block.type)}
                                        />
                                        {snapshot.isDragging && (
                                            <div className="fixed opacity-0 pointer-events-none">
                                                {/* Ghost element if needed, but the library handles the clone usually. 
                                                   Wait, if I drag it, it moves. 
                                                   In sidebar usually we want a clone to be dragged.
                                                   @hello-pangea/dnd removes the element from the source DOM when dragging.
                                                   Since isDropDisabled=true on this droppable, it will just "return" if dropped elsewhere?
                                                   No, we want it to COPY.
                                                   dnd library doesn't support "copy" natively in a simple way without a copy-on-drag workaround.
                                                   However, checking user requirements: "make the components dragable and drop".
                                                   Usually implies the sidebar item stays there.
                                                   
                                                   Standard workaround: 
                                                   On drag start, we don't modify the source list. 
                                                   But visually the item is picked up.
                                                   
                                                   If I want "Clone" behavior, I need to render a copy in place?
                                                   Or accept that it disappears while dragging. 
                                                   "When dragging an item from the sidebar, it will temporarily disappear..." -> Plan said this.
                                                   So I will stick to standard behavior.
                                                */}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className="pt-4 border-t border-gray-100">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium">Tip: Drag blocks or click to add.</p>
                </div>
            </div>
        </div>
    );
};

export default SidebarBlocks;
