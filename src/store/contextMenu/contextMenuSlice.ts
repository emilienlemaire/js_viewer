import type { ContextMenuState, RootState } from "../../types/Store";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShowPayload {
  index: number;
  x: number;
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
    showContextMenu: (state, action: PayloadAction<ShowPayload>) => {
      state.index = action.payload.index;
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    hideContextMenu: (state) => {
      state.index = null;
      state.x = null;
      state.y = null;
    },
  },
});

export const { showContextMenu, hideContextMenu } = contextMenuSlice.actions;

export const contextMenuSelector = (state: RootState): ContextMenuState => state.contextMenu;

export default contextMenuSlice.reducer;

