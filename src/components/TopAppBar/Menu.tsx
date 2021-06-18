import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import { DropzoneDialog } from "material-ui-dropzone";
import { DotContext } from "../../context/DotContext";

export default function CustomMenu(): React.FunctionComponentElement<null> {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick: React.MouseEventHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <DotContext.Consumer>
        {({ setDot }) => (
          <div>
            <IconButton edge="end" color="inherit" onClick={handleClick}>
              <MoreIcon />
            </IconButton>
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
              <MenuItem>Select render mode (WIP)</MenuItem>
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
                  setDot(dotFile);
                  setOpen(false);
                  handleClose();
                };
                reader.readAsText(files[0]);
              }}
            />
          </div>
        )}
      </DotContext.Consumer>
    </div>
  );
}
