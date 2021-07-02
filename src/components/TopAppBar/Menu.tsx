import type { MenuProps } from "../../types/Props";

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { setGraph } from "../../store/dot/dotSlice";
import { addOptionsInfo, resetOptionsInfo } from "../../store/options/optionsSlice";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import MoreIcon from "@material-ui/icons/MoreVert";
import { DropzoneDialog } from "material-ui-dropzone";

export default function CustomMenu(props: MenuProps): React.FunctionComponentElement<MenuProps> {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClick: React.MouseEventHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        <Fab color="inherit" onClick={handleClick} className={props.className}>
          <MoreIcon />
        </Fab>
      </div>
      <div>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem key="select_file" onClick={() => setOpen(true)}>
            Select file
          </MenuItem>
          <MenuItem key="add_split" onClick={() => dispatch(addOptionsInfo())}>
            Add graph split
          </MenuItem>
        </Menu>
        <DropzoneDialog
          acceptedFiles={[".dot"]}
          filesLimit={1}
          maxFileSize={1e9}
          open={open}
          onClose={() => {
            setOpen(false);
            handleClose();
          }}
          onSave={(files) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dotFile = e.target &&
                (typeof e.target.result === "string")
                ? (e.target && e.target.result)
                : (e.target && e.target.result && e.target.result.toString());
              dispatch(setGraph(dotFile as string));
              dispatch(resetOptionsInfo());
              setOpen(false);
              handleClose();
            };
            reader.readAsText(files[0]);
          }}
        />
        </div>
      </div>
    );
}
