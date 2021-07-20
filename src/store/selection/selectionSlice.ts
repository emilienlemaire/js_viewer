/**
 * src/store/selection/selectionSlice.ts
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
/** @module store/selection/selectionSlice */
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
    /**
    * Sets the selected node and get its parents and the path to the root node.
    *
    * @param state - The state before the update.
    * @param {PayloadAction<Node>}  action - All the informations of the action to perform,
    *  the payload contains the selected node.
    */
    setSelectedNode: (state, action: PayloadAction<Node>) => {
      const node = action.payload;
      // We get the parents of the selected node.
      const newParents = node.graph.ancestors(node);
      // We get the path to the root node from the selected node.
      const path = node.graph.targetEdges([...newParents, node]).map((e) => ({
        source: e.source.name,
        target: e.target.name,
      }));

      // We map the parenst node to their name.
      const parents = newParents.map((n) => n.name);

      // We remove from the old parents all parents of the newly selected node.
      const oldParents = state.parents &&
        state.parents.filter((n) => !parents.includes(n) && n != node.name);

      return {
        node: node.name,
        oldNode: state.node,
        parents,
        oldParents,
        path,
      } as SelectionState;
    },
    /**
    * Sets the selection to a null node.
    *
    * @param state - The state before the update.
    */
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

/**
 * Selects the current selection state from the global state.
 *
 * @param {RootState} state - The current global state.
 * @return {SelectionState} The current selection state.
 */
export const selectionSelector = (state: RootState): SelectionState => state.selection;

export default selectionSlice.reducer;

