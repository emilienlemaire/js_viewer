import type { OptionsInfo, OptionsState, RootState } from "../../types/Store";
import type { Node } from "../../types/Graph";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OptionsState = [] as OptionsState;

function checkIndex(state: OptionsState, index: number): boolean {
  if (index > state.length - 1) {
    return false;
  }

  return true;
}

function checkShowAllNodes(state: OptionsInfo): boolean {
  return state.showApproxNodes && state.showInvariantNodes && state.showSubsumedNodes &&
    state.showUnsafeNodes && state.showErrorNodes;
}


const optionSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    addOptionsInfo: (state) => {
      state.push({
        showAllNodes: true,
        showApproxNodes: true,
        showInvariantNodes: true,
        showSubsumedNodes: true,
        showUnsafeNodes: true,
        showErrorNodes: true,
        hoveredNode: null,
      });
    },
    toggleAllNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      if (state[action.payload].showAllNodes) {
        state[action.payload].showAllNodes = false;
      } else {
        state[action.payload].showAllNodes = true;
        state[action.payload].showApproxNodes = true;
        state[action.payload].showInvariantNodes = true;
        state[action.payload].showSubsumedNodes = true;
        state[action.payload].showUnsafeNodes = true;
        state[action.payload].showErrorNodes = true;
      }
    },
    toggleApproxNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showApproxNodes = !state[action.payload].showApproxNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    toggleInvariantNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showInvariantNodes = !state[action.payload].showInvariantNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    toggleSubsumedNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showSubsumedNodes = !state[action.payload].showSubsumedNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    toggleUnsafeNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showUnsafeNodes = !state[action.payload].showUnsafeNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    toggleErrorNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showErrorNodes = !state[action.payload].showErrorNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    setHoveredNode: (state, action: PayloadAction<{index: number, node: Node | null}>) => {
      if (!checkIndex(state as OptionsState, action.payload.index)) {
        return;
      }
      (state[action.payload.index] as OptionsInfo).hoveredNode = action.payload.node;
    },
    resetOptionsInfo: () => {
      return [] as OptionsState;
    },
  },
});

export const {
  addOptionsInfo,
  toggleAllNodes,
  toggleSubsumedNodes,
  resetOptionsInfo,
  setHoveredNode,
} = optionSlice.actions;

export const optionsSelector = (state: RootState): OptionsState => state.options;

export default optionSlice.reducer;
