import type { OptionsInfo, OptionsState, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OptionsState = [] as OptionsState;

function checkIndex(state: OptionsState, index: number): boolean {
  if (index > state.length - 1) {
    console.error(`The numbers of views are ${state.length}. Index ${index} is out of range.`);
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
      });
    },
    toggleAllNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state, action.payload))
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
      if (!checkIndex(state, action.payload))
        return;

      state[action.payload].showApproxNodes = !state[action.payload].showApproxNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload]);
    },
    toggleInvariantNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state, action.payload))
        return;

      state[action.payload].showInvariantNodes = !state[action.payload].showInvariantNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload]);
    },
    toggleSubsumedNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state, action.payload))
        return;

      state[action.payload].showSubsumedNodes = !state[action.payload].showSubsumedNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload]);
    },
    toggleUnsafeNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state, action.payload))
        return;

      state[action.payload].showUnsafeNodes = !state[action.payload].showUnsafeNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload]);
    },
    toggleErrorNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state, action.payload))
        return;

      state[action.payload].showErrorNodes = !state[action.payload].showErrorNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload]);
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
} = optionSlice.actions;

export const optionsSelector = (state: RootState): OptionsState => state.options;

export default optionSlice.reducer;
