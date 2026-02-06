import React, { useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useFlow } from '../context/FlowContext';

const FlowBuilder = ({ children }) => {
    const { steps, reorderSteps, insertStep } = useFlow();

    const onDragEnd = useCallback((result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // Reordering within the canvas
        if (source.droppableId === 'flow-canvas' && destination.droppableId === 'flow-canvas') {
            const items = Array.from(steps);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            reorderSteps(items);
            return;
        }

        // Dragging from sidebar to canvas
        if (source.droppableId === 'sidebar-blocks' && destination.droppableId === 'flow-canvas') {
            insertStep(draggableId, destination.index);
            return;
        }

        // Dragging from sidebar to visual map
        if (source.droppableId === 'sidebar-blocks' && destination.droppableId === 'flow-map') {
            insertStep(draggableId, steps.length); // Append to the end
            return;
        }
    }, [steps, reorderSteps, insertStep]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {children}
        </DragDropContext>
    );
};

export default FlowBuilder;
