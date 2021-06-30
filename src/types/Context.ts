import type * as PIXI from "pixi.js";

export interface PIXIContext {
  superStage: PIXI.Container;
  stage: PIXI.Container;
  renderer: PIXI.AbstractRenderer;
  ticker: PIXI.Ticker;
  links: PIXI.Graphics;
}

export interface DotContextType {
  dot: string | null;
  setDot: (s: string | null) => void;
};
