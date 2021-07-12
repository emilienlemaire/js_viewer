import type {
  Container,
  AbstractRenderer,
  Ticker,
  Graphics,
} from "../common/pixi";

export interface PIXIContext {
  superStage: Container;
  stage: Container;
  renderer: AbstractRenderer;
  ticker: Ticker;
  links: Graphics;
}

export interface DotContextType {
  dot: string | null;
  setDot: (s: string | null) => void;
}
