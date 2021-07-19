/**
 * src/store/index.ts
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

/**
* @file In this file we create the store for the global state and then export it.
*/
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import dotReducer from "./dot/dotSlice";
import selectionReducer from "./selection/selectionSlice";
import graphReducer from "./graph/graphSlice";
import optionsReducer from "./options/optionsSlice";
import contextMenuSlice from "./contextMenu/contextMenuSlice";

const store = configureStore({
  reducer: {
    dot: dotReducer,
    selection: selectionReducer,
    graph: graphReducer,
    options: optionsReducer,
    contextMenu: contextMenuSlice,
  },
  middleware: getDefaultMiddleware({
    // Some of our state is not serializable, so we disable this check to avoid running into errors
    serializableCheck: {
      ignoredPaths: ["selection", "graph"],
      ignoredActionPaths: ["payload"],
    },
    // Some of our state cannot be declared as immutable, so we disable this check to avoid running
    // into errors.
    immutableCheck: {
      ignoredPaths: ["graph"],
    },
  }),
});

export const { dispatch } = store;
export default store;
