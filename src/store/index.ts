import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import dotReducer from "./dot/dotSlice";
import selectionReducer from "./selection/selectionSlice";
import graphReducer from "./graph/graphSlice";

export default configureStore({
  reducer: {
    dot: dotReducer,
    selection: selectionReducer,
    graph: graphReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ["selection", "graph"],
      ignoredActionPaths: ["payload"],
    },
    immutableCheck: {
      ignoredPaths: ["graph"],
    },
  }),
});
