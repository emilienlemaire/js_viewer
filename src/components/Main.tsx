import React from "react";
import TopAppBar from "./TopAppBar";
import Graph from "./Graph";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { dotSelector, setGraph } from "../store/dot/dotSlice";

//eslint-disable-next-line
const dot_str = (window as any).__DOT_STR__;

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  content: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  topBar: {
    zIndex: 10,
  },
}));

const OptionalGraph = (): React.FunctionComponentElement<null> => {
  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();

  if (!dot && dot_str) {
    dispatch(setGraph(dot_str));
  }

  const classes = useStyles();

  if (dot) {
    return <Graph className={classes.content} />;
  }

  return <div>No file selected yet.</div>;
};

export default function Main(): React.FunctionComponentElement<null> {

  const dot = useSelector(dotSelector);
  const dispatch = useDispatch();

  if (!dot && dot_str) {
    dispatch(setGraph(dot_str));
  }

  const classes = useStyles();

  return (
    <div className={`App ${classes.container}`} >
      <TopAppBar onClick={() => null} className={`${classes.content} ${classes.topBar}`}/>
      <OptionalGraph />
    </div>
  );
}

