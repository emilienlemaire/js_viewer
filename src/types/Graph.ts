import type * as PIXI from "pixi.js";
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
  text: PIXI.Text;
  gfx: PIXI.Graphics;
  children?: Node[];
  target_y?: number;
  graph: Graph;
}

export interface Edge extends CubicleEdge {
  source: Node;
  target: Node;
}

export interface State {
  node: Node | null;
  old: Node | null;
  parents: Node[] | null;
  oldParents: Node[] | null;
  path: Edge[] | null;
}

export interface Payload {
  node: Node | null;
  parents: Node[] | null;
  path: Edge[] | null;
}

export interface Action {
  type: string;
  payload: Payload;
}
