import {useRef, useEffect} from "react";
import * as d3 from "d3";

const useD3 = (
  renderGraphFn: (selection: d3.Selection<HTMLDivElement, unknown, null, undefined>) => void,
  dependencies: any[]) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      renderGraphFn(d3.select(ref.current));
    }
    // eslint-disable-next-line
    return () => {};
  }, dependencies);

  return ref;
}

export default useD3;
