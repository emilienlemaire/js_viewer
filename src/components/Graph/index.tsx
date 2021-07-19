/**
 * src/components/Graph/index.tsx
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


/**
 * This component contains the graphslipts and manages their layout.
 *
 * @returns {React.FunctionComponentElement<null>} The component to be displayed according to current
 *  state
 */
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

  /**
   * On resize callback.
   */
  const onRezie = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  /**
   * This is debounced callback returned by {@link debounce}.
   * @callback debouncedCallabck
   * @param {Event} event - The event that needs debouncing.
   * @returns {void}
   */
  /**
   * This debounce a function according to the timing between 2 similar events. This allows
   * to avoid calling to often an event handler that does heavy calculation.
   *
   * @param {CallableFunction} func - The function we wish to debounce.
   * @param {number} [timer=1000] - The timeout befaore the function can be called again.
  * @returns {debouncedCallabck} The debounced event handler.
   */
  const debounce = ({ func, timer = 1000 }: { func: CallableFunction; timer?: number; }) => {
    let time: NodeJS.Timeout;
    const f = (event: Event) => {
      if (time) clearTimeout(time);
      timer = setTimeout(func, timer, event);
    };
    return f;
  };

  /**
  * Split close callback
  * @callback onSplitCloseCallback
  * @returns {{payload: number, type: string}} The state action performed.
  */

  /**
   * Split close handler.
   *
   * @param {number} index - The index of the closed split.
   * @returns {onSplitCloseCallback} The event handle for the split of index index.
   */
  const onClose = (index: number) => {
    return () => dispatch(deleteOptionsInfo(index));
  };

  // We don't want to resize before the window resize is, that generates too many rendering, so we
  // debounce the resizing.
  window.addEventListener("resize", debounce({ func: onRezie }));

  // If the .dot file loaded is changed, then we reinitialize all the local state, and global state.
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

  // We add remove splits according tot he size of the options array.
  useEffect(() => {
    setSplitCount(optionsState.length);
  }, [optionsState]);

  // We update the splits according to their size and the number of splits shown.
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
  //eslint-disable-next-line
  }, [windowSize, splitsCount, optionsState.length]);

  return (
    <div className="grid grid--auto-fit" style={{height: "100%"}}>
      {graphState &&
        splits
    }
  </div>
  );
}
