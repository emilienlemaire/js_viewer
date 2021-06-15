import React from "react";
import { DotContext } from "../context/DotContext";
import TopAppBar from "./TopAppBar";
import Graph from "./Graph";

export default function Main() {
  return (
    <div className="App">
      <TopAppBar onClick={() => null}/>
      <DotContext.Consumer>
        {({ dot }) => {
          if (dot) {
            return <Graph graphviz={dot} />
          }

          return <div>No file selected yet.</div>
        }}
      </DotContext.Consumer>
    </div>
    );
}

