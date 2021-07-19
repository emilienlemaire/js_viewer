/**
 * src/components/TopAppBar/index.tsx
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
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Dropzone from "./Dropzone";
import MoreIcon from "../../icons/More";

import {
  addOptionsInfo,
} from "../../store/options/optionsSlice";

import "./../../css/TopAppBar.css";
import "../../css/Dropdown.css";

export default function TopAppBar(): React.FunctionComponentElement<null> {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [dropzone, setDropzone] = useState(false);

  /**
   * Handler for the dropdown menu click.
   */
  const onClick = () => {
    setShow(!show);
  };

  /**
   * Handler for the "Select file" button of the menu.
   */
  const onSelectClick = () => {
    setDropzone(!dropzone);
    onClick();
};

/**
 * Handler for the "Add graph split" button of the menu.
 */
const onAddSplitClick = () => {
  dispatch(addOptionsInfo());
  onClick();
};

  return (
    <div className="dropdown float">
      <a
        className="dropdownbtn"
        onClick={onClick}
      >
        <MoreIcon className="my-float" />
      </a>
      <div className="dropdown-content">
        <a className="dropdown-item" href="#" onClick={onSelectClick}>Select file</a>
        <a className="dropdown-item" href="#" onClick={onAddSplitClick}>Add graph split</a>
      </div>
      <Dropzone show={dropzone}/>
    </div>
  );
}
