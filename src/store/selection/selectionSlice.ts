import type { SelectionState, RootState } from "../../types/Store";
import type { Node } from "../../types/Graph";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SelectionState = {
  node: null,
  oldNode: null,
  parents: null,
  oldParents: null,
  path: null,
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSelectedNode: (state, {payload: node}: PayloadAction<Node>) => {
      const parentNodes = node.graph.ancestors(node);
      const path = node.graph.targetEdges([...parentNodes, node]).map((e) => ({
        source: e.source.name,
        target: e.target.name,
      }));

      const parents = parentNodes.map((n) => n.name);

      const oldParents = state.parents &&
        state.parents.filter((n) => !parents.includes(n) && n != node.name);

      state.oldNode = state.node;
      state.node = node.name;
      state.parents = parents;
      state.oldParents = oldParents;
      state.path = path;
    },
    setEmptySelection: (state) => {
      state.oldNode = state.node;
      state.oldParents = state.parents;
      state.node = null;
      state.parents = null;
      state.path = null;
    },
  },
});

export const { setSelectedNode, setEmptySelection } = selectionSlice.actions;

export const selectionSelector = (state: RootState): SelectionState => state.selection;

export default selectionSlice.reducer;

