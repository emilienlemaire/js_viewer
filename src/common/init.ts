/**
 * src/common/init.ts
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
import type { Edge } from "graphlib";
import type { Edge as CubicleEdge } from "../types/CubicleGraph";
import type { HierarchyGraph, Node } from "../types/Graph";
import type { PIXIContext } from "../types/Context";
import type { GraphInfo } from "../types/Store";

import dot from "graphlib-dot";
import { getD3Hierachy } from "./graphs";
import { hierarchy, tree as d3Tree } from "d3";
import { drawNode, colorToHex, drawHover } from "./draw";
import { onTicked } from "./eventHandlers";
import {
  InteractionEvent,
  Container,
  Sprite,
  Texture,
  Graphics,
  Ticker,
  Text,
  Rectangle,
  ObservablePoint,
  autoDetectRenderer,
} from "pixi.js";

/**
 * Initializes the graph for PIXI to be able to display it and for the state to be able to manipulate
 * it.
 *
 * @param {string} graphviz - The graphviz string that describes the entire graph. Extracted from
 *      a .dot file.
 * @returns {GraphInfo} A graph that the states can manipulate.
 */
export function initGraph(graphviz: string): GraphInfo {
  // We get the graphlib graph from the string
  const graph = dot.read(graphviz);

  // We remove the subsumed edges to be able to get the graph layout without them, they will be
  // added again once the graph layout is calculated
  const subsumedEdges: Array<[Edge, CubicleEdge]> = [];
  graph.edges().forEach((e) => {
    const edge = graph.edge(e);
    if (edge.subsume) {
      graph.removeEdge(e);
      subsumedEdges.push([e, edge]);
    }
  });

  // We get the original node.
  const root = graph.filterNodes((n) => {
    const node = graph.node(n);
    return (node.orig && node.orig === "true");
  });

  // We build a {@link getD3Hierachy | hierarchy} graph.
  const hierarchyGraph = getD3Hierachy(graph, root);
  // Transform our custom hierarchy graph into a {@link d3#hierarchy | d3 hierarchy} graph.
  const d3HierarchyGraph = hierarchy(hierarchyGraph);
  // We calculate the layout of the graph now. Each node will have the nodeSize size, which depends
  // on the size of the graph.
  const nodeSize: [number, number] = (d3HierarchyGraph.descendants.length > 200)
    ? [300, 300]
    : [50, 75];
  const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(d3HierarchyGraph);

  return {
    graphLibGraph: graph,
    d3Tree: tree,
    subsumedEdges,
    hierarchyGraph,
  };
}
/**
 * This callback handles a click on the background.
 * @callback backgroundClickCallback
 * @param {InteractionEvent} ev - The background click event.
 * @returns {void}
 */

/**
 * Initializes all the needed objects for PIXI.js.
 *
 * @param {number} width - The width of the graph view (might be the entire window or just a split)
 * @param {number} height - The height of the graph view.
 * @param {backgroundClickCallback} onBackgroundClick - Event handler for background click.
 * @returns {PIXIContext} The entire PIXIContext for a graph split: {@link PIXIContext}.
 */
export function initPIXI(
  width: number,
  height: number,
  onBackgroundClick: (ev: InteractionEvent) => void
): PIXIContext {
  // We create the grpaics' containers.
  const superStage = new Container();
  const stage = new Container();

  // We had a transparent background to enable background click.
  const background = new Sprite(Texture.WHITE);
  background.width = width;
  background.height = height;
  // To display a different color for debugging.
  // bg.tint = 0xff0000;
  background.interactive = true;

  // To avoid to trigger a background click on drag, we check if the mouse moved before the
  // "mouseup" event.
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

  // We add the the background and node container to our main container.
  superStage.addChild(background);
  superStage.addChild(stage);

  // The graphics for the edges/links between nodes.
  const links = new Graphics();

  // We had the links to the graph container.
  stage.addChild(links);

  // We create a rednerer based on the width and height provided.
  const renderer = autoDetectRenderer({
    width,
    height,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });

  // We create a ticker to trigger the rendering function.
  const ticker = new Ticker();

  // Don't start the ticker before we are ready.
  ticker.autoStart = false;

  return {
    superStage,
    stage,
    renderer,
    ticker,
    links,
  };
}

/**
 * This callback handles a click on a node.
 * @callback nodeClickCallback
 * @param {Node} n - The node being clicked.
 * @return {void}
 */

/**
 * Initializes the grahics object for one node.
 *
 * @param {PIXIContext} pixiContext - The {@link PIXIContext} for the node we want to draw.
 * @param {Node} node - The node to be drawn.
 * @param {nodeClickCallback} onClick - The click event handler for this node.
 * @returns {void}
 */
export function initNodeGraphics(
  pixiContext: PIXIContext,
  node: Node,
  onClick: (n: Node) => void
): void {
  const { stage, superStage, renderer, ticker } = pixiContext;
  // We get the label good so that it returns to the line as intended.
  node.label = node.label.replaceAll("\\n", "\n");
  // We create a text object for the label.
  node.text = new Text(node.label, {fontSize: 2.5});
  // This resolution enables to see the text sharpely on zooming.
  node.text.resolution = 16;

  // We get the size of the text object.
  const bounds = node.text.getLocalBounds(new Rectangle());
  const isBigGraph = (node.graph.nodes.length > 200);

  // We set the rotation anchor at the middle of the text object.
  node.text.anchor.set(1, 1);
  node.text.rotation = Math.PI;

  // We draw the node with our text size and contour color from the original .dot file.
  drawNode(node.gfx, bounds, colorToHex(node.color));

  // We set the text to the middle of the drawned node.
  node.text.position = new ObservablePoint(
    () => null,
    null,
    -bounds.width / 2,
    -bounds.height / 2
  );

  // We calculate this coordinate for the edge to arrive at the center of the node side.
  node.target_y = isBigGraph ? node.y : node.y - (bounds.height / 2);
  node.x += (bounds.width / 2);

  // We add click interaction.
  node.gfx.interactive = true;
  node.gfx.on("click", () => {
    onClick(node);
  });

  // We add mouse over interaction.
  let hover: Graphics | null = null;
  node.gfx.on("mouseover", () => {
    // We stop the ticker to avoid superficial rendering.
    ticker.stop();
    // We remove our outdated render function.
    ticker.remove(onTicked(renderer, superStage));
    // Draw the hover and add it to the main container.
    hover = drawHover(node, superStage);
    superStage.addChild(hover);
    // We restart the ticker with the updated rendering function.
    ticker.add(onTicked(renderer, superStage));
    ticker.start();
  });
  node.gfx.on("mouseout", () => {
    // No need to update the rendering function on child delation. Just remove the hover from the
    // main stage.
    hover && superStage.removeChild(hover);
    ticker.start();
  });

  // We add the text to the node graphics.
  node.gfx.addChild(node.text);
  // We set the position of the node to the correct one, according to the layout calculated at
  // initialization.
  node.gfx.position = new ObservablePoint(() => null, null, node.x, node.y);

  // If we have a big, we rotate it.
  if (isBigGraph) {
    node.gfx.rotation -= (1 / 2) * Math.PI;
  }

  // We add the node to the graph container.
  stage.addChild(node.gfx);
}
