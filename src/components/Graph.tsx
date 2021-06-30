import type { Node, Edge } from "../types/Graph";
import type { PIXIContext } from "../types/Context";
import type { GraphProps } from "../types/Props";

import React, { useEffect, useState } from "react";
import stringHash from "string-hash";
import useD3 from "../hooks/useD3";
import * as d3 from "d3";
import * as PIXI from "pixi.js";
import * as init from "../common/init";
import { drawArrow, colorToHex, drawNode } from "../common/draw";
import { Graph as GraphType } from "../common/graphs";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectionSelector, setSelectedNode, setEmptySelection } from "../store/selection/selectionSlice";

  //eslint-disable-next-line
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    //eslint-disable-next-line
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

export default function Graph({ graphviz, className }: GraphProps): React.FunctionComponentElement<GraphProps> {

  const dispatch = useDispatch();

  const selectionState = useSelector(selectionSelector);
  const [pixiContext, setPIXIContext] = useState<PIXIContext | null>(null);
  const [requested, setRequested] = useState<number | null>(null);
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const render = (stage: PIXI.Container, renderer: PIXI.AbstractRenderer): () => void => {
    return () => {
      setRequested(null);

      renderer.render(stage);
    };
  };

  const requestRender = (stage: PIXI.Container, renderer: PIXI.AbstractRenderer): void => {
    if (requested) return;
    setRequested(requestAnimationFrame(render(stage, renderer)));
  };

  const onNodeClick = (node: Node) => {
    if (node.name != selectionState.node) {
      dispatch(setSelectedNode(node));
    } else {
      dispatch(setEmptySelection());
    }
  };

  const onBackgroundClick = () => {
    dispatch(setEmptySelection());
  };

  const onHover = (node: Node) => {
    setHoveredNode(node);
  };

  const onOut = () => {
    setHoveredNode(null);
  };

  const ref = useD3(
    (div): void => {
      const width = (div.node() as HTMLDivElement).clientWidth,
        height = (div.node() as HTMLDivElement).clientHeight;

      const midpoint = new PIXI.Point(width / 2, height / 2);

      const customGraph = init.initGraph(graphviz);

      const {superStage, stage, renderer, ticker, links} = init.initPIXI(width, height, onBackgroundClick);

      const onPosOrScaleChange = () => {
        requestRender(superStage, renderer);
      };

      //background.anchor.set(1, 1);

      customGraph.nodes.forEach((node: Node) => {
        init.initNodeGraphics(stage, superStage , node, onNodeClick, onHover, onOut);
      });

      customGraph.edges.forEach((edge: Edge) => {
        const { source, target } = edge;
        links.lineStyle(
          0.5,
          edge.subsume ? colorToHex("gray") : colorToHex("black")
        );
        drawArrow(links, source, target, edge.label);
        links.closePath();
      });

      setPIXIContext({superStage, stage, renderer, ticker, links} as PIXIContext);
      setGraph(customGraph);

      const viewBounds = superStage.getBounds();
      const graphBounds = stage.getBounds();
      const padding = 100;

      const dHeight = (customGraph.nodes.length <= 150)
        ? (viewBounds.height - padding) / graphBounds.height
        : (viewBounds.height - padding) / graphBounds.width;


      if (customGraph.nodes.length > 150) {
        stage.rotation -= (Math.PI / 2);
      } else {
        stage.rotation = Math.PI;
      }
      stage.position = new PIXI.ObservablePoint(onPosOrScaleChange, null, midpoint.x, height - padding);
      stage.scale = new PIXI.ObservablePoint(onPosOrScaleChange, null, stage.scale.x, stage.scale.y);
      stage.scale.set(dHeight, dHeight);

      div.selectAll("*").remove();
      (div.node() as HTMLDivElement).appendChild(renderer.view);

      const zoom = d3.zoom<HTMLCanvasElement, unknown>().on("zoom", (event) => {
        const { x, y, k } = event.transform.translate(midpoint.x, height - padding).scale(dHeight);
        stage.position.set(x, y);
        stage.scale.set(k, k);
        requestRender(superStage, renderer);
      });

      div.selectAll<HTMLCanvasElement, unknown>("canvas").call(zoom);

      // This gets us the rectangle of the current graph.
      // Us it for zooming in or out at start up.
      {/* const background = new PIXI.Sprite(PIXI.Texture.WHITE);
      const bounds = stage.getBounds();
      background.position.set(bounds.left, bounds.top);
      background.width = bounds.width;
      background.height = bounds.height;
      background.tint = 0xffff00;
      superStage.addChild(background); */}

      requestRender(superStage, renderer);
    },
    [stringHash(graphviz)]
  );

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;

      if (graph) {
        if (selectionState.oldNode) {
          const { gfx, text, color } = graph.node(selectionState.oldNode) as Node;
          const bounds = text.getLocalBounds(new PIXI.Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xffffff);
        }

        if (selectionState.node) {
          const { gfx, text, color } = graph.node(selectionState.node) as Node;
          const bounds = text.getLocalBounds(new PIXI.Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xb4e6a4);
        }

        if (selectionState.parents) {
          selectionState.parents.forEach((n) => {
            const { gfx, text, color } = graph.node(n) as Node;
            const bounds = text.getLocalBounds(new PIXI.Rectangle());
            drawNode(gfx, bounds, colorToHex(color), 0xde9dff);
          });
        }

        if (selectionState.oldParents) {
          selectionState.oldParents.forEach((n) => {
            const { gfx, text, color } = graph.node(n) as Node;
            const bounds = text.getLocalBounds(new PIXI.Rectangle());
            drawNode(gfx, bounds, colorToHex(color), 0xffffff);
          });
        }
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
        const edgeName = {
          source: source.name,
          target: target.name,
        };

        pixiContext.links.lineStyle(
          (selectionState.path && selectionState.path.filter((e) => e.source === edgeName.source &&
            e.target === edgeName.target).length)
            ? 1.5
            : 0.5,
          (selectionState.path && selectionState.path.filter((e) => e.source === edgeName.source &&
            e.target === edgeName.target).length)
            ? 0xde9dff
            : colorToHex(edge.color)
        );
        drawArrow(pixiContext.links, source, target, edge.label);
        pixiContext.links.closePath();
      });
    }
  }, [selectionState, graph, pixiContext]);

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;
      requestRender(superStage, renderer);
    }
  //eslint-disable-next-line
  }, [pixiContext, hoveredNode]);

  const classes = useStyles();

  return (
    <div className={`${classes.grow} ${className}`} style={{height: "100%"}} ref={ref}/>
  );
}
