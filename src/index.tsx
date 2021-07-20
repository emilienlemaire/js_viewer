/**
 * src/index.tsx
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
/** @module index */
import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import Main from "./components/Main";
import "./index.css";
import "./App.css";

/**
 * The global app component.
 *
 * @return {React.FunctionComponentElement<null>}
 */
const App = (): React.FunctionComponentElement<null> => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

// We render our global component inside the #root element from index.html
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
