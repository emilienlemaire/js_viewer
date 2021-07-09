import type { Node } from "../types/Graph";

import {
  Graphics,
  Rectangle,
  Text,
  Container,
  ObservablePoint,
} from "pixi.js";

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

export function drawNode(
  graphics: Graphics,
  bounds: Rectangle,
  contourColor: number,
  fillColor = 0xffffff
): void {
  graphics.clear();
  graphics.lineStyle(1.5, contourColor);
  graphics.beginFill(fillColor);
  graphics.drawRect(
    -(bounds.width + 1.5) / 2,
    -(bounds.height + 1.5) / 2,
    bounds.width + 1.5,
    bounds.height + 1.5
  );
}
export function drawArrow(graphics: Graphics, source: Node, target: Node, label?: string): void {
  const NODE_WIDTH = target.text.width;
  graphics.moveTo(source.x, source.y);
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
  const ex = source.x + nx * (l - NODE_WIDTH);
  const ey = source.y + ny * (l - NODE_WIDTH);

  // Offset on the graph link, where arrow wings should be
  const sx = source.x + nx * (l - NODE_WIDTH - arrowLength);
  const sy = source.y + ny * (l - NODE_WIDTH - arrowLength);

  // orthogonal vector to the link vector is easy to compute:
  const topX = -ny;
  const topY = nx;

  // Let's draw the arrow:
  graphics.moveTo(ex, ey);
  graphics.lineTo(sx + topX * arrowWingsLength, sy + topY * arrowWingsLength);
  graphics.moveTo(ex, ey);
  graphics.lineTo(sx - topX * arrowWingsLength, sy - topY * arrowWingsLength);
  if (label) {
    const transitionLabel = new Text(label, {
      fontSize: 3,
      stroke: "white",
      strokeThickness: 1,
    });
    const width = transitionLabel.getLocalBounds(new Rectangle()).width;
    transitionLabel.resolution = 16;
    transitionLabel.rotation = Math.PI;
    transitionLabel.position.set(ex + (width / 2), ey);
    graphics.addChild(transitionLabel);
  }
}

export function drawHover(node: Node, stage: Container): Graphics {
  const hover = new Graphics();
  const hoverText = new Text("");
  const globPos = node.gfx.getBounds();

  hoverText.text = node.label;

  hover.addChild(hoverText);

  const globBounds = hoverText.getBounds();

  hover.lineStyle(1.5, 0xff0000);
  hover.beginFill(0xffffff);
  hover.drawRoundedRect(
    hover.position.x - 5,
    hover.position.y - 5,
    globBounds.width + 10,
    globBounds.height + 10,
    20
  );

  // We need to check if the hover is outside the view
  if (globPos.x + globBounds.right > stage.width) {
    globPos.x -= globBounds.width - 10;
  }

  if (globPos.x < stage.position.x) {
    globPos.x += (stage.position.x - globPos.x) + 10;
  } else {
    globPos.x += 20;
  }

  if (globPos.y + globBounds.bottom > stage.height) {
    globPos.y -= globBounds.height - 10;
  }

  if (globPos.y < stage.position.y) {
    globPos.y += (stage.position.y - globPos.y) + 10;
  } else {
    globPos.y += 20;
  }

  hover.position =  new ObservablePoint(() => null, null, globPos.x, globPos.y);

  return hover;
}
