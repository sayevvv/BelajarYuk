// components/RoadmapGraph.tsx

"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  MarkerType, 
  Handle, 
  Position,
  NodeProps,
  NodeResizer,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CheckCircle, Calendar, Clock } from 'lucide-react';

// Interface diperbarui untuk data advanced
interface Milestone {
  timeframe: string;
  topic: string;
  sub_tasks: string[];
  estimated_dates?: string;
  daily_duration?: string;
}

interface MilestoneNodeData {
  milestone: Milestone;
  onNodeClick: (node: Milestone) => void;
  promptMode: 'simple' | 'advanced';
}

const MilestoneNode = memo(({ data, selected }: NodeProps<MilestoneNodeData>) => {
  const { milestone, onNodeClick, promptMode } = data;

  return (
    <div className="flex flex-col w-full p-4 text-left transition-colors bg-white border shadow-md rounded-xl border-slate-200 hover:border-blue-500" style={{ minHeight: 180 }}>
      <NodeResizer color="#2563eb" handleStyle={{ width: 6, height: 6 }} lineStyle={{ borderWidth: 1.5 }} isVisible={selected} minWidth={320} minHeight={180} />
      
      {/* Handles untuk semua kemungkinan koneksi */}
      <Handle type="target" id="top" position={Position.Top} isConnectable={true} style={{ opacity: 0 }} />
      <Handle type="source" id="bottom" position={Position.Bottom} isConnectable={true} style={{ opacity: 0 }} />
      <Handle type="target" id="left" position={Position.Left} isConnectable={true} style={{ opacity: 0 }} />
      <Handle type="source" id="right" position={Position.Right} isConnectable={true} style={{ opacity: 0 }} />
      {/* Handle tambahan untuk aliran kanan-ke-kiri */}
      <Handle type="source" id="left-source" position={Position.Left} isConnectable={true} style={{ opacity: 0 }} />
      <Handle type="target" id="right-target" position={Position.Right} isConnectable={true} style={{ opacity: 0 }} />
      
      <div className="flex-grow">
        <div className="text-xs font-bold tracking-wider text-blue-600">{milestone.timeframe.toUpperCase()}</div>
        <div className="mt-1 text-base font-semibold text-slate-800">{milestone.topic}</div>
        
        {promptMode === 'advanced' && (milestone.estimated_dates || milestone.daily_duration) && (
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                {milestone.estimated_dates && (
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{milestone.estimated_dates}</span>
                    </div>
                )}
                {milestone.daily_duration && (
                     <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{milestone.daily_duration}</span>
                    </div>
                )}
            </div>
        )}
        
        <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            {milestone.sub_tasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{task}</span>
                </li>
            ))}
        </ul>
      </div>
      <button onClick={() => onNodeClick(milestone)} className="mt-4 w-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0">
        Jabarkan Materi
      </button>
    </div>
  );
});
MilestoneNode.displayName = 'MilestoneNode';

const nodeTypes = {
  milestone: MilestoneNode,
};

const generateFlowElements = (milestones: Milestone[], onNodeClick: (node: Milestone) => void, promptMode: 'simple' | 'advanced'): { initialNodes: Node[], initialEdges: Edge[] } => {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const nodeWidth = 320;
  const nodeHeightForLayout = 240;
  const horizontalSpacing = 60;
  const verticalSpacing = 60;
  const nodesPerRow = 3;

  milestones.forEach((milestone, index) => {
    const nodeId = `milestone-${index}`;
    const row = Math.floor(index / nodesPerRow);
    const col = index % nodesPerRow;

    let x, y;
    y = row * (nodeHeightForLayout + verticalSpacing);
    if (row % 2 === 0) { x = col * (nodeWidth + horizontalSpacing); } 
    else { x = (nodesPerRow - 1 - col) * (nodeWidth + horizontalSpacing); }

    initialNodes.push({
      id: nodeId,
      type: 'milestone',
      position: { x, y },
      data: { milestone, onNodeClick, promptMode },
      style: { width: nodeWidth, padding: 0, border: 'none', borderRadius: '12px', backgroundColor: 'transparent' },
    });

    if (index > 0) {
      const prevNodeId = `milestone-${index - 1}`;
      const prevRow = Math.floor((index - 1) / nodesPerRow);
      
      let sourceHandle, targetHandle;

      if (row === prevRow) {
        if (row % 2 === 0) {
          sourceHandle = 'right';
          targetHandle = 'left';
        } else {
          sourceHandle = 'left-source';
          targetHandle = 'right-target';
        }
      } else {
        sourceHandle = 'bottom';
        targetHandle = 'top';
      }
      
      initialEdges.push({
        id: `e-${prevNodeId}-${nodeId}`,
        source: prevNodeId,
        target: nodeId,
        sourceHandle,
        targetHandle,
        type: 'smoothstep',
        style: { stroke: '#a1a1aa', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#a1a1aa' },
      });
    }
  });

  return { initialNodes, initialEdges };
};

export default function RoadmapGraph({ data, onNodeClick, promptMode }: { data: { milestones: Milestone[] }, onNodeClick: (milestone: Milestone) => void, promptMode: 'simple' | 'advanced' }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Menggunakan useEffect untuk menginisialisasi atau memperbarui state
  // saat data roadmap baru diterima dari prop.
  useEffect(() => {
    const { initialNodes, initialEdges } = generateFlowElements(data.milestones, onNodeClick, promptMode);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [data, onNodeClick, promptMode]);

  // Callback untuk menangani perubahan node (termasuk drag)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // Callback untuk menangani perubahan edge (jika ada di masa depan)
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true} 
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#e2e8f0" gap={24} />
        <Controls showInteractive={false} className="fill-slate-600 stroke-slate-600 text-slate-600" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
