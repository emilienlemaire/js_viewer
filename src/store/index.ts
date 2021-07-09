import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import dotReducer from "./dot/dotSlice";
import selectionReducer from "./selection/selectionSlice";
import graphReducer from "./graph/graphSlice";
import optionsReducer from "./options/optionsSlice";

const store = configureStore({
  reducer: {
    dot: dotReducer,
    selection: selectionReducer,
    graph: graphReducer,
    options: optionsReducer,
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

export const { dispatch } = store;
export default store;
