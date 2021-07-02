import type { Edge } from "graphlib";
import type { Edge as CubicleEdge } from "../types/CubicleGraph";
import type { HierarchyGraph, Node } from "../types/Graph";
import type { PIXIContext } from "../types/Context";
import type { GraphInfo } from "../types/Store";

import dot from "graphlib-dot";
import { getD3Hierachy } from "./graphs";
import { hierarchy, tree as d3Tree } from "d3";
import * as PIXI from "pixi.js";
import { drawNode, colorToHex, drawHover } from "./draw";

export function initGraph(graphviz: string): GraphInfo {
  const graph = dot.read(graphviz);

  const dechargedEdges: Array<[Edge, CubicleEdge]> = [];
  graph.edges().forEach((e) => {
    const edge = graph.edge(e);
    if (edge.subsume) {
      graph.removeEdge(e);
      dechargedEdges.push([e, edge]);
    }
  });

  const root = graph.filterNodes((n) => {
    const node = graph.node(n);
    console.log(node.orig);
    return (node.orig && node.orig === "true");
  });

  const d3HierarchyGraph = hierarchy(getD3Hierachy(graph, root));
  const nodeSize: [number, number] = (d3HierarchyGraph.descendants.length > 200)
    ? [300, 300]
    : [50, 75];
  const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(d3HierarchyGraph);

  return {
    graphLibGraph: graph,
    d3Tree: tree,
    dechargedEdges,
  };
}

export function initPIXI(
  width: number,
  height: number,
  onBackgroundClick:(ev: PIXI.InteractionEvent) => void
): PIXIContext {
  const superStage = new PIXI.Container();
  const stage = new PIXI.Container();

  const background = new PIXI.Sprite(PIXI.Texture.WHITE);
  background.width = width;
  background.height = height;
  // bg.tint = 0xff0000;
  background.interactive = true;
  let moved = false;
  background.on("mousedown", () => {
    moved = false;
  });
  background.on("mousemove", () => {
    moved = true;
  });
  background.on("mouseup", (ev) => {
    if (!moved) {
      onBackgroundClick(ev);
    }
    moved = false;
  });
  superStage.addChild(background);
  superStage.addChild(stage);

  const links = new PIXI.Graphics();

  stage.addChild(links);

  const renderer = PIXI.autoDetectRenderer({
    width,
    height,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });

  const ticker = new PIXI.Ticker();

  ticker.autoStart = false;

  return {
    superStage,
    stage,
    renderer,
    ticker,
    links,
  };
}

export function initNodeGraphics(
  stage: PIXI.Container,
  superStage: PIXI.Container,
  node: Node,
  onClick: (n: Node) => void,
  onHover: (n: Node) => void,
  onOut: (n: Node) => void
): void {
  node.label = node.label.replaceAll("\\n", "\n");
  node.text = new PIXI.Text(node.label, {fontSize: 2.5});
  node.text.resolution = 16;

  const bounds = node.text.getLocalBounds(new PIXI.Rectangle());
  const isBigGraph = (node.graph.nodes.length > 200);

  node.text.anchor.set(1, 1);
  node.text.rotation = Math.PI;
  drawNode(node.gfx, bounds, colorToHex(node.color));

  node.text.position = new PIXI.ObservablePoint(
    () => null,
    null,
    -bounds.width / 2,
    -bounds.height / 2
  );
  node.target_y = isBigGraph ? node.y : node.y - (bounds.height / 2);
  node.x += (bounds.width / 2);
  node.gfx.interactive = true;
  node.gfx.on("click", () => {
    onClick(node);
  });
  let hover: PIXI.Graphics | null = null;
  node.gfx.on("mouseover", () => {
    hover = drawHover(node, superStage);
    superStage.addChild(hover);
    onHover(node);
  });
  node.gfx.on("mouseout", () => {
    hover && superStage.removeChild(hover);
    onOut(node);
  });
  node.gfx.addChild(node.text);
  node.gfx.position = new PIXI.ObservablePoint(() => null, null, node.x, node.y);
  if (isBigGraph) {
    node.gfx.rotation -= (1 / 2) * Math.PI;
  }
  stage.addChild(node.gfx);
}
