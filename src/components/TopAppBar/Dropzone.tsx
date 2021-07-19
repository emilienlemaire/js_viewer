/**
 * src/components/TopAppBar/Dropzone.tsx
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
import type { DropzoneProps } from "../../types/Props";

import React, { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { setGraph } from "../../store/dot/dotSlice";
import { resetOptionsInfo } from "../../store/options/optionsSlice";

import "../../css/Modal.css";

/**
 * The file selection compenent.
 *
 * @param {DropzoneProps} props - The props neede for this component
 * @returns {React.FunctionComponentElement<DropzoneProps>}
 */
export default function Dropzone(props: DropzoneProps): React.FunctionComponentElement<DropzoneProps> {
  // This is a reference to the div containing this component.
  const ref = useRef<null | HTMLDivElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const dispatch = useDispatch();

  /**
   * Hides the div when the modal is closed.
   */
  const onCloseClick = () => {
    if (ref.current) {
      ref.current.style.display = "none";
    }
  };

  /**
   * Callback the "save" button.
   */
  const onSave = () => {
    if (files) {
      // We can handle only one graph at a time so far.
      if (files.length > 1) {
        console.error("There should be only one file selected to be opened.");
        return;
      }

      // We read the file and check that everything is good.
      const reader = new FileReader();
      reader.onload = (e) => {
        const dotFile = e.target &&
          (typeof e.target.result === "string")
          ? (e.target && e.target.result)
          : (e.target && e.target.result && e.target.result.toString());
        dispatch(setGraph(dotFile as string));
        dispatch(resetOptionsInfo());
      };

      reader.readAsText(files[0]);
      onCloseClick();
    }
  };

  // If we want to show the modal then we change the div style.
  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = props.show ? "block" : "none";
    }
  }, [props.show]);

  return (
    <div
      ref={ref}
      className="modal"
      id="exampleModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
            <h5 className="modal-title" id="exampleModalLabel">Select a Cubicle dot file</h5>
            <button type="button" className="close" aria-label="Close">
              <span onClick={onCloseClick} aria-hidden="true">&times;</span>
            </button>
          <div className="modal-body">
            <input
              type="file"
              accept=".dot"
              placeholder="Select .dot file"
              onChange={(e) => setFiles(e.target && e.target.files)}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
            <button
              type="button"
              className={"btn btn-primary"}
              disabled={!Boolean(files)}
              onClick={onSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
