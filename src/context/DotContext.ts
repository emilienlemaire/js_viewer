import { useContext, createContext } from "react";

export type DotContextType = {
  dot: string;
  setDot: (s: string) => void;
}

export const DotContext = createContext<DotContextType>({
  dot: "",
  // eslint-disable-next-line
  setDot: () => {}
});

export const useDotContext = (): DotContextType => useContext(DotContext);
