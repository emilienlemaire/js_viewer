/**
 * src/common/eventHandlers.ts
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
import type { Node } from "../types/Graph";
import type { AbstractRenderer, Container } from "../common/pixi";

import store, { dispatch } from "../store";
import {
  selectionSelector,
  setEmptySelection,
  setSelectedNode,
} from "../store/selection/selectionSlice";
import {
  setHoveredNode,
} from "../store/options/optionsSlice";

/**
 * This set the selection to an empty state.
 *
 * @returns {void}
 */
export function onBackgroundClick(): void {
  dispatch(setEmptySelection());
}

/**
 * This either set the selection state to the node or empty it if the node is the same
 * as the current selected node.
 *
 * @param {Node} node - The node that the user jsut clicked.
 * @returns {void}
 */
export function onNodeClick(node: Node): void {
  const selectionState = selectionSelector(store.getState());
  if (selectionState.node && node.name == selectionState.node) {
    dispatch(setEmptySelection());
  } else {
    dispatch(setSelectedNode(node));
  }
}

/**
 * This set the hovered state to the node passed in argument.
 *
 * @param {number} index - The index of the graph split where the node is overed.
 * @returns {onHover~hover} A function which takes a node in argument and sets it as the hovered state.
 */
export function onHover(index: number): (node: Node) => void {
  /**
   * Set the hover state to the hovered node.
   *
   * @param {Node} node - The node being hovered.
   */
  const hover = (node: Node) => dispatch(setHoveredNode({index, node}));
  return hover;
}

/**
 * This callback is called when the mouse is out of a node.
 * @callback onOutCallback
 */

/**
 * Handles the "mouseout" event, sets the hovered state to null.
 *
 * @param {number} index - The index of the graph split where the node is hovered.
 * @returns {onOutCallback} - The event handler function for the index graph split.
 */
export function onOut(index: number): () => void {
  return () => dispatch(setHoveredNode({index, node: null}));
}

/**
 * This callback is called when the ticker cycles.
 * @callback onTickedCallback
 */

/**
 * This function is called at every tick of the PIXI timer that owns it.
 *
 * @param {AbstractRenderer} renderer - The renderer that draws everything.
 * @param {Container} stage - The stage that must be drawn at each tick.
 * @returns {onTickedCallback} The rendering function for the renderer and the stage.
 */
export function onTicked(renderer: AbstractRenderer, stage: Container): () => void {
  return () => {
    renderer.render(stage);
  };
}

