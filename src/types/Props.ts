import type { GraphInfo } from "./Store";
import type { Size } from "./Common";

export interface GraphProps {
  className: string;
}

export interface TooltipProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export interface TopAppBarProps {
  onClick: () => void;
  className: string;
}

export interface MenuProps {
  className: string;
}

export interface GraphSplitProps {
  size: Size;
  index: number;
}
