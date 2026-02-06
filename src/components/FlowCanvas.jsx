import React from 'react';
import { useFlow } from '../context/FlowContext';
import StepCard from './StepCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FlowCanvas = () => {
    const { steps, reorderSteps } = useFlow();

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(steps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        reorderSteps(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="flow-canvas">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4 pb-20"
                    >
                        {steps.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <p className="text-gray-400">Your flow is empty. Add a block from the sidebar.</p>
                            </div>
                        ) : (
                            steps.map((step, index) => (
                                <Draggable key={step.id} draggableId={step.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                // transform: snapshot.isDragging ? provided.draggableProps.style.transform : 'none' 
                                            }}
                                        >
                                            <StepCard step={step} dragHandleProps={provided.dragHandleProps} isDragging={snapshot.isDragging} />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default FlowCanvas;
