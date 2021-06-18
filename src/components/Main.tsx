import React from "react";
import { DotContext } from "../context/DotContext";
import TopAppBar from "./TopAppBar";
import Graph from "./Graph";

//eslint-disable-next-line
const dot_str = (window as any).__DOT_STR__;

console.log(dot_str);

export default function Main(): React.FunctionComponentElement<null> {

  return (
    <div className="App">
      <TopAppBar onClick={() => null}/>
      <DotContext.Consumer>
        {({ dot }) => {
          if (dot) {
            return <Graph graphviz={dot} />
          }

          if (dot_str) {
            return <Graph graphviz={dot_str} />
          }
          return <div>No file selected yet.</div>
        }}
      </DotContext.Consumer>
    </div>
    );
}

