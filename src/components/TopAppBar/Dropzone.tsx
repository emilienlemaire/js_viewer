import type { DropzoneProps } from "../../types/Props";

import React, { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { setGraph } from "../../store/dot/dotSlice";
import { resetOptionsInfo } from "../../store/options/optionsSlice";

import "../../css/Modal.css";

export default function Dropzone(props: DropzoneProps): React.FunctionComponentElement<DropzoneProps> {
  const ref = useRef<null | HTMLDivElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const dispatch = useDispatch();

  const onCloseClick = () => {
    if (ref.current) {
      ref.current.style.display = "none";
    }
  };

  const onSave = () => {
    if (files) {
      if (files.length > 1) {
        console.error("There should be only one file selected to be opened.");
        return;
      }

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
