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
  grow: {
    flexGrow: 1,
  },
}));

type PropType = {
  onClick: () => void,
  className: string
}

export default function TopAppBar(props: PropType): React.FunctionComponentElement<PropType> {
  const classes = useStyles();

  return (
    <Toolbar className={classes.root + props.className}>
      <Fab
        color="inherit"
        aria-label="menu"
        onClick={props.onClick}
      >
        <MenuIcon />
      </Fab>
      <div className={classes.grow} />
      <Menu />
    </Toolbar>
  );
}
