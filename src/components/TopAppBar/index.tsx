import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, /*Button,*/ IconButton, } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "./Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

type PropType = {
  onClick: () => void
}

export default function TopAppBar(props: PropType): React.FunctionComponentElement<PropType> {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={props.onClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title}>js_of_cubicle</Typography>
          <Menu />
        </Toolbar>
      </AppBar>
    </div>
  );
}
