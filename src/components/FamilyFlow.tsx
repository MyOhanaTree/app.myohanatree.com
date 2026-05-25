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
  ReactFlowInstance,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import { fetchFamilyPerson } from "../api/family";
import type { FamilyPerson, BasicPerson } from "../types/family";

type FamilyRole = "you" | "parent" | "sibling" | "partner" | "child" | "group";

type FamilyNodeData = {
  label: string;
  subLabel?: string;
  birthTime?: number;
  link?: string;
  role: FamilyRole;
  isCurrent?: boolean;
  ownerId?: string;
  ownerY?: number;
  isGroupBox?: boolean;
};

type FamilyNode = Node<FamilyNodeData>;
type FamilyEdge = Edge;

const H_SPACING = 225;
// Vertical spacing between generations (increase to separate rows more)
const V_SPACING = 130;
// Partner gap: slightly smaller than horizontal spacing but larger than node width
// (node min width is 170px). Keeps partner cards tighter than sibling spacing.
const PARTNER_GAP = 180;
const PARENT_TO_FIRST_SIBLING_GAP = H_SPACING;
const GRANDPARENT_SET_MIN_GAP = 420;
const GRANDPARENT_PARENT_SET_MIN_GAP = 520;

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
      birthTime: person.birthDate ? new Date(person.birthDate + " 00:00:00").getTime() : undefined,
      link: "/person/" + id,
      role,
      isCurrent,
      ...extraData,
    },
  };
}

function createEdge(source: string, target: string, label: string): FamilyEdge {
  // Avoid self-edges
  if (source === target) {
    return {
      id: `skip-self-${source}`,
      source,
      target,
      style: { stroke: "transparent" },
      type: "default",
      data: { skip: true },
    };
  }

  const stroke = label === "partner" ? "#ec4899" : "#94a3b8";
  const strokeWidth = label === "partner" ? 2 : 1.5;
  const curvedTypes = new Set(["parent", "child"]);

  return {
    id: `${label}-${source}-${target}`,
    source,
    target,
    style: {
      stroke,
      strokeWidth,
    },
    type: curvedTypes.has(label) ? "smoothstep" : "default",
    animated: false,
    // ensure no arrow heads by default
    markerEnd: undefined,
  };
}

function getNodeCenterPosition(node: FamilyNode, flowInstance: ReactFlowInstance | null) {
  const flowNode: { width?: number; height?: number } | undefined =
    (flowInstance?.getNode(node.id) as any) ?? undefined;
  const width = flowNode?.width ?? 170;
  const height = flowNode?.height ?? 60;
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
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
  // Keep descendant-lane relationship roles stable during branch expansion.
  // When opening a child node, shared relatives can reappear as "sibling"
  // in that local branch; preserving child/partner avoids layout collisions.
  if ((existingRole === "child" || existingRole === "partner") && incomingRole === "sibling") {
    return existingRole;
  }
  // Preserve established relationship lane when the same person is discovered
  // later from another branch as child vs partner.
  if (existingRole === "child" && incomingRole === "partner") return "child";
  if (existingRole === "partner" && incomingRole === "child") return "partner";

  const fixedRoles: FamilyRole[] = ["you", "parent", "sibling"];
  if (fixedRoles.includes(existingRole)) return existingRole;
  if (fixedRoles.includes(incomingRole)) return incomingRole;
  if (existingRole === "partner" || incomingRole === "partner") return "partner";
  return "child";
}

function reflowBottomRow(nodes: FamilyNode[], anchorNodeId?: string): FamilyNode[] {
  const nodesWithoutBoxes = nodes.filter((n) => !n.data.isGroupBox);
  const bottomNodes = nodesWithoutBoxes.filter((n) => n.data.role === "child");
  if (!bottomNodes.length) return nodesWithoutBoxes;

  const baseBand = nodesWithoutBoxes.filter(
    (n) => n.data.role === "you" || n.data.role === "sibling"
  );
  const siblingCenterX = baseBand.length
    ? (Math.min(...baseBand.map((n) => n.position.x)) + Math.max(...baseBand.map((n) => n.position.x))) / 2
    : 0;

  const uniqueRows = Array.from(new Set(bottomNodes.map((n) => n.position.y))).sort((a, b) => a - b);
  const posById = new Map<string, { x: number; y: number }>();

  uniqueRows.forEach((rowY) => {
    const rowNodes = bottomNodes.filter((n) => Math.abs(n.position.y - rowY) < 0.001);
    const anchorNode = anchorNodeId ? rowNodes.find((n) => n.id === anchorNodeId) : undefined;
    const groups = new Map<string, FamilyNode[]>();

    rowNodes.forEach((n) => {
      const key = n.data.ownerId || `owner-${n.id}`;
      const list = groups.get(key) || [];
      list.push(n);
      groups.set(key, list);
    });

    const orderedGroups = Array.from(groups.values()).sort((a, b) => {
      const aOwnerY = a[0]?.data.ownerY ?? 0;
      const bOwnerY = b[0]?.data.ownerY ?? 0;
      if (aOwnerY !== bOwnerY) return aOwnerY - bOwnerY;

      const aOwnerId = a[0]?.data.ownerId || "";
      const bOwnerId = b[0]?.data.ownerId || "";
      return aOwnerId.localeCompare(bOwnerId);
    });

    const flattened: FamilyNode[] = [];
    orderedGroups.forEach((group) => {
      const sorted = [...group].sort((a, b) => {
        const aBirth = Number.isFinite(a.data.birthTime) ? (a.data.birthTime as number) : Number.POSITIVE_INFINITY;
        const bBirth = Number.isFinite(b.data.birthTime) ? (b.data.birthTime as number) : Number.POSITIVE_INFINITY;
        if (aBirth !== bBirth) return aBirth - bBirth;

        const byLabel = (a.data.label || "").localeCompare(b.data.label || "");
        if (byLabel !== 0) return byLabel;

        return a.id.localeCompare(b.id);
      });
      flattened.push(...sorted);
    });

    const startX = siblingCenterX - ((flattened.length - 1) / 2) * H_SPACING;
    const anchorIndex = anchorNode ? flattened.findIndex((n) => n.id === anchorNode.id) : -1;
    const anchorOffset =
      anchorNode && anchorIndex >= 0
        ? anchorNode.position.x - (startX + anchorIndex * H_SPACING)
        : 0;

    flattened.forEach((n, i) => {
      posById.set(n.id, { x: startX + i * H_SPACING + anchorOffset, y: rowY });
    });
  });

  const positionedNodes = nodesWithoutBoxes.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });

  return positionedNodes;
}

function reflowParentRows(nodes: FamilyNode[]): FamilyNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const parentRows = Array.from(
    new Set(
      nodes.filter((n) => n.data.role === "parent").map((n) => n.position.y)
    )
  );
  const posById = new Map<string, { x: number; y: number }>();

  parentRows.forEach((rowY) => {
    const rowParents = nodes.filter(
      (n) => n.data.role === "parent" && Math.abs(n.position.y - rowY) < 0.001
    );

    const groups = new Map<string, FamilyNode[]>();
    rowParents.forEach((n) => {
      const key = n.data.ownerId || `owner-${n.id}`;
      const list = groups.get(key) || [];
      list.push(n);
      groups.set(key, list);
    });

    Array.from(groups.values()).forEach((group) => {
      const groupOwnerId = group[0]?.data.ownerId || "";
      const owner = groupOwnerId ? byId.get(groupOwnerId) : undefined;
      const groupCenterX = owner
        ? owner.position.x
        : group.reduce((sum, n) => sum + n.position.x, 0) / group.length;

      const sorted = [...group].sort((a, b) => {
        const aBirth = Number.isFinite(a.data.birthTime) ? (a.data.birthTime as number) : Number.POSITIVE_INFINITY;
        const bBirth = Number.isFinite(b.data.birthTime) ? (b.data.birthTime as number) : Number.POSITIVE_INFINITY;
        if (aBirth !== bBirth) return aBirth - bBirth;
        return (a.data.label || "").localeCompare(b.data.label || "");
      });

      sorted.forEach((n, index) => {
        posById.set(n.id, {
          x: groupCenterX + (index - (sorted.length - 1) / 2) * PARTNER_GAP,
          y: rowY,
        });
      });
    });
  });

  return nodes.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });
}

function reflowSiblingPartnerRows(nodes: FamilyNode[], anchorNodeId?: string): FamilyNode[] {
  const positioned = [...nodes];
  const byId = new Map(positioned.map((n) => [n.id, n]));
  const posById = new Map<string, { x: number; y: number }>();

  const anchorRows = Array.from(
    new Set(
      positioned
        .filter((n) => n.data.role === "you" || n.data.role === "sibling")
        .map((n) => n.position.y)
    )
  );

  // We'll align each anchor row to a common center so rows are visually centered to each other.
  let mainCenterX: number | null = null;

  anchorRows.forEach((rowY) => {
    const anchors = positioned
      .filter(
        (n) =>
          (n.data.role === "you" || n.data.role === "sibling") &&
          Math.abs(n.position.y - rowY) < 0.001
      )
      .sort((a, b) => a.position.x - b.position.x);

    if (!anchors.length) return;
    const isDerivedBranchRow = anchors.every((n) => Boolean(n.data.ownerId));

    const firstAnchor = anchors[0]!;
    let cursorX = firstAnchor.position.x;

    anchors.forEach((anchor) => {
      const partnerNodes = positioned
        .filter(
          (n) =>
            n.data.role === "partner" &&
            n.data.ownerId === anchor.id &&
            Math.abs(n.position.y - rowY) < 0.001
        )
        .sort((a, b) => {
          const aBirth = Number.isFinite(a.data.birthTime) ? (a.data.birthTime as number) : Number.POSITIVE_INFINITY;
          const bBirth = Number.isFinite(b.data.birthTime) ? (b.data.birthTime as number) : Number.POSITIVE_INFINITY;
          if (aBirth !== bBirth) return aBirth - bBirth;
          return a.id.localeCompare(b.id);
        });

      const anchorX = Math.max(anchor.position.x, cursorX);
      posById.set(anchor.id, { x: anchorX, y: rowY });

      partnerNodes.forEach((partner, index) => {
        posById.set(partner.id, { x: anchorX + (index + 1) * PARTNER_GAP, y: rowY });
      });

      cursorX = anchorX + partnerNodes.length * PARTNER_GAP + H_SPACING;
    });

    // Compute this row's min/max x from assigned positions (anchors + partners).
    const xs: number[] = [];
    anchors.forEach((a) => {
      const p = posById.get(a.id) || { x: a.position.x, y: a.position.y };
      xs.push(p.x);
      // include partners owned by this anchor
      positioned
        .filter((n) => n.data.role === "partner" && n.data.ownerId === a.id && Math.abs(n.position.y - rowY) < 0.001)
        .forEach((pn) => {
          const pp = posById.get(pn.id) || { x: pn.position.x, y: pn.position.y };
          xs.push(pp.x);
        });
    });

    if (!xs.length) return;
    if (isDerivedBranchRow) return;

    const rowMin = Math.min(...xs);
    const rowMax = Math.max(...xs);
    const rowCenter = (rowMin + rowMax) / 2;

    if (mainCenterX === null) {
      mainCenterX = rowCenter;
    } else {
      const delta = mainCenterX - rowCenter;
      if (Math.abs(delta) > 0.001) {
        Array.from(posById.entries()).forEach(([id, pos]) => {
          if (Math.abs(pos.y - rowY) < 0.001) {
            posById.set(id, { x: pos.x + delta, y: pos.y });
          }
        });
      }
    }

    // If an explicit anchorNodeId was requested, shift this row so that node lines up.
    if (anchorNodeId && posById.has(anchorNodeId)) {
      const anchorNode = byId.get(anchorNodeId);
      const computed = posById.get(anchorNodeId);
      if (anchorNode && computed) {
        const deltaX = anchorNode.position.x - computed.x;
        if (Math.abs(deltaX) > 0.001) {
          Array.from(posById.entries()).forEach(([id, pos]) => {
            if (Math.abs(pos.y - rowY) < 0.001) {
              posById.set(id, { x: pos.x + deltaX, y: pos.y });
            }
          });
          // adjust mainCenterX as well so subsequent rows keep alignment
          mainCenterX = (mainCenterX ?? 0) + deltaX;
        }
      }
    }
  });

  return positioned.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });
}

function separateGrandparentSiblingSets(nodes: FamilyNode[]): FamilyNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const posById = new Map<string, { x: number; y: number }>();
  const siblingRows = Array.from(
    new Set(
      nodes
        .filter((n) => n.data.role === "sibling" && n.data.ownerId)
        .map((n) => n.position.y)
    )
  );
  const MIN_SET_GAP = GRANDPARENT_SET_MIN_GAP;

  siblingRows.forEach((rowY) => {
    const rowSiblings = nodes.filter(
      (n) =>
        n.data.role === "sibling" &&
        n.data.ownerId &&
        Math.abs(n.position.y - rowY) < 0.001
    );
    if (!rowSiblings.length) return;

    const groups = new Map<string, FamilyNode[]>();
    rowSiblings.forEach((n) => {
      const ownerId = n.data.ownerId as string;
      const owner = byId.get(ownerId);
      if (!owner || owner.data.role !== "parent") return;
      const list = groups.get(ownerId) || [];
      list.push(n);
      groups.set(ownerId, list);
    });

    if (groups.size < 2) return;

    const segments = Array.from(groups.entries())
      .map(([ownerId, members]) => {
        const xs = members.map((m) => m.position.x);
        const owner = byId.get(ownerId)!;
        return {
          ownerId,
          ownerX: owner.position.x,
          members,
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
        };
      })
      .sort((a, b) => a.ownerX - b.ownerX);

    const left = segments[0];
    const right = segments[segments.length - 1];
    if (!left || !right || left.ownerId === right.ownerId) return;

    const currentGap = right.minX - left.maxX;
    if (currentGap >= MIN_SET_GAP) return;

    const delta = (MIN_SET_GAP - currentGap) / 2;
    left.members.forEach((m) => posById.set(m.id, { x: m.position.x - delta, y: m.position.y }));
    right.members.forEach((m) => posById.set(m.id, { x: m.position.x + delta, y: m.position.y }));
  });

  return nodes.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });
}

function separateGrandparentParentSets(nodes: FamilyNode[]): FamilyNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const posById = new Map<string, { x: number; y: number }>();
  const parentRows = Array.from(
    new Set(
      nodes
        .filter((n) => n.data.role === "parent" && n.data.ownerId)
        .map((n) => n.position.y)
    )
  );

  parentRows.forEach((rowY) => {
    const rowParents = nodes.filter(
      (n) =>
        n.data.role === "parent" &&
        n.data.ownerId &&
        Math.abs(n.position.y - rowY) < 0.001
    );
    if (!rowParents.length) return;

    const groups = new Map<string, FamilyNode[]>();
    rowParents.forEach((n) => {
      const ownerId = n.data.ownerId as string;
      const owner = byId.get(ownerId);
      if (!owner || owner.data.role !== "parent") return;
      const list = groups.get(ownerId) || [];
      list.push(n);
      groups.set(ownerId, list);
    });

    if (groups.size < 2) return;

    const segments = Array.from(groups.entries())
      .map(([ownerId, members]) => {
        const xs = members.map((m) => m.position.x);
        const owner = byId.get(ownerId)!;
        return {
          ownerId,
          ownerX: owner.position.x,
          members,
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
        };
      })
      .sort((a, b) => a.ownerX - b.ownerX);

    const left = segments[0];
    const right = segments[segments.length - 1];
    if (!left || !right || left.ownerId === right.ownerId) return;

    const currentGap = right.minX - left.maxX;
    if (currentGap >= GRANDPARENT_PARENT_SET_MIN_GAP) return;

    const delta = (GRANDPARENT_PARENT_SET_MIN_GAP - currentGap) / 2;
    left.members.forEach((m) => posById.set(m.id, { x: m.position.x - delta, y: m.position.y }));
    right.members.forEach((m) => posById.set(m.id, { x: m.position.x + delta, y: m.position.y }));
  });

  return nodes.map((n) => {
    const pos = posById.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });
}

function computeEdgesFromNodes(nodes: FamilyNode[]): FamilyEdge[] {
  const edges: FamilyEdge[] = [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const pushVerticalEdge = (a: FamilyNode, b: FamilyNode, label: string) => {
    if (a.id === b.id) return;
    const upper = a.position.y <= b.position.y ? a : b;
    const lower = a.position.y <= b.position.y ? b : a;
    const e = createEdge(upper.id, lower.id, label);
    if (!e.data || !e.data.skip) {
      e.sourceHandle = "bottom";
      e.targetHandle = "top";
      edges.push(e);
    }
  };

  // Partners and children use ownerId for direct connection
  nodes.forEach((n) => {
    // Do not draw spouse/partner lines. Draw child edges to all applicable parents.
    if (n.data.role === "child" && n.data.ownerId && n.data.ownerId !== n.id) {
      const owner = byId.get(n.data.ownerId as string);
      if (!owner) return;
      const parents = new Map<string, FamilyNode>([[owner.id, owner]]);

      // If the owner is a spouse/partner node, also connect child to that partner's owner.
      if (owner.data.role === "partner" && owner.data.ownerId) {
        const partnerOwner = byId.get(owner.data.ownerId);
        if (partnerOwner) {
          parents.set(partnerOwner.id, partnerOwner);
        }
      }

      // If owner has spouse/partner nodes on the same row, connect child to those as well.
      nodes.forEach((candidate) => {
        if (
          candidate.data.role === "partner" &&
          candidate.data.ownerId === owner.id &&
          Math.abs(candidate.position.y - owner.position.y) < 0.001
        ) {
          parents.set(candidate.id, candidate);
        }
      });

      parents.forEach((parentNode) => pushVerticalEdge(parentNode, n, "child"));
    }
  });

// Parents: connect each parent to the correct sibling-generation nodes on the owner's row.
  nodes.forEach((n) => {
    if (n.data.role !== "parent" || !n.data.ownerId || n.data.ownerId === n.id) return;
    const owner = byId.get(n.data.ownerId as string);
    if (!owner) return;

    const isRootOwner = owner.data.role === "you" || owner.data.role === "sibling";
    const siblings = nodes.filter((m) => {
      if (m.id === owner.id) return true;
      if (isRootOwner) {
        return (
          (m.data.role === "you" || m.data.role === "sibling") &&
          Math.abs(m.position.y - owner.position.y) < 0.001
        );
      }
      return (
        m.data.role === "sibling" &&
        m.data.ownerId === owner.id &&
        Math.abs(m.position.y - owner.position.y) < 0.001
      );
    });

    siblings.forEach((sibling) => {
      if (sibling.id === n.id) return;
      pushVerticalEdge(sibling, n, "parent");
    });
  });

  // Deduplicate edges by id
  const unique = new Map<string, FamilyEdge>();
  edges.forEach((e) => unique.set(e.id, e));
  return Array.from(unique.values());
}

// ------------------ Layout Builder ------------------

function buildLayout(
  center: FamilyPerson,
  centerX = 0,
  centerY = 0,
  markCurrent = false,
  centerRole: FamilyRole = "you",
  parentSiblingDirection: -1 | 1 = -1
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
  const siblingsCenterX =
    centerX +
    (((siblingGroup.length - 1) / 2) - resolvedCenterIndex) * H_SPACING;
  const branchAnchorX = centerRole === "parent" ? centerX : siblingsCenterX;
  const partnerLaneWidth = partners.length ? PARTNER_GAP + (partners.length - 1) * PARTNER_GAP : 0;
  nodes.push(createNode(centerId, centerX, centerY, centerRole, center, markCurrent));

  // --- Parents (BOTTOM / ROOT-LIKE) ---
  parents.forEach((parent, index) => {
    const parentId = getPersonId(parent);
    if (!parentId) return;

    const x =
      branchAnchorX +
      (index - (parents.length - 1) / 2) * PARTNER_GAP;

    nodes.push(
      createNode(parentId, x, centerY + V_SPACING, "parent", parent, false, {
        ownerId: centerId,
        ownerY: centerX,
      })
    );
  });

  // --- SIBLINGS ORDERED WITH CENTER BY DOB ---
  // Keep current member fixed at y=0 and place siblings relative to that index.
  const siblingsById = new Map(siblings.map((s) => [getPersonId(s), s]));
  const siblingExtraData = centerRole === "you" ? {} : { ownerId: centerId, ownerY: centerX };

  const siblingSpacing = centerRole === "parent" ? PARTNER_GAP : H_SPACING;
  const parentSideSiblings = siblingGroup.filter((p) => getPersonId(p) && getPersonId(p) !== centerId);
  siblingGroup.forEach((personInGroup, index) => {
    const personInGroupId = getPersonId(personInGroup);
    if (!personInGroupId || personInGroupId === centerId) return;

    const sibling = siblingsById.get(personInGroupId);
    if (!sibling) return;

    let x = centerX;
    if (centerRole === "parent") {
      // For parent-centered expansion: place all siblings on the selected side.
      const sideIndex = parentSideSiblings.findIndex((p) => getPersonId(p) === personInGroupId);
      const offset = sideIndex >= 0 ? sideIndex : index;
      x =
        centerX +
        parentSiblingDirection *
          (PARENT_TO_FIRST_SIBLING_GAP + offset * siblingSpacing);
    } else {
      const relativeIndex = index - resolvedCenterIndex;
      const siblingShift = relativeIndex > 0 ? partnerLaneWidth : 0;
      x = centerX + relativeIndex * siblingSpacing + siblingShift;
    }

    nodes.push(createNode(personInGroupId, x, centerY, "sibling", sibling, false, siblingExtraData));
  });

  // --- PARTNERS (SAME ROW AS CENTER, TIGHTER GAP) ---
  const partnerItems = partners
    .map((partner) => ({
      id: getPersonId(partner),
      role: "partner" as FamilyRole,
      person: partner,
    }))
    .filter((item) => Boolean(item.id) && item.id !== centerId);

  partnerItems.forEach((item, index) => {
    const x = centerX + (index + 1) * PARTNER_GAP;
    nodes.push(
      createNode(item.id, x, centerY, item.role, item.person, false, {
        ownerId: centerId,
        ownerY: centerX,
      })
    );
    // partner edges intentionally not added here; edges are computed later
  });

  // --- CHILDREN (ONE TOP ROW, LEFT TO RIGHT) ---
  const familyTopY = centerY - V_SPACING;
  const childItems = children
    .map((child) => ({
      id: getPersonId(child),
      role: "child" as FamilyRole,
      person: child,
    }))
    .filter((item) => Boolean(item.id));

  const bottomRowCenterOffset = (childItems.length - 1) / 2;

  childItems.forEach((item, index) => {
    const x = centerX + (index - bottomRowCenterOffset) * H_SPACING;
    nodes.push(
      createNode(item.id, x, familyTopY, item.role, item.person, false, {
        ownerId: centerId,
        ownerY: centerX,
      })
    );
  });

  return { nodes, edges };
}


// ------------------ Node Renderer ------------------

function FamilyNodeRenderer({ data }: { data: FamilyNodeData }) {
  const { label, subLabel, isCurrent } = data;

  if (data.isGroupBox) {
    return <div className="h-full w-full rounded-xl border border-slate-200/90 bg-white/55" />;
  }

  const cardStyle = isCurrent
    ? {
        borderColor: '#22c55e',
        boxShadow: `0 0 0 2px #22c55e33`,
      }
    : undefined;

  return (
    <div
      className="rounded-lg bg-white px-3 py-2 shadow-md border border-slate-200 w-auto min-w-[170px] max-w-[170px] overflow-hidden"
      style={cardStyle}
    >
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div className="flex items-start overflow-hidden">
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

type FamilyFlowCache = {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
  currentCenterId: string | null;
  currentCenterName: string;
  expandedIds: string[];
};

let lastFamilyFlowCache: FamilyFlowCache | null = null;

const FamilyFlowInner: React.FC<FamilyFlowProps> = ({ focusId }) => {
  const expandedIdsRef = useRef<Set<string>>(new Set());

  const [nodes, setNodes] = useState<FamilyNode[]>([]);
  const [edges, setEdges] = useState<FamilyEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCenterId, setCurrentCenterId] = useState<string | null>(null);
  const [currentCenterName, setCurrentCenterName] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const lastCenteredRef = useRef<{ id: string; x: number; y: number } | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    if (!lastFamilyFlowCache) return;
    setNodes(lastFamilyFlowCache.nodes);
    setEdges(lastFamilyFlowCache.edges);
    setCurrentCenterId(lastFamilyFlowCache.currentCenterId);
    setCurrentCenterName(lastFamilyFlowCache.currentCenterName);
    expandedIdsRef.current = new Set(lastFamilyFlowCache.expandedIds);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!nodes.length) return;
    lastFamilyFlowCache = {
      nodes,
      edges,
      currentCenterId,
      currentCenterName,
      expandedIds: Array.from(expandedIdsRef.current),
    };
  }, [nodes, edges, currentCenterId, currentCenterName]);

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
                  ownerY: siblingNode.position.x,
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

      const nextNodes = separateGrandparentParentSets(
        reflowParentRows(
          separateGrandparentSiblingSets(
            reflowSiblingPartnerRows(reflowBottomRow(Array.from(mergedById.values())))
          )
        )
      );
      const nextEdges = computeEdgesFromNodes(nextNodes);

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
        node.data.role,
        node.data.role === "parent"
          ? node.position.x >= (node.data.ownerY ?? node.position.x) ? 1 : -1
          : -1
      );

      setNodes((prev) => {
        const previousPositions = new Map(prev.map((n) => [n.id, { ...n.position }]));
        const previousNodeIds = new Set(prev.map((n) => n.id));

        const byId = new Map(prev.map((n) => [n.id, n]));

        branchNodes.forEach((nextNode) => {
          const allowAncestorExpansion = node.data.role === "parent";
          const shouldMergeFromExpansion =
            nextNode.id === node.id ||
            nextNode.data.role === "partner" ||
            nextNode.data.role === "child" ||
            (allowAncestorExpansion && (nextNode.data.role === "parent" || nextNode.data.role === "sibling"));

          if (!shouldMergeFromExpansion) {
            return;
          }

          const nextWithOwner =
            nextNode.data.role === "partner" || nextNode.data.role === "child"
              ? {
                  ...nextNode,
                  data: {
                    ...nextNode.data,
                    ownerId: node.id,
                    ownerY: node.position.x,
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

        const nextNodes = separateGrandparentParentSets(
          reflowParentRows(
            separateGrandparentSiblingSets(
              reflowSiblingPartnerRows(reflowBottomRow(merged, node.id), node.id)
            )
          )
        );

        const stabilizedNodes = nextNodes.map((n) => {
          const prevPos = previousPositions.get(n.id);
          if (!prevPos) return n;

          const isClickedNode = n.id === node.id;
          const isClickedParentPeer =
            node.data.role === "parent" &&
            n.data.role === "parent" &&
            n.data.ownerId === node.data.ownerId &&
            Math.abs(n.position.y - node.position.y) < 0.001;
          const isStableAnchor = isClickedNode || isClickedParentPeer;

          // Keep the clicked node fixed. For parent expansion, also keep its
          // existing parent pair fixed to prevent the opposite parent from shifting.
          if (previousNodeIds.has(n.id) && isStableAnchor) {
            return { ...n, position: prevPos };
          }

          return n;
        });

        const computedEdges = computeEdgesFromNodes(stabilizedNodes);
        setEdges(computedEdges);

        return stabilizedNodes;
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
    if (!lastFamilyFlowCache) {
      loadPerson();
    }
  }, []);

  useEffect(() => {
    if (!reactFlowRef.current || !nodes.length || !currentCenterId) return;

    const selectedNode = nodes.find((n) => n.id === currentCenterId);
    if (!selectedNode) return;

    const centerPos = getNodeCenterPosition(selectedNode, reactFlowRef.current);

    const lastCentered = lastCenteredRef.current;
    if (
      lastCentered &&
      lastCentered.id === selectedNode.id &&
      Math.abs(lastCentered.x - centerPos.x) < 0.5 &&
      Math.abs(lastCentered.y - centerPos.y) < 0.5
    ) {
      return;
    }

    reactFlowRef.current.setCenter(centerPos.x, centerPos.y, {
      zoom: 1,
      duration: 700,
    });

    lastCenteredRef.current = {
      id: selectedNode.id,
      x: centerPos.x,
      y: centerPos.y,
    };
  }, [nodes, currentCenterId]);

  useEffect(() => {
    if (!focusId) return;
    loadPerson(focusId);
  }, [focusId]);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const recenterToNode = useCallback(
    (nodeId: string, duration = 700, forceZoom?: number) => {
      const flow = reactFlowRef.current;
      if (!flow) return;
      const selectedNode = nodes.find((n) => n.id === nodeId);
      if (!selectedNode) return;

      const centerPos = getNodeCenterPosition(selectedNode, flow);
      flow.setCenter(centerPos.x, centerPos.y, {
        zoom: forceZoom ?? flow.getZoom(),
        duration,
      });
    },
    [nodes]
  );

  const recenterOnCurrent = useCallback(() => {
    if (!currentCenterId) return;
    recenterToNode(currentCenterId, 900);
  }, [currentCenterId, recenterToNode]);

  useEffect(() => {
    if (!currentCenterId || !nodes.length) return;
    let frame2: number | null = null;
    let settleTimer: number | null = null;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        recenterToNode(currentCenterId, 700);
      });
      settleTimer = window.setTimeout(() => {
        recenterToNode(currentCenterId, 350);
      }, 180);
    });
    return () => {
      window.cancelAnimationFrame(frame1);
      if (frame2 !== null) window.cancelAnimationFrame(frame2);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
    };
  }, [isFullscreen, currentCenterId, nodes.length, recenterToNode]);

  useEffect(() => {
    if (!currentCenterId) return;
    const flow = reactFlowRef.current;
    if (!flow) return;
    recenterToNode(currentCenterId, 700, 1);
  }, [nodes, currentCenterId, recenterToNode]);

const onNodeClick = useCallback(
    (_: unknown, node: Node<FamilyNodeData>) => {
      if (node.data.isGroupBox) return;
      setCurrentCenterName(node.data.label || "Unknown");
      setCurrentCenterId(node.id);

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
    <div className={isFullscreen ? "fixed inset-0 z-40 flex min-h-0 flex-col bg-white" : "grow min-h-0 flex flex-col"}>
      <div className="flex items-center justify-between border border-slate-200 bg-white px-3 py-2 text-sm">
        <div className="text-slate-700">
          Currently viewing: <span className="font-semibold text-slate-900">{currentCenterName || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/35">
          <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-lg text-slate-700">
            {loading ? "Loading family…" : error}
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={(instance) => {
          reactFlowRef.current = instance;
        }}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
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
          nodeStrokeColor="#f97316"
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
