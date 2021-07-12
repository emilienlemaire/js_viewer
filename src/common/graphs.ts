import type { Edge as EdgeType } from "graphlib";
import type { Edge as CubicleEdge } from "../types/CubicleGraph";
import type { HierarchyGraph, Node, Edge } from "../types/Graph";
import type { Edge as StoreEdge } from "../types/Store";
import type { HierarchyPointNode } from "d3";

import {
  Text,
  Graphics,
} from "pixi.js";
import { Graph as GraphType } from "graphlib";

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


  constructor(
    root: HierarchyPointNode<HierarchyGraph>,
    nodes: GraphType,
    edges: EdgeType[]
  ) {
    this.graph = nodes;
    this.root = this._toNode(root);
    root.descendants().forEach((n) => {
      this._toNode(n);
    });
    this.edges = edges.reduce((acc: Edge[], e: EdgeType): Edge[] => {
      const edge = this._toEdge(e);
      if ( edge ) {
        acc.push(edge);
        return acc;
      }
      return acc;
    }, []);
    this.nodes = Array.from(this._nodeMap.values());
  }

  private _toNode(node: HierarchyPointNode<HierarchyGraph>): Node {
    if (!this._nodeMap.has(node.data.name)) {
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
      this._nodeMap.set(node.data.name, newNode);
      return newNode;
    }
    return <Node> this._nodeMap.get(node.data.name);
  }

  private _toEdge(edge: EdgeType): Edge | undefined {
    const e = this.graph.edge(edge);
    if (!this._nodeMap.has(edge.w) || !this._nodeMap.has(edge.v)) {
      return;
    }

    this._parents.set(edge.w, (() => {
      const actual_parents = this._parents.get(edge.w) || [];
      const new_parent = <Node> this._nodeMap.get(edge.v);
      return [...actual_parents, new_parent];
    })());

    const source = <Node> this._nodeMap.get(edge.v);
    const target = <Node> this._nodeMap.get(edge.w);

    const newEdge = {
      source,
      target,
      ...e,
    };

    const actual_source = <Edge[]> this._sourceMap.get(source.name) || [];
    this._sourceMap.set(source.name, [...actual_source, newEdge]);

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

  private _toEdgeDecharged(edge: EdgeType, data: CubicleEdge): Edge {
    const source = <Node> this._nodeMap.get(edge.v);
    const target = <Node> this._nodeMap.get(edge.w);

    return {
      source,
      target,
      ...data,
    };
  }

  node(n: string): Node | null {
    return (this._nodeMap.has(n))
    ? <Node> this._nodeMap.get(n)
    : null;
  }

  addGraphLibNode(node: string): void {
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
    }
  }

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

  ancestors(node: Node): Node[] {
    return this._getAncestors(node, []);
  }

  targetEdges(nodes: Node[]): Edge[] {
    return nodes.flatMap((n) => {
      return (this._targetMap.has(n.name))
        ? this._targetMap.get(n.name) as Edge[]
        : [];
    });

  }

  addDechargedEdge(edge: [EdgeType, CubicleEdge]): void {
    this.edges.push(this._toEdgeDecharged(edge[0], edge[1]));
  }

  getEdges(arr: StoreEdge[]): Edge[] {
    return arr.reduce((acc: Edge[], e: StoreEdge): Edge[] => {
      const edge = this._edgeMap.get(e);
      if (edge) {
        acc.push(edge);
        return acc;
      }
      return acc;
    }, []);
  }
}

function makeGraph(graph: GraphType, node: string): HierarchyGraph {
  const n = graph.node(node);
  const g: HierarchyGraph = {
    name: node,
    data: n,
  };
  const succ: Array<string> = (graph.successors(node) instanceof Array)
    ? <string[]>(graph.successors(node))
    : [];
  g.children = succ.map((child) => {
    return makeGraph(graph, child);
  });

  return g;
}

export function getD3Hierachy(graph: GraphType, root: GraphType): HierarchyGraph {
  if (root.nodes().length != 1) {
    throw new Error("The root graph must be exactly one element long. It contains "
      + root.nodes().length + " elements.");
  }

  return makeGraph(graph, root.nodes()[0]);
}

export function getGraphNoSubsumed(graph: HierarchyGraph): HierarchyGraph {

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

