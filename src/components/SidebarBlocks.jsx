import React from 'react';
import { MessageSquare, Type, List, CheckSquare, Mail, Phone, Flag, Calendar, Hash, Link, Star, Upload } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useFlow } from '../context/FlowContext';

const BlockButton = ({ icon: Icon, label, onClick }) => (
    <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        className="flex items-center gap-3 w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-brand-500 hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
    >
        <div className="p-2 bg-gray-50 rounded-md group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
    </div>
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
        { type: 'date', label: 'Date', icon: Calendar },
        { type: 'number', label: 'Number', icon: Hash },
        { type: 'website', label: 'Website', icon: Link },
        { type: 'rating', label: 'Rating', icon: Star },
        { type: 'file', label: 'File Upload', icon: Upload },
        { type: 'end', label: 'End Screen', icon: Flag },
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
