import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { dotSelector, setGraph } from "../store/dot/dotSlice";

import TopAppBar from "./TopAppBar";
import Graph from "./Graph";

//eslint-disable-next-line
const dot_str = (window as any).__DOT_STR__;

const OptionalGraph = (): React.FunctionComponentElement<null> => {
  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();

  if (!dot && dot_str) {
    dispatch(setGraph(dot_str));
  }

  if (dot) {
    return <Graph />;
  }

  return <div>No file selected yet.</div>;
};

export default function Main(): React.FunctionComponentElement<null> {

  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();

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

