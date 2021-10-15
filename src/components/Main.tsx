/**
 * src/components/Main.tsx
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
/** @module components/Main */
import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { dotSelector, setGraph } from "../store/dot/dotSlice";

import TopAppBar from "./TopAppBar";
import Graph from "./Graph";

//// We get the dot_str string from the global variable __DOT_STR__.
//eslint-disable-next-line
const dot_str: string = (window as any).__DOT_STR__;

/**
 * Optional graph components, which invites to select a graph or displays it if
 *  we have one already.
 *
 * @return {React.FunctionComponentElement<null>}
 */
const OptionalGraph = (): React.FunctionComponentElement<null> => {
  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();

  // If we don;t have .dot file loaded and if the dot_str string exists, then we display the
  // graph from the dot_str.
  if (!dot && dot_str) {
    dispatch(setGraph(dot_str));
  }

  if (dot) {
    return <Graph />;
  }

  return <div>No file selected yet.</div>;
};

/**
 * The Main component that conatians all our graph and menus.
 *
 * @return {React.FunctionComponentElement<null>}
 */
export default function Main(): React.FunctionComponentElement<null> {

  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    alert("Safari makes the application particularly slow. Please consider to use another browser.");
  }

  if (!dot && dot_str) {
    dispatch(setGraph(dot_str));
  }

  return (
    <div className="App" >
      <TopAppBar />
      <OptionalGraph />
    </div>
  );
}

