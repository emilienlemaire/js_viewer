import type { TopAppBarProps } from "../../types/Props";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "./Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  left: {
    float: "left",
  },
  middle: {
    flexGrow: 1,
    float: "none",
  },
  right: {
    float: "right",
  },
}));

export default function TopAppBar(props: TopAppBarProps): React.FunctionComponentElement<TopAppBarProps> {
  const classes = useStyles();

  return (
    <Toolbar className={classes.root + props.className}>
      <Fab
        color="inherit"
        aria-label="menu"
        onClick={props.onClick}
        className={classes.left}
      >
        <MenuIcon />
      </Fab>
      <div className={classes.middle}/>
      <Menu
        className={classes.right}
      />
    </Toolbar>
  );
}
