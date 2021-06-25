import React from "react";
import { DotContext } from "../context/DotContext";
import TopAppBar from "./TopAppBar";
import Graph from "./Graph";
import { makeStyles } from "@material-ui/core/styles";

//eslint-disable-next-line
const dot_str = (window as any).__DOT_STR__;

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    position: "relative"
  },
  content: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0
  },
  topBar: {
    zIndex: 10
  }
}));

export default function Main(): React.FunctionComponentElement<null> {

  const classes = useStyles();

  return (
    <div className={`App ${classes.container}`} >
      <TopAppBar onClick={() => null} className={`${classes.content} ${classes.topBar}`}/>
      <DotContext.Consumer>
        {({ dot }) => {
          if (dot) {
            return <Graph graphviz={dot} className={classes.content}/>
          }

          if (dot_str) {
            return <Graph graphviz={dot_str} className={classes.content}/>
          }
          return <div>No file selected yet.</div>
        }}
      </DotContext.Consumer>
    </div>
    );
}

