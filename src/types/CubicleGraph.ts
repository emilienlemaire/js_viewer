export interface Node {
  color: string;
  label?: string;
  shape?: string;
  fontcolor?: string;
  fontsize?: string;
  style?: string;
  fillcolor?: string;
  orig?: string;
  approx?: string;
  invariant?: string;
  subsumed?: string;
  unsafe?: string;
  error?: string;
}

export interface Edge {
  color: string;
  penwidth: string;
  fontname: string;
  label?: string;
  style?: string;
  arrowhead?: string;
  constraint?: string;
  dir?: string;
  pencolor?: string;
  fontcolor?: string;
  subsume?: string;
  candidate?: string;
  error?: string;
}
