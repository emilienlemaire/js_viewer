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

  const onClick = () => {
    setShow(!show);
  };

  const onSelectClick = () => {
    setDropzone(!dropzone);
    onClick();
};

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
