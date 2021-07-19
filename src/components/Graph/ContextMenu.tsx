/**
 * src/components/Graph/ContextMenu.tsx
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

/**
 * The ContextMenu component, showed when the split is right clicked.
 *
 * @param {ContextMenuProps} props - The props for this component.
 * @returns {React.FunctionComponentElement<ContextMenuProps>} The compenent according to the props.
 */
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
