import type { FamilyPerson, BasicPerson } from "../types/family";
import type { TreeNode } from "../types/tree";

function personToNode(p: BasicPerson, relation?: string): TreeNode {
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || p.fullName || "Unknown";

  return {
    name,
    rawId: p.id,
    attributes: {
      birth: p.birthDate || "unknown",
      relation: relation || "",
    },
  };
}

export function buildTree(center: FamilyPerson) {
  const parents = (center.parents || []).map(p => personToNode(p, "Parent"));
  const siblings = (center.siblings || []).map(p => personToNode(p, "Sibling"));
  const partners = (center.relationships || []).map(p => personToNode(p, "Partner"));
  const children = (center.children || []).map(p => personToNode(p, "Child"));

  const centerNode: TreeNode = {
    name: `${center.firstName} ${center.lastName}`,
    rawId: center.id,
    attributes: { relation: "You" },
    children: [],
  };

  // RIGHT side
  const rightSideGroups: TreeNode[] = [];

  if (siblings.length) {
    rightSideGroups.push({
      name: "Siblings",
      rawId: "siblings-group",
      children: siblings,
    });
  }

  if (partners.length) {
    rightSideGroups.push({
      name: "Partners",
      rawId: "partners-group",
      children: partners,
    });
  }

  if (children.length) {
    rightSideGroups.push({
      name: "Children",
      rawId: "children-group",
      children,
    });
  }

  // Attach right side to center
  centerNode.children = rightSideGroups;

  // LEFT side container for parents
  const leftSide: TreeNode = {
    name: "",
    rawId: "left-container",
    isGhost: true,
    children: parents.length
      ? [{
          name: "Parents",
          rawId: "parents-group",
          children: parents,
        }]
      : []
  };

  return centerNode;
}
