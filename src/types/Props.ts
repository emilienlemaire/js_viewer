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

export interface DropzoneProps {
  show: boolean;
}

export interface MenuProps {
  className: string;
}

export interface ContextMenuProps {
  index: number;
  x: number | null;
  y: number | null;
}

export interface GraphSplitProps {
  size: Size;
  index: number;
  onClose: () => void;
}
