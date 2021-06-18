import type { State, Action, Node, Edge } from "../types/Graph";
import type { PIXIContext } from "../types/Context";
import type { GraphProps } from "../types/Props";

import React, { useEffect, useReducer, useState } from "react";
import stringHash from "string-hash";
import useD3 from "../hooks/useD3";
import * as d3 from "d3";
import * as PIXI from "pixi.js";
import * as init from "../common/init";
import { drawArrow, colorToHex, drawNode } from "../common/draw";
import { Graph as GraphType } from "../common/graphs";

// TODO:
//  - Intégrer a cubicle (generation html + online ou non)
//  - Hover sur les noeuds
//  - Petit graphe = zoom, gros graphe = rotation
//  - On select: hide all other nodes but the path to the root
//  - Split
//  - Select the types of nodes to display

// Questions:
//   - Pour la config: clique droit toogle, popup avec cocher...

function reducer(state: State, action: Action): State {

  const oldParents = (() => {
    if (action.payload.parents) {
      return (state.parents)
        ? state.parents.filter((n: Node)  => {
          return action.payload.parents &&
            !action.payload.parents.includes(n) && n != action.payload.node;
        })
        : null;
    }
    return state.parents;
  })();

  switch (action.type) {
    case "setSelection":
      return (state.node == action.payload.node)
        ? {
          node: null,
          old: state.node,
          parents: null,
          oldParents: state.parents,
          path: null
        }
        : {
          node: action.payload.node,
          old: state.node,
          parents: action.payload.parents,
          oldParents,
          path: action.payload.path
        };
    default:
      throw new Error();
  }
}

  //eslint-disable-next-line
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    //eslint-disable-next-line
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

export default function Graph({ graphviz }: GraphProps): React.FunctionComponentElement<GraphProps> {

  const [selectionState, dispatch] = useReducer(reducer, {
    node: null,
    old: null,
    parents: null,
    oldParents: null,
    path: null
  });
  const [pixiContext, setPIXIContext] = useState<PIXIContext | null>(null);
  const [requested, setRequested] = useState<number | null>(null);
  const [graph, setGraph] = useState<GraphType | null>(null);

  const render = (stage: PIXI.Container, renderer: PIXI.AbstractRenderer): () => void => {
    return () => {
      setRequested(null);

      renderer.render(stage);
    };
  }

  const requestRender = (stage: PIXI.Container, renderer: PIXI.AbstractRenderer): void => {
    if (requested) return;
    setRequested(requestAnimationFrame(render(stage, renderer)));
  }

  const onNodeClick = (n: Node) => {
    const parents = n.graph.ancestors(n);
    const path = n.graph.targetEdges([...parents, n]);
    dispatch({type: "setSelection", payload: { node: n, parents, path }});
    return false;
  }

  const onBackgroundClick = () => {
    dispatch({type: "setSelection", payload: { node: null, parents: null, path: null }});
  }

  const ref = useD3(
    (div): void => {
      const width = (div.node() as HTMLDivElement).offsetWidth,
        height = (div.node() as HTMLDivElement).offsetHeight;

      const midpoint = new PIXI.Point(width / 2, height / 2);

      const customGraph = init.initGraph(graphviz);

      const {superStage, stage, renderer, ticker, links} = init.initPIXI(width, height, onBackgroundClick);

      const onPosOrScaleChange = () => {
        requestRender(superStage, renderer);
      };

      stage.rotation = Math.PI;
      stage.position = new PIXI.ObservablePoint(onPosOrScaleChange, null, midpoint.x, midpoint.y);
      stage.scale = new PIXI.ObservablePoint(onPosOrScaleChange, null, stage.scale.x, stage.scale.y);

      div.selectAll("*").remove();
      (div.node() as HTMLDivElement).appendChild(renderer.view);
      console.log(renderer);

      const zoom = d3.zoom<HTMLCanvasElement, unknown>().on("zoom", (event) => {
        const { x, y, k } = event.transform.translate(midpoint.x, midpoint.y);
        stage.position.set(x, y);
        stage.scale.set(k, k);
        requestRender(superStage, renderer);
      });

      div.selectAll<HTMLCanvasElement, unknown>("canvas").call(zoom);


      customGraph.nodes.forEach((node: Node) => {
        init.initNodeGraphics(stage, node, onNodeClick);
      });

      customGraph.edges.forEach((edge: Edge) => {
        const { source, target } = edge;
        links.lineStyle(
          0.5,
          edge.subsume ? colorToHex("gray") : colorToHex("black")
        );
        drawArrow(links, source, target);
        links.closePath();
      });

      setPIXIContext({superStage, stage, renderer, ticker, links} as PIXIContext);
      setGraph(customGraph);

      requestRender(superStage, renderer);
    },
    [stringHash(graphviz)]
  );

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;

      if (selectionState.old) {
        const { gfx, text, color } = selectionState.old;
        const bounds = text.getLocalBounds(new PIXI.Rectangle());
        drawNode(gfx, bounds, colorToHex(color), 0xffffff);
      }

      if (selectionState.node) {
        const { gfx, text, color } = selectionState.node;
        const bounds = text.getLocalBounds(new PIXI.Rectangle());
        drawNode(gfx, bounds, colorToHex(color), 0xb4e6a4);
      }

      if (selectionState.parents) {
        console.log("New", selectionState.parents);
        selectionState.parents.forEach((node: Node) => {
          const { gfx, text, color } = node;
          const bounds = text.getLocalBounds(new PIXI.Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xde9dff);
        });
      }

      if (selectionState.oldParents) {
        console.log("Old", selectionState.oldParents);
        selectionState.oldParents.forEach((node: Node) => {
          const { gfx, text, color } = node;
          const bounds = text.getLocalBounds(new PIXI.Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xffffff);
        });
      }
      requestRender(superStage, renderer);
    }
  //eslint-disable-next-line
  }, [selectionState, pixiContext]);

  useEffect(() => {
    if (pixiContext && graph) {
      pixiContext.links.clear();

      graph.edges.forEach((edge) => {
        const { source, target } = edge;
        pixiContext.links.lineStyle(
          (selectionState.path && selectionState.path.includes(edge))
            ? 1.5
            : 0.5,
          (selectionState.path && selectionState.path.includes(edge))
            ? 0xde9dff
            : colorToHex(edge.color)
        );
        drawArrow(pixiContext.links, source, target);
        pixiContext.links.closePath();
      });
    }
  }, [selectionState.path, graph, pixiContext]);

  return (
    <div style={{ height: "100%" }} ref={ref} />
  );
}
