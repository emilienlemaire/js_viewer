import type { Graph, Edge as GraphLibEdge } from "graphlib";
import type { Edge as CubicleEdge } from "./CubicleGraph";
import type { HierarchyGraph } from "./Graph";
import type { HierarchyPointNode } from "d3";
import type { Node } from "./Graph";

import store from "../store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface DotState {
  graph: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface SelectionState {
  node: string | null;
  oldNode: string | null;
  parents: string[] | null;
  oldParents: string[] | null;
  path: Edge[] | null;
}

export interface GraphInfo {
  graphLibGraph: Graph;
  d3Tree: HierarchyPointNode<HierarchyGraph>;
  subsumedEdges: Array<[GraphLibEdge, CubicleEdge]>;
  hierarchyGraph: HierarchyGraph;
}

export type GraphState = GraphInfo | null;

export interface OptionsInfo {
  showAllNodes: boolean;
  showApproxNodes: boolean;
  showInvariantNodes: boolean;
  showSubsumedNodes: boolean;
  showUnsafeNodes: boolean;
  showErrorNodes: boolean;
  hoveredNode: Node | null;
}

export type OptionsState = Array<OptionsInfo>;

export interface ContextMenuState {
  index: number | null;
  x: number | null;
  y: number | null;
}
