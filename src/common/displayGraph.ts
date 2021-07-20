/**
 * src/common/displayGraph.ts
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
/** @module common/displayGraph */
import type { Graph } from "./graphs";
import type { Node, Edge } from "../types/Graph";
import type { PIXIContext } from "../types/Context";

import { initNodeGraphics } from "./init";
import { colorToHex, drawArrow } from "./draw";
import { onNodeClick } from "./eventHandlers";

/**
 * displayNewGraph.
 *
 * @param {Graph} graph - The graph to display
 * @param {PIXIContext} pixiContext - The PIXIContext to display the graph on
 * @return {void}
 */
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

  // We now add the new graph nodes to the stage.
  graph.nodes.forEach((node: Node) => {
    initNodeGraphics(pixiContext, node, onNodeClick);
  });

  // Finally the edges are added to the stage to be drawn.
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
