import {useRef, useEffect} from "react";
import { select } from "d3";

const useD3 = (
  renderGraphFn: (selection: d3.Selection<HTMLDivElement, unknown, null, undefined>) => void,
  dependencies: React.DependencyList): React.RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      renderGraphFn(select(ref.current));
    }
    // eslint-disable-next-line
    return () => {};
  //eslint-disable-next-line
  }, dependencies);

  return ref;
  };

export default useD3;
