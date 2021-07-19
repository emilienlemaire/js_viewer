/**
 * src/store/options/optionsSlice.ts
 * Copyright (c) 2021 Emilien Lemaire <emilien.lem@icloud.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { OptionsInfo, OptionsState, RootState } from "../../types/Store";
import type { Node } from "../../types/Graph";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OptionsState = [] as OptionsState;

/**
 * Check if the index given is good with the current state.
 *
 * @param {OptionsState} state - The current option state.
 * @param {number} index - The index to be checked.
 * @returns {boolean} true if the index is good for our current option state.
 */
function checkIndex(state: OptionsState, index: number): boolean {
  if (index > state.length - 1) {
    return false;
  }

  return true;
}

/**
 * Check if we show all nodes or not.
 *
 * @param {OptionsInfo} state - The current option state.
 * @returns {boolean} true if all nodes must be shown.
 */
function checkShowAllNodes(state: OptionsInfo): boolean {
  return state.showApproxNodes && state.showInvariantNodes && state.showSubsumedNodes &&
    state.showUnsafeNodes && state.showErrorNodes;
}


const optionSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    /**
    * Add an option info object to the option state array.
    *
    * @param  state - The option state befoare we update it.
    */
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
    /**
    * Toogles the show all nodes options on a given split.
    *
    * @param  state - The option state befoare we update it.
    * @param {PayloadAction<number>} - All the informations about the action. the payload is the
    *  index of the split where the options are set.
    */
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
    /** Toogles the show subsumed nodes options on a given split.
    *
    * @param  state - The option state befoare we update it.
    * @param {PayloadAction<number>} - All the informations about the action. the payload is the
    *  index of the split where the options are set.
    */
    toggleSubsumedNodes: (state, action: PayloadAction<number>) => {
      if (!checkIndex(state as OptionsState, action.payload))
        return;

      state[action.payload].showSubsumedNodes = !state[action.payload].showSubsumedNodes;
      state[action.payload].showAllNodes = checkShowAllNodes(state[action.payload] as OptionsInfo);
    },
    /** Set the hovered node of a given split.
    *
    * @param  state - The option state befoare we update it.
    * @param {PayloadAction<{index: number, node: Node | null}>} - All the informations about the
    *  action. The payload is the index of the split where the options are set and the hovered node,
    *  or null if there is no havred node.
    */
    setHoveredNode: (state, action: PayloadAction<{index: number, node: Node | null}>) => {
      if (!checkIndex(state as OptionsState, action.payload.index)) {
        return;
      }
      (state[action.payload.index] as OptionsInfo).hoveredNode = action.payload.node;
    },
    /**
    * Resets all the options as an empty array.
    *
    * @returns {OptionsState} An empty array of OptionsInfo.
    */
    resetOptionsInfo: (): OptionsState => {
      return [] as OptionsState;
    },
    /**
    * Delete an optionsInfo object from the global state.
    * @param state - The global options state before the update.
    * @param {PayloadAction<number>} action - All the informations for the action to be performed,
    *  the payload represents the index of the split where the options are set.
    */
    deleteOptionsInfo: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
  },
});

export const {
  addOptionsInfo,
  toggleAllNodes,
  toggleSubsumedNodes,
  resetOptionsInfo,
  setHoveredNode,
  deleteOptionsInfo,
} = optionSlice.actions;

/**
 * Selects the options state from the current global state.
 *
 * @param {RootState} state - The current global state.
 * @returns {OptionsState} The current option state.
 */
export const optionsSelector = (state: RootState): OptionsState => state.options;

export default optionSlice.reducer;
