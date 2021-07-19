/**
 * src/store/dot/dotSlice.ts
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
import type { DotState, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DotState = {
  graph: "",
};

export const dotSlice = createSlice({
  name: "dot",
  initialState,
  reducers: {
    /**
    * Set the dot state with the string of the graph.
    * @param {DotState} state - The state before we update it.
    * @param {PayloadAction<string>} action - The informations of the action to perform.
    */
    setGraph: (state: DotState, action: PayloadAction<string>) => {
      state.graph = action.payload;
    },
  },
});

export const { setGraph } = dotSlice.actions;

/**
 * Select the dot state from the gloabl state.
 *
 * @param {RootState} state - The global state
 * @returns {string} The current grph from the dot state.
 */
export const dotSelector = (state: RootState): string => state.dot.graph;

export default dotSlice.reducer;

