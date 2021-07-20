/**
 * src/store/graph/graphSlice.ts
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
/** @module store/graph/GraphSlice */
import type { GraphState, GraphInfo, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GraphState = null as GraphState;

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    /**
     * Sets the fraph info state
     * @param {PayloadAction<GraphInfo>} action - All the informations for the action happening,
     *  the playload is containing all our global graph information.
     * @return {GraphState} The new state after we set the payload to it.
     */
    setGraph: (_, action: PayloadAction<GraphInfo>): GraphState => {
      return {
        graphLibGraph: action.payload.graphLibGraph,
        d3Tree: action.payload.d3Tree,
        subsumedEdges: action.payload.subsumedEdges,
        hierarchyGraph: action.payload.hierarchyGraph,
      };
    },
  },
});

export const { setGraph } = graphSlice.actions;


/**
 * Selects the current graph state from the global current state.
 *
 * @param {RootState} state - The current global state.
 * @return {GraphState} The current global graph state.
 */
export const graphSelector = (state: RootState): GraphState => state.graph;

export default graphSlice.reducer;

