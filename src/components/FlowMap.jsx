import React, { useMemo, useEffect } from 'react';
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
import { Mail, MessageSquare, List, CheckSquare, Phone, Flag, Type } from 'lucide-react';

// --- Custom Node Component ---
const icons = {
    welcome: MessageSquare,
    text: Type,
    email: Mail,
    mcq: List,
    yesno: CheckSquare,
    phone: Phone,
    end: Flag
};

const colors = {
    welcome: 'bg-blue-50 border-blue-200 text-blue-600',
    text: 'bg-white border-gray-200 text-gray-600',
    email: 'bg-purple-50 border-purple-200 text-purple-600',
    mcq: 'bg-orange-50 border-orange-200 text-orange-600',
    yesno: 'bg-green-50 border-green-200 text-green-600',
    phone: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    end: 'bg-red-50 border-red-200 text-red-600',
};

const TimelineNode = ({ data }) => {
    const Icon = icons[data.type] || MessageSquare;
    const theme = colors[data.type] || colors.text;

    return (
        <div className={`relative w-[280px] p-4 rounded-xl border-2 shadow-sm transition-all hover:shadow-md ${theme} group`}>
            {/* Input Handle */}
            {data.index !== 0 && (
                <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3 -mt-2" />
            )}

            <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg bg-white bg-opacity-60 shadow-sm shrink-0`}>
                    <Icon size={20} />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">{data.type}</div>
                    <div className="text-sm font-semibold leading-tight line-clamp-2">{data.label}</div>
                </div>
            </div>

            {/* Output Handle */}
            {!data.isLast && (
                <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-3 !h-3 -mb-2" />
            )}
        </div>
    );
};

const nodeTypes = { timeline: TimelineNode };

// --- Layout Logic ---
const nodeWidth = 300;
const nodeHeight = 120;

const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 50 }); // TB = Top to Bottom

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = 'top';
        node.sourcePosition = 'bottom';

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

const FlowMap = () => {
    const { steps } = useFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (steps.length === 0) {
            setNodes([]);
            setEdges([]);
            return;
        }

        // Transform steps to Nodes
        const newNodes = steps.map((step, index) => ({
            id: step.id,
            type: 'timeline', // Use our custom component
            data: {
                label: step.title,
                type: step.type,
                index: index,
                isLast: index === steps.length - 1
            },
            position: { x: 0, y: 0 },
        }));

        const newEdges = [];
        for (let i = 0; i < steps.length - 1; i++) {
            newEdges.push({
                id: `e${steps[i].id}-${steps[i + 1].id}`,
                source: steps[i].id,
                target: steps[i + 1].id,
                type: 'default',
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                animated: false,
                style: { stroke: '#cbd5e1', strokeWidth: 3 },
            });
        }

        const layouted = getLayoutedElements(newNodes, newEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);

    }, [steps, setNodes, setEdges]);

    const key = useMemo(() => steps.map(s => s.id).join(','), [steps]);

    return (
        <div className="w-full h-full bg-gray-50 flex-1 relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-500 border border-gray-200 shadow-sm">
                Visual Timeline
            </div>
            <ReactFlow
                key={key}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
            >
                <Controls />
                <Background color="#e2e8f0" gap={24} size={2} />
            </ReactFlow>
        </div>
    );
};

export default FlowMap;
