/**
 * src/hooks/useD3.ts
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
/** @module hooks/useD3 */
import {useRef, useEffect} from "react";
import { select } from "d3";

/**
 * Custom hook to use d3 in a component.
 *
 * @param {Function} renderGraphFn - Function called on the ref containing the graph.
 * @param {React.DependencyList} dependencies - Dependencies that triggers this hook.
 * @return {React.RefObject<HTMLDivElement>} The ref with all the d3 modifications applied to it.
 */
function useD3(
  renderGraphFn: (selection: d3.Selection<HTMLDivElement, unknown, null, undefined>) => void,
  dependencies: React.DependencyList
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      renderGraphFn(select(ref.current));
    }
    //eslint-disable-next-line
  }, dependencies);

  return ref;
}

export default useD3;
