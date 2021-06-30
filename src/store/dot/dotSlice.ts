import type { DotState, RootState } from "../../types/store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DotState = {
  graph: "",
};

export const dotSlice = createSlice({
  name: "dot",
  initialState,
  reducers: {
    setGraph: (state, action: PayloadAction<string>) => {
      state.graph = action.payload;
    },
  },
});

export const { setGraph } = dotSlice.actions;

export const dotSelector = (state: RootState): string => state.dot.graph;

export default dotSlice.reducer;

