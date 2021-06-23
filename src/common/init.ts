import type { Edge } from "graphlib";
import type { Edge as CubicleEdge } from "../types/CubicleGraph";
import type { HierarchyGraph, Node } from "../types/Graph";
import type { PIXIContext } from "../types/Context";

import dot from "graphlib-dot";
import { getD3Hierachy, Graph } from "./graphs";
import { hierarchy, tree as d3Tree } from "d3";
import * as PIXI from "pixi.js";
import { drawNode, colorToHex, drawHover } from "./draw";

export function initGraph(graphviz: string): Graph {
  const graph = dot.read(graphviz);

  const dechargedEdge: Array<[Edge, CubicleEdge]> = [];
  graph.edges().forEach((e) => {
    const edge = graph.edge(e);
    if (edge.subsume) {
      graph.removeEdge(e);
      dechargedEdge.push([e, edge]);
    }
  });

  const root = graph.filterNodes((n) => {
    const node = graph.node(n);
    console.log(node.orig);
    return (node.orig && node.orig === "true");
  });

  const d3HierarchyGraph = hierarchy(getD3Hierachy(graph, root));
  const tree = d3Tree<HierarchyGraph>().nodeSize([25, 75])(d3HierarchyGraph);

  const customGraph = new Graph(tree, graph, graph.edges());

  graph.nodes().forEach((n) => {
    if (!customGraph.node(n)) {
      customGraph.addGraphLibNode(n);
    }
  });

  dechargedEdge.forEach((edge: [Edge, CubicleEdge]) => {
    customGraph.addDechargedEdge(edge);
  });

  return customGraph;
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
    resolution: window.devicePixelRatio || 1
  });

  const ticker = new PIXI.Ticker();

  ticker.autoStart = false;

  return {
    superStage,
    stage,
    renderer,
    ticker,
    links
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

  node.text.anchor.set(1, 1);
  node.text.rotation = Math.PI;
  drawNode(node.gfx, bounds, colorToHex(node.color));

  node.text.position = new PIXI.ObservablePoint(
    () => null,
    null,
    -bounds.width / 2,
    -bounds.height / 2
  );
  node.target_y = node.y - (bounds.height / 2);
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
  stage.addChild(node.gfx);
}
