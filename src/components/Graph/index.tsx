import type { GraphProps } from "../../types/Props";

import React, { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import { initGraph } from "../../common/init";

import { dotSelector } from "../../store/dot/dotSlice";
import { setGraph, graphSelector } from "../../store/graph/graphSlice";
import { addOptionsInfo, optionsSelector } from "../../store/options/optionsSlice";

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
  const optionsState = useSelector(optionsSelector);

  const [splitsCount, setSplitCount] = useState<number>(0);
  const [splits, setSplits] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const graphInfo = initGraph(dotState);
    dispatch(setGraph(graphInfo));
    dispatch(addOptionsInfo());
    setSplitCount(1);
    //eslint-disable-next-line
  }, [dotState]);

  useEffect(() => {
    setSplitCount(optionsState.length);
  }, [optionsState.length]);

  useEffect(() => {
    const splits = [];
    const splitSize = (() => {
      switch(splitsCount) {
        case 1: return 12;
        case 2: return 6;
        case 3: return 4;
        case 4: return 3;
        case 5:
        case 6: return 2;
        default: return 1;
      }
    })();

    for (let split = 0; split  < splitsCount; split ++) {
      splits.push(
        <Grid item xs={splitSize} key={split}>
          <GraphSplit />
        </Grid>
      );
    }
    setSplits(splits);
  }, [splitsCount]);

  const classes = useStyles();

  return (
    <div className={`${classes.grow} ${className}`} style={{height: "100%"}}>
      {graphState &&
      <Grid container spacing={1} className={classes.gridContainer}>
        {splits}
      </Grid>
    }
  </div>
  );
}
