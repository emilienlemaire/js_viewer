import type { DotContextType } from "../types/Context";

import { useContext, createContext } from "react";

export const DotContext = createContext<DotContextType>({
  dot: "",
  // eslint-disable-next-line
  setDot: () => {}
});

export const useDotContext = (): DotContextType => useContext(DotContext);
