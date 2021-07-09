import type { Node } from "../types/Graph";
import type { AbstractRenderer, Container } from "pixi.js";

import store, { dispatch } from "../store";
import {
  selectionSelector,
  setEmptySelection,
  setSelectedNode,
} from "../store/selection/selectionSlice";
import {
  setHoveredNode,
} from "../store/options/optionsSlice";

export function onBackgroundClick(): void {
  dispatch(setEmptySelection());
}

export function onNodeClick(node: Node): void {
  const selectionState = selectionSelector(store.getState());
  if (selectionState.node && node.name == selectionState.node) {
    dispatch(setEmptySelection());
  } else {
    dispatch(setSelectedNode(node));
  }
}

export function onHover(index: number): (node: Node) => void {
  return (node: Node) => dispatch(setHoveredNode({index, node}));
}

export function onOut(index: number): () => void {
  return () => dispatch(setHoveredNode({index, node: null}));
}

export function onTicked(renderer: AbstractRenderer, stage: Container): () => void {
  return () => {
    renderer.render(stage);
  };
}
