// components/RoadmapGraph.tsx

"use client";

import { useMemo, memo } from 'react';
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
  NodeResizer 
} from 'reactflow';
import 'reactflow/dist/style.css';

// PERUBAHAN 1: Update interface Milestone
interface Milestone {
  timeframe: string;
  topic: string;
  details: string;
}

interface MilestoneNodeData {
  milestone: Milestone;
  onNodeClick: (node: Milestone) => void;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const MilestoneNode = memo(({ data, selected }: NodeProps<MilestoneNodeData>) => {
  const { milestone, onNodeClick } = data;
  const truncatedDetails = truncateText(milestone.details, 80);

  return (
    <div className="flex flex-col w-full p-4 text-left transition-colors bg-white border shadow-md rounded-xl border-slate-200 hover:border-blue-500" style={{ minHeight: 160 }}>
      <NodeResizer color="#2563eb" handleStyle={{ width: 6, height: 6 }} lineStyle={{ borderWidth: 1.5 }} isVisible={selected} minWidth={300} minHeight={160} />
      <Handle type="target" id="top" position={Position.Top} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="source" id="bottom" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="target" id="left" position={Position.Left} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="source" id="right" position={Position.Right} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="target" id="right-target" position={Position.Right} isConnectable={false} style={{ opacity: 0 }} />
      <Handle type="source" id="left-source" position={Position.Left} isConnectable={false} style={{ opacity: 0 }} />
      
      <div className="flex-grow">
        {/* PERUBAHAN 2: Tampilkan 'timeframe' */}
        <div className="text-xs font-bold tracking-wider text-blue-600">{milestone.timeframe.toUpperCase()}</div>
        <div className="mt-1 text-base font-semibold text-slate-800">{milestone.topic}</div>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{truncatedDetails}</p>
      </div>
      <button onClick={() => onNodeClick(milestone)} className="mt-4 w-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0">
        Jabarkan Materi
      </button>
    </div>
  );
});

const nodeTypes = {
  milestone: MilestoneNode,
};

const generateFlowElements = (milestones: Milestone[], onNodeClick: (node: Milestone) => void): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeWidth = 300;
  const nodeHeightForLayout = 190;
  const horizontalSpacing = 60;
  const verticalSpacing = 60;
  const nodesPerRow = 3;

  milestones.forEach((milestone, index) => {
    // PERUBAHAN 3: Gunakan index untuk ID yang unik
    const nodeId = `milestone-${index}`;
    const row = Math.floor(index / nodesPerRow);
    const col = index % nodesPerRow;

    let x, y;
    y = row * (nodeHeightForLayout + verticalSpacing);
    if (row % 2 === 0) { x = col * (nodeWidth + horizontalSpacing); } 
    else { x = (nodesPerRow - 1 - col) * (nodeWidth + horizontalSpacing); }

    nodes.push({
      id: nodeId,
      type: 'milestone',
      position: { x, y },
      data: { milestone, onNodeClick },
      style: { width: nodeWidth, padding: 0, border: 'none', borderRadius: '12px', backgroundColor: 'transparent' },
    });

    if (index > 0) {
      // Gunakan index untuk mencari node sebelumnya
      const prevNodeId = `milestone-${index - 1}`;
      const prevRow = Math.floor((index - 1) / nodesPerRow);
      let sourceHandle, targetHandle;
      if (row === prevRow) {
        if (row % 2 === 0) { sourceHandle = 'right'; targetHandle = 'left'; } 
        else { sourceHandle = 'left-source'; targetHandle = 'right-target'; }
      } else { sourceHandle = 'bottom'; targetHandle = 'top'; }
      edges.push({
        id: `e-${prevNodeId}-${nodeId}`,
        source: prevNodeId,
        target: nodeId,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        type: 'smoothstep',
        style: { stroke: '#a1a1aa', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15, color: '#a1a1aa' },
      });
    }
  });

  return { nodes, edges };
};

export default function RoadmapGraph({ data, onNodeClick }: { data: { milestones: Milestone[] }, onNodeClick: (milestone: Milestone) => void }) {
  const { nodes, edges } = useMemo(() => generateFlowElements(data.milestones, onNodeClick), [data, onNodeClick]);
  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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