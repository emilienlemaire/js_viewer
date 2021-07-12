import type { Text, Graphics } from "../common/pixi";
import type { Node as CubicleNode, Edge as CubicleEdge } from "./CubicleGraph";
import type { Graph } from "../common/graphs";

export interface HierarchyGraph {
  name: string;
  data: CubicleNode;
  children?: HierarchyGraph[]
}

export interface Node {
  name: string;
  label: string;
  color: string;
  x: number;
  y: number;
  text: Text;
  gfx: Graphics;
  children?: Node[];
  target_y?: number;
  graph: Graph;
}

export interface Edge extends CubicleEdge {
  source: Node;
  target: Node;
}

