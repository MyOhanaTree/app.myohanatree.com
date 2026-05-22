import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Node,
  Edge,
  Position,
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

type FamilyRole = "you" | "parent" | "sibling" | "partner" | "child" | "group";

type FamilyNodeData = {
  label: string;
  subLabel?: string;
  link?: string;
  role: FamilyRole;
  isCurrent?: boolean;
  ownerId?: string;
  ownerY?: number;
  isGroupBox?: boolean;
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
  person: Partial<BasicPerson>,
  isCurrent = false,
  extraData: Partial<FamilyNodeData> = {}
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
      isCurrent,
      ...extraData,
    },
  };
}

function createEdge(source: string, target: string, label: string): FamilyEdge {
  return {
    id: `${label}-${source}-${target}`,
    source,
    target,
    style: {
      stroke: label === "partner" ? "#ec4899" : "#94a3b8",
      strokeWidth: label === "partner" ? 2 : 1.5,
    },
    type: label === "partner" ? "straight" : "default",
  };
}

function byBirthDate(a: Partial<BasicPerson>, b: Partial<BasicPerson>) {
  const aTime = a.birthDate ? new Date(a.birthDate + " 00:00:00").getTime() : Number.POSITIVE_INFINITY;
  const bTime = b.birthDate ? new Date(b.birthDate + " 00:00:00").getTime() : Number.POSITIVE_INFINITY;
  const safeATime = Number.isNaN(aTime) ? Number.POSITIVE_INFINITY : aTime;
  const safeBTime = Number.isNaN(bTime) ? Number.POSITIVE_INFINITY : bTime;
  return safeATime - safeBTime;
}

function getPersonId(person: Partial<BasicPerson>) {
  return person.id || person.accountId || "";
}

function mergeRole(existingRole: FamilyRole, incomingRole: FamilyRole): FamilyRole {
  const fixedRoles: FamilyRole[] = ["you", "parent", "sibling"];
  if (fixedRoles.includes(existingRole)) return existingRole;
  if (fixedRoles.includes(incomingRole)) return incomingRole;
  if (existingRole === "partner" || incomingRole === "partner") return "partner";
  return "child";
}

function reflowRightColumn(nodes: FamilyNode[], anchorNodeId?: string): FamilyNode[] {
  const nodesWithoutBoxes = nodes.filter((n) => !n.data.isGroupBox);
  const rightNodes = nodesWithoutBoxes.filter((n) => n.data.role === "partner" || n.data.role === "child");
  if (!rightNodes.length) return nodesWithoutBoxes;

  const baseBand = nodesWithoutBoxes.filter(
    (n) => (n.data.role === "you" || n.data.role === "sibling") && n.position.x === 0
  );
  const siblingCenterY = baseBand.length
    ? (Math.min(...baseBand.map((n) => n.position.y)) + Math.max(...baseBand.map((n) => n.position.y))) / 2
    : 0;

  const uniqueColumns = Array.from(new Set(rightNodes.map((n) => n.position.x))).sort((a, b) => a - b);
  const posById = new Map<string, { x: number; y: number }>();

  uniqueColumns.forEach((columnX) => {
    const columnNodes = rightNodes.filter((n) => Math.abs(n.position.x - columnX) < 0.001);
    const anchorNode = anchorNodeId ? columnNodes.find((n) => n.id === anchorNodeId) : undefined;
    const groups = new Map<string, FamilyNode[]>();

    columnNodes.forEach((n) => {
      const key = n.data.ownerId || `owner-${n.id}`;
      const list = groups.get(key) || [];
      list.push(n);
      groups.set(key, list);
    });

    const orderedGroups = Array.from(groups.values()).sort((a, b) => {
      const aOwnerY = a[0]?.data.ownerY ?? 0;
      const bOwnerY = b[0]?.data.ownerY ?? 0;
      return aOwnerY - bOwnerY;
    });

    const flattened: FamilyNode[] = [];
    orderedGroups.forEach((group) => {
      const sorted = [...group].sort((a, b) => {
        if (a.data.role !== b.data.role) return a.data.role === "partner" ? -1 : 1;
        return a.position.y - b.position.y;
      });
      flattened.push(...sorted);
    });

    const startY = siblingCenterY - ((flattened.length - 1) / 2) * V_SPACING;
    const anchorIndex = anchorNode ? flattened.findIndex((n) => n.id === anchorNode.id) : -1;
    const anchorOffset =
      anchorNode && anchorIndex >= 0
        ? anchorNode.position.y - (startY + anchorIndex * V_SPACING)
        : 0;

    flattened.forEach((n, i) => {
      posById.set(n.id, { x: columnX, y: startY + i * V_SPACING + anchorOffset });
    });
  });

  const positionedNodes = nodesWithoutBoxes.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });

  return positionedNodes;
}

function disableAllEdges(): FamilyEdge[] {
  return [];
}

// ------------------ Layout Builder ------------------

function buildLayout(
  center: FamilyPerson,
  centerX = 0,
  centerY = 0,
  markCurrent = false,
  centerRole: FamilyRole = "you"
): {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
} {
  const nodes: FamilyNode[] = [];
  const edges: FamilyEdge[] = [];

  const centerId = getPersonId(center) || "you";

  const parents = [...(center.parents ?? [])]
    .filter((p) => Boolean(getPersonId(p)))
    .sort(byBirthDate);
  const siblings = [...(center.siblings ?? [])]
    .filter((p) => Boolean(getPersonId(p)))
    .sort(byBirthDate);
  const partners = [...(center.relationships ?? [])]
    .filter((p) => Boolean(getPersonId(p)))
    .sort(byBirthDate);
  const children = [...(center.children ?? [])]
    .filter((p) => Boolean(getPersonId(p)))
    .sort(byBirthDate);

  const siblingGroup = [...siblings, center].sort(byBirthDate);
  const centerIndex = siblingGroup.findIndex((p) => getPersonId(p) === centerId);
  const resolvedCenterIndex = centerIndex >= 0 ? centerIndex : 0;
  const siblingsCenterY =
    centerY +
    (((siblingGroup.length - 1) / 2) - resolvedCenterIndex) * V_SPACING;
  nodes.push(createNode(centerId, centerX, centerY, centerRole, center, markCurrent));

  // --- Parents (LEFT) ---
  parents.forEach((parent, index) => {
    const parentId = getPersonId(parent);
    if (!parentId) return;

    const y =
      siblingsCenterY +
      (index - (parents.length - 1) / 2) * V_SPACING;

    nodes.push(createNode(parentId, centerX - H_SPACING, y, "parent", parent));
  });

  // --- SIBLINGS ORDERED WITH CENTER BY DOB ---
  // Keep current member fixed at y=0 and place siblings relative to that index.
  const siblingsById = new Map(siblings.map((s) => [getPersonId(s), s]));

  if (centerRole === "parent") {
    // Keep parent-branch siblings below the selected parent to avoid
    // reordering above the existing top-parent row in the main view.
    siblings.forEach((sibling, index) => {
      const siblingId = getPersonId(sibling);
      if (!siblingId || siblingId === centerId) return;
      const y = centerY + (index + 1) * V_SPACING;
      nodes.push(createNode(siblingId, centerX, y, "sibling", sibling));
    });
  } else {
    siblingGroup.forEach((personInGroup, index) => {
      const personInGroupId = getPersonId(personInGroup);
      if (!personInGroupId || personInGroupId === centerId) return;

      const sibling = siblingsById.get(personInGroupId);
      if (!sibling) return;

      const y = centerY + (index - resolvedCenterIndex) * V_SPACING;

      nodes.push(createNode(personInGroupId, centerX, y, "sibling", sibling));
    });
  }

  // --- SPOUSE + CHILDREN (ONE RIGHT COLUMN, TOP TO BOTTOM) ---
  const familyRightX = centerX + H_SPACING;
  const partnerItems = partners
    .map((partner) => ({
      id: getPersonId(partner),
      role: "partner" as FamilyRole,
      person: partner,
    }))
    .filter((item) => Boolean(item.id) && item.id !== centerId);

  const childItems = children
    .map((child) => ({
      id: getPersonId(child),
      role: "child" as FamilyRole,
      person: child,
    }))
    .filter((item) => Boolean(item.id));

  const rightColumnItems = [...partnerItems, ...childItems];
  const rightColumnCenterOffset = (rightColumnItems.length - 1) / 2;

  rightColumnItems.forEach((item, index) => {
    const y = siblingsCenterY + (index - rightColumnCenterOffset) * V_SPACING;
    nodes.push(
      createNode(item.id, familyRightX, y, item.role, item.person, false, {
        ownerId: centerId,
        ownerY: centerY,
      })
    );
    if (item.role === "partner" && y !== centerY && centerRole !== "parent") {
      edges.push(createEdge(centerId, item.id, item.role));
    }
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
  group: "#cbd5e1",
};

function FamilyNodeRenderer({ data }: { data: FamilyNodeData }) {
  const { label, subLabel, role, isCurrent } = data;

  if (data.isGroupBox) {
    return <div className="h-full w-full rounded-xl border border-slate-200/90 bg-white/55" />;
  }

  const cardStyle = isCurrent
    ? {
        borderColor: roleToColor[role],
        boxShadow: `0 0 0 2px ${roleToColor[role]}33`,
      }
    : undefined;

  return (
    <div
      className="rounded-lg bg-white px-3 py-2 shadow-md border border-slate-200 w-auto min-w-[170px] max-w-[170px] overflow-hidden"
      style={cardStyle}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      <div className="flex items-start gap-2 overflow-hidden">
        <div className="w-2">
          <span
            className="flex h-2 w-2 rounded-full"
            style={{ backgroundColor: roleToColor[role] }}
          />
        </div>

        <div className="text-xs font-semibold leading-tight truncate flex-grow text-slate-800">
          {label}
        </div>
      </div>

      {subLabel && (
        <div className="text-[10px] mt-0.5 leading-tight break-words text-slate-500">
          {subLabel}
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
  const expandedIdsRef = useRef<Set<string>>(new Set());

  const [nodes, setNodes] = useState<FamilyNode[]>([]);
  const [edges, setEdges] = useState<FamilyEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCenterId, setCurrentCenterId] = useState<string | null>(null);
  const [currentCenterName, setCurrentCenterName] = useState<string>("");

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
      setCurrentCenterName(getDisplayName(person));
      const { nodes: baseNodes } = buildLayout(person, 0, 0, true);

      const siblingNodes = baseNodes.filter((n) => n.data.role === "sibling");
      const siblingFamilies = await Promise.all(
        siblingNodes.map(async (siblingNode) => {
          try {
            const siblingPerson = await fetchFamilyPerson(siblingNode.id);
            const { nodes: siblingBranchNodes } = buildLayout(
              siblingPerson,
              siblingNode.position.x,
              siblingNode.position.y,
              false,
              "sibling"
            );

            return siblingBranchNodes.map((n) => {
              if (n.data.role !== "partner" && n.data.role !== "child") return n;
              return {
                ...n,
                data: {
                  ...n.data,
                  ownerId: siblingNode.id,
                  ownerY: siblingNode.position.y,
                },
              };
            });
          } catch {
            return [] as FamilyNode[];
          }
        })
      );

      const mergedById = new Map(baseNodes.map((n) => [n.id, n]));
      siblingFamilies.flat().forEach((n) => {
        const existing = mergedById.get(n.id);
        if (existing) {
          mergedById.set(n.id, {
            ...existing,
            data: {
              ...existing.data,
              ...n.data,
              role: mergeRole(existing.data.role, n.data.role),
              ownerId: existing.data.ownerId ?? n.data.ownerId,
              ownerY: existing.data.ownerY ?? n.data.ownerY,
            },
          });
          return;
        }
        mergedById.set(n.id, n);
      });

      const nextNodes = reflowRightColumn(Array.from(mergedById.values()));
      const nextEdges = disableAllEdges();

      setNodes(nextNodes);
      setEdges(nextEdges);
      setCurrentCenterId(person.id || null);
      expandedIdsRef.current = new Set([
        ...(person.id ? [person.id] : []),
        ...siblingNodes.map((n) => n.id),
      ]);
    } catch (err: any) {
      setError(err?.message || "Unable to load family tree");
    } finally {
      setLoading(false);
    }
  };

  const expandPerson = useCallback(async (node: Node<FamilyNodeData>) => {
    if (!node.id || expandedIdsRef.current.has(node.id)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const person = await fetchFamilyPerson(node.id);
      setCurrentCenterName(getDisplayName(person));
      const { nodes: branchNodes } = buildLayout(
        person,
        node.position.x,
        node.position.y,
        false,
        node.data.role
      );

      setNodes((prev) => {
        const byId = new Map(prev.map((n) => [n.id, n]));

        branchNodes.forEach((nextNode) => {
          const nextWithOwner =
            nextNode.data.role === "partner" || nextNode.data.role === "child"
              ? {
                  ...nextNode,
                  data: {
                    ...nextNode.data,
                    ownerId: node.id,
                    ownerY: node.position.y,
                  },
                }
              : nextNode;

          const existing = byId.get(nextNode.id);
          if (existing) {
            byId.set(nextNode.id, {
              ...existing,
              data: {
                ...nextWithOwner.data,
                role: mergeRole(existing.data.role, nextWithOwner.data.role),
                ownerId: existing.data.ownerId ?? nextWithOwner.data.ownerId,
                ownerY: existing.data.ownerY ?? nextWithOwner.data.ownerY,
                isCurrent: existing.id === node.id,
              },
            });
            return;
          }
          byId.set(nextNode.id, {
            ...nextWithOwner,
            data: {
              ...nextWithOwner.data,
              isCurrent: nextWithOwner.id === node.id,
            },
          });
        });

        const merged = Array.from(byId.values()).map((n) => ({
          ...n,
          data: {
            ...n.data,
            isCurrent: n.id === node.id,
          },
        }));

        const nextNodes = reflowRightColumn(merged, node.id);

        setEdges(disableAllEdges());

        return nextNodes;
      });

      setCurrentCenterId(node.id);
      expandedIdsRef.current.add(node.id);
    } catch (err: any) {
      setError(err?.message || "Unable to expand family tree");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPerson();
  }, []);

  useEffect(() => {
    if (!focusId) return;
    if (focusId === currentCenterId) return;
    loadPerson(focusId);
  }, [focusId, currentCenterId]);

  const recenterOnCurrent = useCallback(() => {
    if (!currentCenterId) return;
    loadPerson(currentCenterId);
  }, [currentCenterId]);

const onNodeClick = useCallback(
    (_: unknown, node: Node<FamilyNodeData>) => {
      if (node.data.isGroupBox) return;
      setCurrentCenterName(node.data.label || "Unknown");
      setCurrentCenterId(node.id);

      const isParentSiblingNode = node.data.role === "sibling" && node.position.x < 0;
      if (isParentSiblingNode) {
        loadPerson(node.id);
        return;
      }

      expandPerson(node);

      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isCurrent: n.id === node.id,
          },
        }))
      );
    },
    [expandPerson]
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { stroke: "#94a3b8" },
    }),
    []
  );

  return (
    <div className="grow min-h-0 flex flex-col">
      <div className="flex items-center justify-between border border-slate-200 bg-white px-3 py-2 text-sm">
        <div className="text-slate-700">
          Currently viewing: <span className="font-semibold text-slate-900">{currentCenterName || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={recenterOnCurrent}
            disabled={!currentCenterId || loading}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Recenter on selected
          </button>
          {currentCenterId && (
            <Link to={`/person/${currentCenterId}`} className="text-slate-700 underline">
              Go to profile
            </Link>
          )}
        </div>
      </div>

      <div className="relative grow min-h-0 overflow-hidden border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-xl">
      {(loading || error) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur">
          <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-lg text-slate-700">
            {loading ? "Loading family…" : error}
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
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
    </div>
  );
};

export const FamilyFlow: React.FC<FamilyFlowProps> = ({ focusId }) => (
  <ReactFlowProvider>
    <FamilyFlowInner focusId={focusId} />
  </ReactFlowProvider>
);
