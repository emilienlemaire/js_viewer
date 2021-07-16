import type { ContextMenuProps } from "../../types/Props";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Item } from "react-contexify";

import {
  toggleAllNodes,
  toggleSubsumedNodes,
  optionsSelector,
} from "../../store/options/optionsSlice";

import "react-contexify/dist/ReactContexify.css";

export default function ContextMenu(
  props: ContextMenuProps
): React.FunctionComponentElement<ContextMenuProps> {

  const dispatch = useDispatch();
  const optionsState = useSelector(optionsSelector);

  return (
    <Menu id={`context-menu-${props.index}`}>
      <Item onClick={() => dispatch(toggleAllNodes(props.index))}>
        {optionsState[props.index] && optionsState[props.index].showAllNodes &&
          <span>&#10003;</span>}
        Show all nodes
      </Item>
      <Item onClick={() => dispatch(toggleSubsumedNodes(props.index))}>
        {optionsState[props.index] && optionsState[props.index].showSubsumedNodes &&
          <span>&#10003;</span>}
        Show Subsumed nodes
      </Item>
    </Menu>
  );
}
