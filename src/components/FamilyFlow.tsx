import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import { fetchFamilyPerson } from "../api/family";
import logo from "/myohanatree-logo.png";
import type { FamilyPerson, BasicPerson } from "../types/family";

type FamilyRole = "you" | "parent" | "sibling" | "partner" | "child";

type FamilyNodeData = {
  label: string;
  subLabel?: string;
  link?: string;
  role: FamilyRole;
};

type FamilyNode = Node<FamilyNodeData>;
type FamilyEdge = Edge;

const H_SPACING = 200;
const V_SPACING = 80;

// ------------------ Helpers ------------------

function getDisplayName(p: Partial<BasicPerson>) {
  return (
    [p.firstName, p.lastName].filter(Boolean).join(" ") ||
    p.fullName ||
    "Unknown"
  );
}

function createNode(
  id: string,
  x: number,
  y: number,
  role: FamilyRole,
  person: Partial<BasicPerson>
): FamilyNode {
  return {
    id,
    type: "familyNode",
    position: { x, y },
    data: {
      label: getDisplayName(person),
      subLabel: person.birthDate ? `b. ${new Date(person.birthDate + " 00:00:00").toLocaleDateString()}` : undefined,
      link: "/person/" + id,
      role,
    },
  };
}

function createEdge(source: string, target: string, label: string): FamilyEdge {
  return {
    id: `${label}-${source}-${target}`,
    source,
    target,
    label,
  };
}

// ------------------ Layout Builder ------------------

function buildLayout(center: FamilyPerson): {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
} {
  const nodes: FamilyNode[] = [];
  const edges: FamilyEdge[] = [];

  const centerId = center.id || "you";

  nodes.push(createNode(centerId, 0, 0, "you", center));

  const parents = center.parents ?? [];
  const siblings = center.siblings ?? [];
  const partners = center.relationships ?? [];
  const children = center.children ?? [];

  // --- Parents (LEFT) ---
  parents.forEach((parent, index) => {
    const y = (index - (parents.length - 1) / 2) * V_SPACING;

    nodes.push(createNode(parent.id, -H_SPACING, y, "parent", parent));
    edges.push(createEdge(parent.id, centerId, "parent"));
  });

  // --- SIBLINGS BELOW CENTER ---
  const siblingStartY = V_SPACING;

  siblings.forEach((sibling, index) => {
    const y = siblingStartY + index * V_SPACING;

    nodes.push(createNode(sibling.id, 0, y, "sibling", sibling));
    edges.push(createEdge(centerId, sibling.id, "sibling"));
  });

  // --- PARTNERS (RIGHT COLUMN) ---
  const partnersStartX = H_SPACING;
  partners.forEach((partner, index) => {
    const x = partnersStartX + index * H_SPACING;

    nodes.push(createNode(partner.id, x, 0, "partner", partner));
    edges.push(createEdge(centerId,partner.id, "partner"));
  });

  // --- CHILDREN (RIGHT COLUMN BELOW PARTNERS) ---
  const childStartY = V_SPACING;
  children.forEach((child, index) => {
    const y = childStartY + index * V_SPACING;

    nodes.push(createNode(child.id, H_SPACING, y, "child", child));
    edges.push(createEdge(centerId, child.id, "child"));
  });

  return { nodes, edges };
}


// ------------------ Node Renderer ------------------

const roleToColor: Record<FamilyRole, string> = {
  you: "#0ea5e9",
  parent: "#6366f1",
  sibling: "#22c55e",
  partner: "#ec4899",
  child: "#f97316",
};

function FamilyNodeRenderer({ data }: { data: FamilyNodeData }) {
  const { label, subLabel, link, role } = data;

  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-md border border-slate-200 w-auto min-w-[170px] max-w-[170px] overflow-hidden">
      <div className="flex items-start gap-2 overflow-hidden">
        <div className="w-2">
          <span
            className="flex h-2 w-2 rounded-full"
            style={{ backgroundColor: roleToColor[role] }}
          />
        </div>

        <div className="text-xs font-semibold text-slate-800 leading-tight truncate flex-grow">
          {label}
        </div>
      </div>

      {subLabel && (
        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight break-words">
          {subLabel}
        </div>
      )}

      {link && (
        <div className="text-[10px] text-slate-500 mt-1.5 leading-tight break-words">
          <Link to={link} className="underline">
            View Profile
          </Link>
        </div>
      )}
    </div>

  );
}

const nodeTypes = {
  familyNode: FamilyNodeRenderer,
};

// ------------------ Main Component ------------------

type FamilyFlowProps = { focusId?: string | null };

const FamilyFlowInner: React.FC<FamilyFlowProps> = ({ focusId }) => {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<FamilyNode[]>([]);
  const [edges, setEdges] = useState<FamilyEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rfKey, setRfKey] = useState(0);
  const [currentCenterId, setCurrentCenterId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const loadPerson = async (id?: string) => {
    setLoading(true);
    setError(null);

    try {
      const person = await fetchFamilyPerson(id);
      const { nodes, edges } = buildLayout(person);

      setNodes(nodes);
      setEdges(edges);
      setCurrentCenterId(person.id || null);

      setRfKey((k) => k + 1);
    } catch (err: any) {
      setError(err?.message || "Unable to load family tree");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerson();
  }, []);

  useEffect(() => {
    if (!focusId) return;
    if (focusId === currentCenterId) return;
    loadPerson(focusId);
  }, [focusId, currentCenterId]);

  const onNodeClick = useCallback(
    (_: unknown, node: Node<FamilyNodeData>) => {
      if (node.data.role === "you") navigate(`/person/${node.id}`);
      loadPerson(node.id);
    },
    [navigate]
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: "#94a3b8" },
    }),
    []
  );

  return (
    <div className="grow relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-xl">
      {(loading || error) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur">
          <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-lg text-slate-700">
            {loading ? "Loading family…" : error}
          </div>
        </div>
      )}

      <ReactFlow
        key={rfKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={24} />

        <MiniMap
          style={{
            width: 100,
            height: 70,
            bottom: 10,
            right: 10,
            borderRadius: 8,
          }}
          pannable
          nodeStrokeColor={(n) =>
            roleToColor[(n.data as FamilyNodeData).role]
          }
          nodeColor="#fff"
        />

        <Controls 
          position="bottom-right" 
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
};

export const FamilyFlow: React.FC<FamilyFlowProps> = ({ focusId }) => (
  <ReactFlowProvider>
    <FamilyFlowInner focusId={focusId} />
  </ReactFlowProvider>
);
