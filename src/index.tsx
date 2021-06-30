import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import Main from "./components/Main";
import "./index.css";
import "./App.css";

const App = (): React.FunctionComponentElement<null> => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
