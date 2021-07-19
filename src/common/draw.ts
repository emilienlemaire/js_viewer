/**
 * src/common/draw.ts
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
import type { Node } from "../types/Graph";

import {
  Graphics,
  Rectangle,
  Text,
  Container,
} from "./pixi";

/**
 * Transforsm a string color to a hex color, defaulted to black if the string color is unknown.
 *
 * @param {string} color - The name of the color
 * @returns {number} The color in hax format, or black if the name is not handled by the switch
 *     statement.
 */
export function colorToHex(color: string): number {
  switch (color) {
    case "gray":
      return 0x808080;
    case "red":
      return 0xff0000;
    case "blue":
      return 0x0000ff;
    case "green":
      return 0x00ff00;
    default:
      return 0x000000;
  }
}

/**
 * drawNode.
 *
 * @param {Graphics} graphics - The node specific graphcis element.
 * @param {Rectanlge} bounds - The bounds of the node to be drawn.
 * @param {number} contourColor - The color of the contour of the node to be displayed.
 * @param {number} [fillColor=0xffffff] - The background color of the node to be displayed.
 * @returns {void}
 */
export function drawNode(
  graphics: Graphics,
  bounds: Rectangle,
  contourColor: number,
  fillColor = 0xffffff
): void {
  // We clean the graphics to redraw the node
  graphics.clear();
  graphics.lineStyle(1.5, contourColor);

  // Set the backgorund color of the node.
  graphics.beginFill(fillColor);
  graphics.drawRect(
    -(bounds.width + 1.5) / 2,
    -(bounds.height + 1.5) / 2,
    bounds.width + 1.5,
    bounds.height + 1.5
  );
}

/**
 * drawArrow.
 *
 * @param {Graphics} graphics - The graphics where the arrow will be drawn.
 * @param {Node} source - The source node of the arrow, this contains the coordonates of the source node.
 * @param {Node} target - The target node of the arrow, this contains the coordinates of the target node.
 * @param {string=} label - The optional label of the arrow, if present, it will be drawn at the middle of
 *      the arrow.
 * @returns {void}
 */
export function drawArrow(graphics: Graphics, source: Node, target: Node, label?: string): void {
  const nodeWidth = target.text.width;

  // We mode to the source of the arrow.
  graphics.moveTo(source.x, source.y);
  // Draw a line to the target.
  graphics.lineTo(target.x, <number>target.target_y);
  const dx = target.x - source.x;
  const dy = <number>target.target_y - source.y;
  const l = Math.sqrt(dx * dx + dy * dy);

  if (l === 0) {
    return;
  }

  // This is our normal vector. It describes direction of the graph
  // link, and has length == 1:
  const nx = dx/l;
  const ny = dy/l;

  // Now let's draw the arrow:
  const arrowLength = 6;
  const arrowWingsLength = 2;

  // This is where arrow should end. We do `(l - NODE_WIDTH)` to
  // make sure it ends before the node UI element.
  const ex = source.x + nx * (l - nodeWidth);
  const ey = source.y + ny * (l - nodeWidth);

  // Offset on the graph link, where arrow wings should be
  const sx = source.x + nx * (l - nodeWidth - arrowLength);
  const sy = source.y + ny * (l - nodeWidth - arrowLength);

  // orthogonal vector to the link vector is easy to compute:
  const topX = -ny;
  const topY = nx;

  // Let's draw the arrow:
  graphics.moveTo(ex, ey);
  graphics.lineTo(sx + topX * arrowWingsLength, sy + topY * arrowWingsLength);
  graphics.moveTo(ex, ey);
  graphics.lineTo(sx - topX * arrowWingsLength, sy - topY * arrowWingsLength);
  if (label) {
    // If the labale is present we draw it.
    const transitionLabel = new Text(label, {
      fontSize: 3,
      stroke: "white",
      strokeThickness: 1,
    });
    const width = transitionLabel.getLocalBounds(new Rectangle()).width;
    // We set the resolution this high so that it is sharp when we zoom.
    transitionLabel.resolution = 16;
    transitionLabel.rotation = Math.PI;
    transitionLabel.position.set(ex + (width / 2), ey);
    graphics.addChild(transitionLabel);
  }
}

/**
 * Draws the hovered node at a constant size, so that when we hover a node zoomed out, we can see
 *      what the node containes
 *
 * @remarks
 * The bound check is not always working, a lead to fix it would be to to use the position compared
 *      to the window itself.
 *
 * @param {Node} node - The node that is hovered.
 * @param {Container} stage - The stage where we want to draw the hovered node.
 * @returns {Graphics} A new graphics instance with the hovered node drawn on it.
 */
export function drawHover(node: Node, stage: Container): Graphics {
  // The new grpahics to be returned
  const hover = new Graphics();
  const hoverText = new Text("");

  // We add the text to be drawn.
  hoverText.text = node.label;
  hover.addChild(hoverText);

  // We get the text bounds.
  const globBounds = hoverText.getBounds();

  // We draw the edges with the size of the text.
  hover.lineStyle(1.5, 0xff0000);
  hover.beginFill(0xffffff);
  hover.drawRoundedRect(
    hover.position.x - 5,
    hover.position.y - 5,
    globBounds.width + 10,
    globBounds.height + 10,
    20
  );

  const globPos = node.gfx.getBounds();
  hover.position.set(globPos.x, globPos.y);

  const hoverGlobPos = hover.getBounds();

  // We need to check if the hover is outside the view
  if (hoverGlobPos.x + globBounds.right > stage.width) {
    hoverGlobPos.x -= globBounds.width - 10;
  }

  if (hoverGlobPos.x < stage.position.x) {
    hoverGlobPos.x += (stage.position.x - hoverGlobPos.x) + 10;
  } else {
    hoverGlobPos.x += 20;
  }

  if (hoverGlobPos.y + globBounds.bottom > stage.height) {
    hoverGlobPos.y -= globBounds.height - 10;
  }

  if (hoverGlobPos.y < stage.position.y) {
    hoverGlobPos.y += (stage.position.y - hoverGlobPos.y) + 10;
  } else {
    hoverGlobPos.y += 20;
  }

  // We set the new position according to the modifications done by the bound detection.
  hover.position.set(hoverGlobPos.x, hoverGlobPos.y);

  return hover;
}
