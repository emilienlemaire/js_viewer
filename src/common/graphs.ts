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
import type { Edge as EdgeType, Graph as GraphType} from "graphlib";
import type { Edge as CubicleEdge } from "../types/CubicleGraph";
import type { HierarchyGraph, Node, Edge } from "../types/Graph";
import type { Edge as StoreEdge } from "../types/Store";
import type { HierarchyPointNode } from "d3";

import {
  Text,
  Graphics,
} from "pixi.js";

/**
 * The graph class that is used to draw the graph.
 *
 * @remarks
 * The graph generated by this class is referred as `the graph`. The one built by parsing the
 *      .dot file is referred as `the original graph`.
 */
export class Graph {

  readonly graph: GraphType;

  readonly root: Node;

  readonly nodes: Node[] = [];

  readonly edges: Edge[];

  private _nodeMap = new Map<string, Node>();

  private _edgeMap = new Map<StoreEdge, Edge>();

  private _topLevelX = 50;

  private _parents = new Map<string, Node[]>();

  private _sourceMap = new Map<string, Edge[]>();

  private _targetMap = new Map<string, Edge[]>();


  /**
  * Creates a graph.
   * @param {HierarchyPointNode<HierarchyGraph>} root - The d3 representation of the graph.
   * @param {GraphType} nodes - The graphlib reprensentation of the graph.
   * @param {EdgeType[]} edges - An array of edges in graphlib representation.
  */
  constructor(
    root: HierarchyPointNode<HierarchyGraph>,
    nodes: GraphType,
    edges: EdgeType[]
  ) {
    // We save the graphlib representation for future usage.
    this.graph = nodes;

    // WE get our custom node reprensentation of the root and then of all the descendants.
    this.root = this._toNode(root);
    root.descendants().forEach((n) => {
      this._toNode(n);
    });
    // We get the custom edges representations of the edges.
    this.edges = edges.reduce((acc: Edge[], e: EdgeType): Edge[] => {
      const edge = this._toEdge(e);
      if ( edge ) {
        acc.push(edge);
        return acc;
      }
      return acc;
    }, []);

    // We set our nodes array from the map we just filled.
    this.nodes = Array.from(this._nodeMap.values());
  }

  /**
   * Create a graph node from a hierarchy node.
   *
   * @param {HierarchyPointNode<HierarchyGraph>} node - The hierarchy node that needs to be transformed
   * @returns {Node} The transformed node.
   */
  private _toNode(node: HierarchyPointNode<HierarchyGraph>): Node {
    // If we already have this node in the graph no need to add it again.
    if (!this._nodeMap.has(node.data.name)) {
      // We create the new node object
      const newNode = {
        name: node.data.name,
        label: node.data.data.label as string,
        color: node.data.data.color,
        x: node.x,
        y: node.y,
        text: new Text(node.data.data.label as string),
        gfx: new Graphics(),
        children: (node.children || []).map((n) => this._toNode(n)),
        graph: this,
      };
      // We add it to the node map.
      this._nodeMap.set(node.data.name, newNode);
      return newNode;
    }
    return <Node> this._nodeMap.get(node.data.name);
  }

  /**
   * Create a graph edge from basic edge type.
   *
   * @param {EdgeType} edge - The edge to be transformed
   * @returns {Edge | undefined} The transformed edge.
   */
  private _toEdge(edge: EdgeType): Edge | undefined {
    const e = this.graph.edge(edge);

    // If the nodes connected by this edge are not in the graph, we don't add it.
    if (!this._nodeMap.has(edge.w) || !this._nodeMap.has(edge.v)) {
      return;
    }

    // We fill the parents map of the target node of the new edge.
    this._parents.set(edge.w, (() => {
      const actual_parents = this._parents.get(edge.w) || [];
      const new_parent = <Node> this._nodeMap.get(edge.v);
      return [...actual_parents, new_parent];
    })());

    // We get the source and target nodes from the maps
    const source = <Node> this._nodeMap.get(edge.v);
    const target = <Node> this._nodeMap.get(edge.w);

    const newEdge = {
      source,
      target,
      ...e,
    };

    // We had the edge to the source map of the source node
    const actual_source = <Edge[]> this._sourceMap.get(source.name) || [];
    this._sourceMap.set(source.name, [...actual_source, newEdge]);

    // We had the edge to the target map of the target node
    const actual_target = <Edge[]> this._targetMap.get(target.name) || [];
    this._targetMap.set(target.name, [...actual_target, newEdge]);

    const edgeLabel = {
      source: edge.v,
      target: edge.w,
    };

    if (!this._edgeMap.has(edgeLabel)) {
      this._edgeMap.set(edgeLabel, newEdge);
    }

    return newEdge;
  }

  /**
   * Create a graph edge that is subsumed.
   *
   * @param {EdgeType} edge - The basic edge to be transformed.
   * @param {CubcicleEdge} data - The data of the edge to be transformed.
   * @returns {Edge} A new graph edge that is subsuned, with all the data.
   */
  private _toSubsumedEdge(edge: EdgeType, data: CubicleEdge): Edge {
    const source = <Node> this._nodeMap.get(edge.v);
    const target = <Node> this._nodeMap.get(edge.w);

    return {
      source,
      target,
      ...data,
    };
  }

  /**
   * Look for the node named n in the graph.
   *
   * @param {string} n - The name of the node we are looking for.
   * @returns {Node | null} null if the node is not part of the graph, the node itself otherwise.
   */
  node(n: string): Node | null {
    return (this._nodeMap.has(n))
    ? <Node> this._nodeMap.get(n)
    : null;
  }

  /**
   * Adds a node that is contained in the original graph.
   *
   * @param {string} node - The name of the node to be added.
   * @returns {Node|undefined} The new node if it can be added
   */
  addGraphLibNode(node: string): Node | undefined {
    if (!this._nodeMap.has(node)) {
      const graphLibNode = this.graph.node(node);
      if (graphLibNode.label) return;

      const newNode: Node = {
        name: node,
        label: `Invariant ${node}`,
        color: "gray",
        x: this._topLevelX,
        y: -20,
        text: new Text(`Invariant ${node}`),
        gfx: new Graphics(),
        graph: this,
      };

      this._nodeMap.set(node, newNode);
      this.nodes.push(newNode);

      return newNode;
    }
    return this._nodeMap.get(node);
  }

  /**
   * Look for the ancestors of the node.
   *
   * @param {Node} node - The node we seek the parets of.
   * @param {Node[]} parents - The parents we already know.
   * @returns {Node[]} An array of the ancestors of the node.
   */
  private _getAncestors(node: Node, parents: Node[]): Node[] {
    if (this._parents.has(node.name)) {
      const newParents = <Node[]> this._parents.get(node.name);
      const parentArrays = <Node[]> newParents.flatMap((n) => {
        return this._getAncestors(n, newParents);
      });
      return [...parents, ...parentArrays];
    }
    return [node];
  }

  /**
   * Get the ancestors of the node.
   *
   * @param {Node} node - The node we want to have the ancestors of.
   * @returns {Node[]} An array of nodes that are ancestors of the node or an emptay array if the node
   *    does not have any ancestors.
   */
  ancestors(node: Node): Node[] {
    return this._getAncestors(node, []);
  }

  /**
   * Get the edges that targets the nodes.
   *
   * @param {Nodes[]} nodes - The nodes we want the edges that target them.
   * @returns {Edge[]} An array of edges or an empty array if none of the nodes in argument are
   *    targeted by any edges.
   */
  targetEdges(nodes: Node[]): Edge[] {
    return nodes.flatMap((n) => {
      return (this._targetMap.has(n.name))
        ? this._targetMap.get(n.name) as Edge[]
        : [];
    });

  }

  /**
   * Add a subsumed edge to the graph.
   *
   * @param edge - A tuple containing the original graph edge and the edge data.
   * @returns {Edge} The subsumed edge represented in our custom format.
   */
  addSubsumedEdge(edge: [EdgeType, CubicleEdge]): Edge {
    const newEdge = this._toSubsumedEdge(edge[0], edge[1]);
    this.edges.push(newEdge);
    return newEdge;
  }

  /**
   * Return an array of edges from the selectionState type format to the graph edge type
   *
   * @param {StoreEdge[]} edges - The edeges we are looking to get back.
   * @returns {Edge[]} An array of edges or an empty array if no edge are in the graph.
   */
  getEdges(edges: StoreEdge[]): Edge[] {
    return edges.reduce((acc: Edge[], e: StoreEdge): Edge[] => {
      const edge = this._edgeMap.get(e);
      if (edge) {
        acc.push(edge);
        return acc;
      }
      return acc;
    }, []);
  }
}

/**
 * This generates recursively a hierarchy graph from the original graph
 *
 * @param {GraphType} graph - The original graph we want to make hierachical.
 * @param {string} node - The current node we want to transofrm.
 * @returns {HierarchyGraph} A hierarchy graph from the original graph.
 */
function makeHierarchyGraph(graph: GraphType, node: string): HierarchyGraph {
  const n = graph.node(node);
  const g: HierarchyGraph = {
    name: node,
    data: n,
  };
  const succ: Array<string> = (graph.successors(node) instanceof Array)
    ? <string[]>(graph.successors(node))
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
 * @returns {HierarchyGraph} A new hierachical graph that is compatible with d3js.hierarchy algorithms.
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
 * @returns {HierarchyGraph} A new hierarchy graph with no subsumed nodes.
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

