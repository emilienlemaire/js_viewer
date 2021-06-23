import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DotContext } from "./context/DotContext";
import Main from "./components/Main";
import "./index.css";
import "./App.css";

const App = (): React.FunctionComponentElement<null> => {
  const [dot, setDot] = useState<string | null>(null);

  return (
    <DotContext.Provider value={{dot, setDot}}>
      <Main />
    </DotContext.Provider>
  );
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
