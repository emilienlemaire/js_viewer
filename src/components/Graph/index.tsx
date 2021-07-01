import type { GraphProps } from "../../types/Props";

import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import { initGraph } from "../../common/init";

import { dotSelector } from "../../store/dot/dotSlice";
import { setGraph, graphSelector } from "../../store/graph/graphSlice";

import GraphSplit from "./GraphSplit";
import Grid from "@material-ui/core/Grid";

//eslint-disable-next-line
(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  //eslint-disable-next-line
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  gridContainer: {
    height: "100%",
  },
}));

// TODO:
//  - Make a graph grid and build them from graphState.

export default function Graph(
  { className }: GraphProps
): React.FunctionComponentElement<GraphProps> {

  const dispatch = useDispatch();

  const dotState = useSelector(dotSelector);
  const graphState = useSelector(graphSelector);

  useEffect(() => {
    const graphInfo = initGraph(dotState);
    dispatch(setGraph(graphInfo));
    //eslint-disable-next-line
  }, [dotState]);

  const classes = useStyles();

  return (
    <div className={`${classes.grow} ${className}`} style={{height: "100%"}}>
      {graphState &&
      <Grid container spacing={1} className={classes.gridContainer}>
        <Grid item xs={6}>
          <GraphSplit />
        </Grid>
        <Grid item xs={6}>
          <GraphSplit />
        </Grid>
      </Grid>
    }
  </div>
  );
}
