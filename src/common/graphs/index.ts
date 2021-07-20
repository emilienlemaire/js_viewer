/**
 * src/common/graphs.ts
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
/** @module common/graphs */
import type { Graph as GraphType} from "graphlib";
import type { HierarchyGraph } from "../../types/Graph";

/**
 * This generates recursively a hierarchy graph from the original graph
 *
 * @param {GraphType} graph - The original graph we want to make hierachical.
 * @param {string} node - The current node we want to transofrm.
 * @return {HierarchyGraph} A hierarchy graph from the original graph.
 */
function makeHierarchyGraph(graph: GraphType, node: string): HierarchyGraph {
  const n = graph.node(node);
  const g: HierarchyGraph = {
    name: node,
    data: n,
  };
  const succ: Array<string> = (graph.successors(node) instanceof Array)
    ? (graph.successors(node) as string[])
    : [];
  g.children = succ.map((child) => {
    return makeHierarchyGraph(graph, child);
  });

  return g;
}

/**
 * Make a new hierarachy graph that is compatible to d3js/hierarchy.
 *
 * @param {GraphType} graph - The original graph
 * @param {GraphType} root - The root of the original graph.
 * @return {HierarchyGraph} A new hierachical graph that is compatible with d3js.hierarchy algorithms.
 */
export function getD3Hierachy(graph: GraphType, root: GraphType): HierarchyGraph {
  if (root.nodes().length != 1) {
    throw new Error("The root graph must be exactly one element long. It contains "
      + root.nodes().length + " elements.");
  }

  return makeHierarchyGraph(graph, root.nodes()[0]);
}

/**
 * This removes all subsumed nodes from a hierarchy graph.
 *
 * @param {HierarchyGraph} graph - The graph to be modified.
 * @return {HierarchyGraph} A new hierarchy graph with no subsumed nodes.
 */
export function getGraphNoSubsumed(graph: HierarchyGraph): HierarchyGraph {
  // We get the not subsumed children of the graph and recursively create the graph
  // with no subsumed nodes.
  const children = (graph.children && !graph.data.subsumed)
    ? graph.children.filter((child) => {
      if(child.data.subsumed) {
        return false;
      }
      return true;
    }).map((child) => {
      return getGraphNoSubsumed(child);
    })
    : undefined;

  const newGraph: HierarchyGraph = {
    children: children,
    data: graph.data,
    name: graph.name,
  };

  return newGraph;
}

export { Graph } from "./Graph";

