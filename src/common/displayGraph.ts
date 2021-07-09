import type { Graph } from "./graphs";
import type { Node, Edge } from "../types/Graph";
import type { PIXIContext } from "../types/Context";

import { initNodeGraphics } from "./init";
import { colorToHex, drawArrow } from "./draw";
import { onNodeClick } from "./eventHandlers";

export function displayNewGraph(
  graph: Graph,
  pixiContext: PIXIContext
): void {
  const {stage, links } = pixiContext;

  // Clean the PIXI state
  stage.removeChildren();
  links.clear();
  links.removeChildren();
  stage.addChild(links);

  graph.nodes.forEach((node: Node) => {
    initNodeGraphics(pixiContext, node, onNodeClick);
  });

  graph.edges.forEach((edge: Edge) => {
    const { source, target } = edge;
    links.lineStyle(
      0.5,
      edge.subsume ? colorToHex("gray") : colorToHex("black")
    );
    drawArrow(links, source, target, edge.label);
    links.closePath();
  });

}
