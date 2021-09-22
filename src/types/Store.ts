/**
 * src/types/Store.ts
 * Copyright (c) 2021 Emilien Lemaire <emilien.lem@icloud.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Graph, Edge as GraphLibEdge } from "graphlib";
import type { Edge as CubicleEdge } from "./CubicleGraph";
import type { HierarchyGraph } from "./Graph";
import type { HierarchyPointNode } from "d3";
import type { Node } from "./Graph";

import store from "../store";

/**
 * RootState. The global state type.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
/**
 * DotState.
 */
export interface DotState {
  /**
   * @type {string} The string representation of the full graph (in the graphviz format).
   */
  graph: string;
}

/**
 * Edge.
 */
export interface Edge {
  /**
   * @type {string} The name of the source node of the edge.
   */
  source: string;
  /**
   * @type {string} The name of target node of the edge.
   */
  target: string;
}

/**
 * SelectionState.
 */
export interface SelectionState {
  /**
   * @type {string | null} The name of the selected node. If null no node is selected.
   */
  node: string | null;
  /**
   * @type {string | null} The name of the previously selected ndoe. If null there was no previous
   *  selection
   */
  oldNode: string | null;
  /**
   * @type {string[] | null} The parents of the selected node. null when there are no parents or no
   *  node slected.
   */
  parents: string[] | null;
  /**
   * @type {string[] | null} The parents of the previously selected node. null when there are no
   *  previous parents or no previous selection.
   */
  oldParents: string[] | null;
  /**
   * @type {Edge[] | null} The path from the selected node to the root node. null when there are
   *  no slection.
   */
  path: Edge[] | null;
}

/**
 * GraphInfo.
 */
export interface GraphInfo {
  /**
   * @type {Graph} The graph represented with the grpahlib type.
   */
  graphLibGraph: Graph;
  /**
   * @type {HierarchyPointNode<HierarchyGraph>} The graph reprenseted as a d3 hierarchy graph.
   */
  d3Tree: HierarchyPointNode<HierarchyGraph>;
  /**
   * @type {Array<[GraphLibEdge, CubicleEdge]>} The subsumed edges deleted for the layout calculation.
   */
  subsumedEdges: Array<[GraphLibEdge, CubicleEdge]>;
  /**
   * @type {HierarchyGraph} The custom hierarchy representation of the graph.
   */
  hierarchyGraph: HierarchyGraph;
}

/**
 * GraphState.
 */
export type GraphState = GraphInfo | null;

/**
 * OptionsInfo.
 */
export interface OptionsInfo {
  /**
   * @type {boolean}
   */
  showAllNodes: boolean;
  /**
   * @type {boolean}
   */
  showApproxNodes: boolean;
  /**
   * @type {boolean}
   */
  showInvariantNodes: boolean;
  /**
   * @type {boolean}
   */
  showSubsumedNodes: boolean;
  /**
   * @type {boolean}
   */
  showUnsafeNodes: boolean;
  /**
   * @type {boolean}
   */
  showErrorNodes: boolean;
  /**
   * @type {Node | null}
   */
  hoveredNode: Node | null;
}

/**
 * OptionsState.
 */
export type OptionsState = Array<OptionsInfo>;

/**
 * ContextMenuState.
 */
export interface ContextMenuState {
  /**
   * @type {number | null}
   */
  index: number | null;
  /**
   * @type {number | null}
   */
  x: number | null;
  /**
   * @type {number | null}
   */
  y: number | null;
}

/**
 * HoveredNodePayload.
 */
export interface HoveredNodePayload {
  /**
   * @type {number}
   */
  index: number;
  /**
   * @type {Node | null}
   */
  node: Node | null;
}
