import type { Size } from "../../types/Common";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { initGraph } from "../../common/init";

import { dotSelector } from "../../store/dot/dotSlice";
import { setGraph, graphSelector } from "../../store/graph/graphSlice";
import {
  addOptionsInfo,
  optionsSelector,
  resetOptionsInfo,
  deleteOptionsInfo,
} from "../../store/options/optionsSlice";

import GraphSplit from "./GraphSplit";

import "../../css/Grid.css";

//eslint-disable-next-line
// (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  //eslint-disable-next-line
//(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });


export default function Graph(): React.FunctionComponentElement<null> {

  const dispatch = useDispatch();

  const dotState = useSelector(dotSelector);
  const graphState = useSelector(graphSelector);
  const optionsState = useSelector(optionsSelector);

  const [splitsCount, setSplitCount] = useState<number>(0);
  const [splits, setSplits] = useState<JSX.Element[]>([]);
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onRezie = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const debounce = (func: CallableFunction, timer=1000) => {
    let time: NodeJS.Timeout;
    return (event: Event) => {
      if (time) clearTimeout(time);
      timer = setTimeout(func, timer, event);
    };
  };

  const onClose = (index: number) => {
    return () => dispatch(deleteOptionsInfo(index));
  };

  window.addEventListener("resize", debounce(onRezie));

  useEffect(() => {
    if (dotState) {
      const graphInfo = initGraph(dotState);
      setSplitCount(0);
      setSplits([]);
      dispatch(setGraph(graphInfo));
      dispatch(resetOptionsInfo());
      dispatch(addOptionsInfo());
    }
    //eslint-disable-next-line
  }, [dotState]);

  useEffect(() => {
    setSplitCount(optionsState.length);
  }, [optionsState]);

  useEffect(() => {
    const splits = [];

    for (let split = 0; split  < splitsCount; split ++) {
      splits.push(
        <div className="grid__item" key={split}>
          <GraphSplit
            size={{
              width: windowSize.width / splitsCount,
              height: windowSize.height,
            }}
            index={split}
            onClose={onClose(split)}
          />
        </div>
      );
    }

    setSplits(splits);
  }, [windowSize, splitsCount, optionsState.length]);

  return (
    <div className="grid grid--auto-fit" style={{height: "100%"}}>
      {graphState &&
        splits
    }
  </div>
  );
}
