export interface TreeNode {
  name: string;
  attributes?: Record<string, string>;
  children?: TreeNode[];
  rawId: string; // keep your DB id for click-to-recenter
  isGhost?: boolean;
}
