/**
 * src/store/contextMenu/contextMenuSlice.ts
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
/** @module store/contextMenu/contextMenuSlice */
import type { ContextMenuState, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Payload containing all the informations neede to show the context menu
 */
interface ShowPayload {
  /**
   * @type {number}
   */
  index: number;
  /**
   * @type {number}
   */
  x: number;
  /**
   * @type {number}
   */
  y: number;
}

const initialState: ContextMenuState = {
  index: null,
  x: null,
  y: null,
};

export const contextMenuSlice = createSlice({
  name: "dot",
  initialState,
  reducers: {
    /**
    * Tells the global state to show the context menu.
    * @param {ContextMenuState} state - The state before we update it.
    * @param {PayloadAction<ShowPayload>} action - The informationso f the action to perform.
    */
    showContextMenu: (state: ContextMenuState, action: PayloadAction<ShowPayload>) => {
      state.index = action.payload.index;
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    /**
    * Tells the global state to hide the context menu.
    * @param {ContextMenuState} state - The state before we update it.
    */
    hideContextMenu: (state: ContextMenuState) => {
      state.index = null;
      state.x = null;
      state.y = null;
    },
  },
});

export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;

/**
 * Select the contextMenu state from the global state.
 *
 * @param {RootState} state - The global state.
 * @return {ContextMenuState} The current context menu state.
 */
export const contextMenuSelector = (state: RootState): ContextMenuState => state.contextMenu;

export default contextMenuSlice.reducer;

