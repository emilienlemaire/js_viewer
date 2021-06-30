import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import dotReducer from "./dot/dotSlice";
import selectionReducer from "./selection/selectionSlice";

export default configureStore({
  reducer: {
    dot: dotReducer,
    selection: selectionReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ["selection"],
      ignoredActionPaths: ["payload.text", "payload.gfx", "payload.graph"],
    },
  }),
});
