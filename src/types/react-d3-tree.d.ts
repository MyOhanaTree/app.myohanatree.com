declare module "react-d3-tree" {
  import * as React from "react";

  export interface RawNodeDatum {
    name: string;
    attributes?: Record<string, string>;
    children?: RawNodeDatum[];
    rawId?: string;
  }

  export interface TreeProps {
    data: RawNodeDatum | RawNodeDatum[];
    translate?: { x: number; y: number };
    orientation?: "horizontal" | "vertical";
    nodeSize?: { x: number; y: number };
    separation?: { siblings: number; nonSiblings: number };
    zoom?: number;
    collapsible?: boolean;
    enableLegacyTransitions?: boolean;
    renderCustomNodeElement?: (props: any) => React.ReactNode;
  }

  const Tree: React.FC<TreeProps>;

  export default Tree;
}
