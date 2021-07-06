import type { Graph, Edge as GraphLibEdge } from "graphlib";
import type { Edge as CubicleEdge } from "./CubicleGraph";
import type { HierarchyGraph, Node, Edge } from "./Graph";
import type { HierarchyPointNode } from "d3";

import store from "../store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface DotState {
  graph: string;
}

export interface SelectionState {
  node: Node | null;
  oldNode: Node | null;
  parents: Node[] | null;
  oldParents: Node[] | null;
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
}

export type OptionsState = Array<OptionsInfo>;
