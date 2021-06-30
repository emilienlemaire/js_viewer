import store from "../store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface DotState {
  graph: string;
}

interface Edge {
  source: string;
  target: string;
}

export interface SelectionState {
  node: string | null;
  oldNode: string | null;
  parents: string[] | null;
  oldParents: string[] | null;
  path: Edge[] | null;
}

