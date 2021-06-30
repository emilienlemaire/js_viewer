export interface GraphProps {
  graphviz: string;
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
