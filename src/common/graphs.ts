import type { Graph as GraphType, Edge as EdgeType } from "graphlib";
import * as PIXI from "pixi.js";
import type * as d3Types from "d3";

export interface HierarchyGraph {
  name: string;
  data: any;
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

export interface Edge {
  source: Node;
  target: Node;
  label?: string;
  color: string;
  style?: string;
}

export class Graph {
  graph: GraphType;

  root: Node;

  nodes: Node[] = [];

  edges: Edge[];

  private _nodeMap = new Map<string, Node>();

  private _topLevelX = 50;

  private _parents = new Map<string, Node[]>();

  private _sourceMap = new Map<string, Edge[]>();

  private _targetMap = new Map<string, Edge[]>();


  constructor(root: d3Types.HierarchyPointNode<any>, nodes: GraphType, edges: EdgeType[]) {
    this.graph = nodes;
    this.root = this._toNode(root);
    root.descendants().forEach((n) => {
        this._toNode(n);
    });
    this.edges = edges.map((e): Edge => {
      return this._toEdge(e);
    });
    this.nodes = Array.from(this._nodeMap.values());
  }

  private _toNode(node: d3Types.HierarchyPointNode<any>): Node {
    if (!this._nodeMap.has(node.data.name)) {
      const newNode = {
        name: node.data.name,
        label: node.data.data.label,
        color: node.data.data.color,
        x: node.x,
        y: node.y,
        text: new PIXI.Text(node.data.label),
        gfx: new PIXI.Graphics(),
        children: (node.children || []).map((n) => this._toNode(n)),
        graph: this
      };
      this._nodeMap.set(node.data.name, newNode);
      return newNode;
    }
    return <Node> this._nodeMap.get(node.data.name);
  }

  private _toEdge(edge: EdgeType): Edge {
    const e = this.graph.edge(edge);
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
      label: e.label,
      color: e.color,
      style: e.style || null
    };

    const actual_source = <Edge[]> this._sourceMap.get(source.name) || [];
    this._sourceMap.set(source.name, [...actual_source, newEdge]);

    const actual_target = <Edge[]> this._targetMap.get(target.name) || [];
    this._targetMap.set(target.name, [...actual_target, newEdge]);

    return newEdge;
  }

  private _toEdgeDecharged(edge: EdgeType, data: any): Edge {
    const source = <Node> this._nodeMap.get(edge.v);
    const target = <Node> this._nodeMap.get(edge.w);

    return {
      source,
      target,
      color: data.color,
      style: data.style || null
    }
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
        text: new PIXI.Text(`Invariant ${node}`),
        gfx: new PIXI.Graphics(),
        graph: this
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
        ? <Edge[]> this._targetMap.get(n.name)
        : [];
    });

  }

  addDechargedEdge(edge: any): void {
    this.edges.push(this._toEdgeDecharged(edge[0], edge[1]));
  }
}

export const getD3Hierachy = (graph: GraphType, root: GraphType): HierarchyGraph => {
  if (root.nodes().length != 1) {
    throw new Error("The root graph must be exactly one element long.");
  }

  //eslint-disable-next-line
  function makeGraph(graph: GraphType, node: string) {
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

  return makeGraph(graph, root.nodes()[0]);
}
