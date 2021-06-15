import { Node, Edge } from "../common/graphs";

export interface State {
  node: Node | null;
  old: Node | null;
  parents: Node[] | null;
  oldParents: Node[] | null;
  path: Edge[] | null;
}

export interface Action {
  type: string;
  payload: any;
}
