import React, { useEffect, useCallback, useState } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useFlow } from '../context/FlowContext';
import {
    MessageSquare, Type, List, CheckSquare, Mail, Phone, Flag,
    Calendar, Hash, Link, Star, Upload, CircleDot, Clock, Info,
    User, MapPin, Sliders, Image as ImageIcon, Video, ExternalLink,
    Sparkles, MessageCircle, ArrowRight
} from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';

// --- Custom Node Component ---
const icons = {
    welcome: MessageSquare,
    text: Type,
    email: Mail,
    mcq: List,
    'single-choice': CircleDot,
    yesno: CheckSquare,
    phone: Phone,
    date: Calendar,
    time: Clock,
    number: Hash,
    website: Link,
    rating: Star,
    file: Upload,
    statement: Info,
    name: User,
    location: MapPin,
    range: Sliders,
    image: ImageIcon,
    video: Video,
    'link-out': ExternalLink,
    'live-chat': MessageCircle,
    'ai-response': Sparkles,
    redirect: ArrowRight,
    'date-time': Calendar,
    end: Flag
};

const colors = {
    welcome: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-white' },
    text: { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-white' },
    email: { bg: 'bg-indigo-600', border: 'border-indigo-600', text: 'text-white' },
    mcq: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-white' },
    'single-choice': { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-white' },
    yesno: { bg: 'bg-cyan-600', border: 'border-cyan-600', text: 'text-white' },
    phone: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-white' },
    date: { bg: 'bg-teal-600', border: 'border-teal-600', text: 'text-white' },
    time: { bg: 'bg-cyan-700', border: 'border-cyan-700', text: 'text-white' },
    number: { bg: 'bg-lime-600', border: 'border-lime-600', text: 'text-white' },
    website: { bg: 'bg-sky-600', border: 'border-sky-600', text: 'text-white' },
    rating: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-white' },
    file: { bg: 'bg-slate-600', border: 'border-slate-600', text: 'text-white' },
    statement: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-white' },
    name: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-white' },
    location: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-white' },
    range: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-white' },
    image: { bg: 'bg-pink-600', border: 'border-pink-600', text: 'text-white' },
    video: { bg: 'bg-red-600', border: 'border-red-600', text: 'text-white' },
    'link-out': { bg: 'bg-blue-400', border: 'border-blue-400', text: 'text-white' },
    'live-chat': { bg: 'bg-green-600', border: 'border-green-600', text: 'text-white' },
    'ai-response': { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-white' },
    redirect: { bg: 'bg-gray-600', border: 'border-gray-600', text: 'text-white' },
    'date-time': { bg: 'bg-teal-700', border: 'border-teal-700', text: 'text-white' },
    end: { bg: 'bg-rose-600', border: 'border-rose-600', text: 'text-white' },
};

const TimelineNode = ({ data }) => {
    const Icon = icons[data.type] || MessageSquare;
    const theme = colors[data.type] || { bg: 'bg-gray-600', border: 'border-gray-600', text: 'text-white' };

    return (
        <div className="w-[260px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-100 overflow-hidden font-sans group">
            {/* Header */}
            <div className={`${theme.bg} px-4 py-2.5 flex items-center gap-2.5`}>
                <div className="text-white/90">
                    <Icon size={16} strokeWidth={2.5} />
                </div>
                <span className="text-white font-semibold text-xs uppercase tracking-wide opacity-95">
                    {data.type === 'mcq' ? 'Choice' : data.type}
                </span>
                {/* Options/Menu dot (visual only) */}
                <div className="ml-auto w-1 h-1 bg-white/50 rounded-full"></div>
            </div>

            {/* Body */}
            <div className="p-4 bg-white">
                <div className="text-sm font-medium text-gray-800 leading-snug line-clamp-3">
                    {data.label || "Click to edit..."}
                </div>
                {/* Subtext or metadata if any */}
                {data.required && (
                    <div className="mt-2 text-[10px] text-gray-400 font-medium bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                        Required
                    </div>
                )}
            </div>

            {/* Left Input Handle */}
            {data.type !== 'welcome' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-white !border-2 !border-gray-400 !w-3 !h-3 -ml-[7px]"
                />
            )}

            {/* Right Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-white !border-2 !border-brand-500 !w-3 !h-3 -mr-[7px]"
            />
        </div>
    );
};

const nodeTypes = { timeline: TimelineNode };

import NodeEditModal from './NodeEditModal';

const FlowMap = () => {
    const { steps, edges, onEdgesChange, onConnect } = useFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [selectedStepId, setSelectedStepId] = useState(null);

    // Auto-Layout with Dagre
    const getLayoutedElements = useCallback((currentNodes, currentEdges) => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        dagreGraph.setGraph({ rankdir: 'LR', ranksep: 100, nodesep: 30 });

        currentNodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: 260, height: 100 });
        });

        // Use standard edges for layout
        currentEdges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        // ... rest of layout logic (mapping positions) ...
        const layoutedNodes = currentNodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = 'left';
            node.sourcePosition = 'right';

            // We are shifting the dagre positioning a bit to center or handling it
            // Actually dagre gives top-left usually? 
            // ReactFlow nodes have position.

            // Note: If user dragged a node, we might want to preserve that?
            // But this auto-layout runs on change. 
            // For now, strict auto-layout is fine for a "Flow Map".
            // Or we can only run it on mount?
            // Let's run it when steps/edges change.

            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - 130, // Center offset (width/2)
                    y: nodeWithPosition.y - 50,
                },
            };
        });

        return { nodes: layoutedNodes, edges: currentEdges };
    }, []);

    // Sync Steps & Edges to Nodes & Edges
    useEffect(() => {
        if (steps.length === 0) {
            setNodes([]);
            return;
        }

        const flowNodes = steps.map((step, index) => ({
            id: step.id,
            type: 'timeline', // Use our custom component
            data: {
                label: step.title,
                type: step.type,
                index: index,
                isLast: index === steps.length - 1
            },
            position: { x: 0, y: 0 }, // Initial, will be layouted
        }));

        // Run layout
        const { nodes: layoutedNodes } = getLayoutedElements(flowNodes, edges);
        setNodes(layoutedNodes);

        // We use edges directly from context, no need to setEdges local state if we pass context edges to ReactFlow
    }, [steps, edges, getLayoutedElements, setNodes]);

    const onNodeClick = useCallback((event, node) => {
        setSelectedStepId(node.id);
    }, []);

    return (
        <Droppable droppableId="flow-map">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-full h-full bg-gray-50 flex-1 relative transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-4 ring-brand-200 bg-brand-50/50' : ''
                        }`}
                >
                    <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-500 border border-gray-200 shadow-sm pointer-events-none">
                        Visual Timeline {snapshot.isDraggingOver && "(Drop to Add)"}
                    </div>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        defaultEdgeOptions={{
                            type: 'smoothstep',
                            animated: true,
                            style: { stroke: '#94a3b8', strokeWidth: 2 },
                            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
                        }}
                        fitView
                        attributionPosition="bottom-right"
                        nodesDraggable={true}
                        panOnScroll={true}
                        zoomOnScroll={true}
                        panOnDrag={true}
                        onNodeClick={onNodeClick}
                    >
                        <Controls showInteractive={false} />
                        <Background color="#94a3b8" gap={20} size={1} variant="dots" />
                    </ReactFlow>
                    {/* Placeholder required for DnD */}
                    <div className="hidden">{provided.placeholder}</div>

                    {/* Edit Modal */}
                    {selectedStepId && (
                        <NodeEditModal
                            stepId={selectedStepId}
                            onClose={() => setSelectedStepId(null)}
                        />
                    )}
                </div>
            )}
        </Droppable>
    );
};

export default FlowMap;
