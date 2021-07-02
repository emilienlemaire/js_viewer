import type { GraphState, GraphInfo, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GraphState = null as GraphState;

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<GraphInfo>) => {
      console.log("GraphState", action.payload);
      return {
        graphLibGraph: action.payload.graphLibGraph,
        d3Tree: action.payload.d3Tree,
        dechargedEdges: action.payload.dechargedEdges,
      };
    },
  },
});

export const { setGraph } = graphSlice.actions;

export const graphSelector = (state: RootState): GraphState => state.graph;

export default graphSlice.reducer;

