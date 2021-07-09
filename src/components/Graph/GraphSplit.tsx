import type { Edge as CubicleEdge } from "../../types/CubicleGraph";
import type { Edge as GraphLibEdge } from "graphlib";
import type { HierarchyGraph } from "../../types/Graph";
import type { PIXIContext } from "../../types/Context";
import type { GraphSplitProps } from "../../types/Props";
import type { Position, ZoomInfo } from "../../types/Common";
import type { OptionsInfo } from "../../types/Store";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ObservablePoint, Point, Rectangle } from "pixi.js";
import { D3ZoomEvent, hierarchy, zoom as d3zoom, tree as d3Tree } from "d3";

import useD3 from "../../hooks/useD3";
import { initPIXI } from "../../common/init";
import { drawArrow, drawNode, colorToHex } from "../../common/draw";
import { getGraphNoSubsumed, Graph as GraphType } from "../../common/graphs";
import { onBackgroundClick, onTicked } from "../../common/eventHandlers";

import { Graph } from "../../common/graphs";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import CheckIcon from "@material-ui/icons/Check";

import { selectionSelector } from "../../store/selection/selectionSlice";
import { graphSelector } from "../../store/graph/graphSlice";
import {
  optionsSelector,
  toggleAllNodes,
  toggleSubsumedNodes,
} from "../../store/options/optionsSlice";
import { displayNewGraph } from "../../common/displayGraph";

// TODO:
//  - Change material-ui
//  - Close selection menu on click
//  - Fix hovering

export default function GraphSplit(
  props: GraphSplitProps
): React.FunctionComponentElement<GraphSplitProps> {

  const dispatch = useDispatch();

  const graphState = useSelector(graphSelector);
  const selectionState = useSelector(selectionSelector);
  const optionsState = useSelector(optionsSelector);

  const [pixiContext, setPIXIContext] = useState<PIXIContext | null>(null);
  const [localGraph, setLocalGraph] = useState<GraphType | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<Position>({
    x: null,
    y: null,
  });
  const [midpoint, setMidpoint] = useState<Point>(new Point(0, 0));
  const [localOptions, setLocalOptions] = useState<OptionsInfo | null>(null);
  const [zoomInfo, setZoomInfo] = useState<ZoomInfo>({
    x: 0,
    y: 0,
    k: 1,
  });
  const [transformInfo, setTransformInfo] = useState<ZoomInfo>({
    x: 0,
    y: 0,
    k: 1,
  });

  const onRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuPos({
      x: event.clientX - 2,
      y: event.clientY - 4,
    });
  };

  const onMenuSelection = () => {
    return () => setContextMenuPos({
      x: null,
      y: null,
    });
  };

  const ref = useD3(
    (div) => {
      if (graphState) {
        const width = (div.node() as HTMLDivElement).clientWidth,
          height = (div.node() as HTMLDivElement).clientHeight;

        setMidpoint(new Point(width / 2, height / 2));

        const {superStage, stage, renderer, ticker, links} = initPIXI(
          width,
          height,
          onBackgroundClick
        );

        const {graphLibGraph: graph, d3Tree: tree, subsumedEdges } = graphState;

        const customGraph = new Graph(tree, graph, graph.edges());

        graph.nodes().forEach((n) => {
          if (!customGraph.node(n)) {
            customGraph.addGraphLibNode(n);
          }
        });

        subsumedEdges.forEach((edge: [GraphLibEdge, CubicleEdge]) => {
          customGraph.addDechargedEdge(edge);
        });

        displayNewGraph(
          customGraph,
          {superStage, stage, renderer, ticker, links} as PIXIContext
        );

        setPIXIContext({superStage, stage, renderer, ticker, links} as PIXIContext);
        setLocalGraph(customGraph);

        div.selectAll("*").remove();
        (div.node() as HTMLDivElement).appendChild(renderer.view);

        const zoom = d3zoom<HTMLCanvasElement, unknown>().on(
          "zoom",
          (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
            setZoomInfo({...(event.transform)});
        });

        div.selectAll<HTMLCanvasElement, unknown>("canvas").call(zoom);

        ticker.maxFPS = 60;
        ticker.add(onTicked(renderer, superStage));

        ticker.start();
      }
    }, [graphState]);

  // Update localOptions only when they change in the global state
  useEffect(() => {
    const options = optionsState[props.index];
    if (options != localOptions) {
      setLocalOptions(options);
    }
  }, [optionsState, localOptions, props.index]);

  // Update graph view when selection is edited
  useEffect(() => {
    if (pixiContext && localGraph) {
      if (selectionState.oldNode) {
        const oldNode = localGraph.node(selectionState.oldNode);
        if (oldNode) {
          const { gfx, text, color } = oldNode;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xffffff);
        }
      }

      if (selectionState.node && selectionState.node) {
        const node = localGraph.node(selectionState.node);
        if (node) {
          const { gfx, text, color } = node;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xb4e6a4);
        }
      }

      if (selectionState.parents) {
        selectionState.parents.forEach((n) => {
          const node = localGraph.node(n);
          if (node) {
            {
              const { gfx, text, color } = node;
              const bounds = text.getLocalBounds(new Rectangle());
              drawNode(gfx, bounds, colorToHex(color), 0xde9dff);
            }
          }
        });
      }

      if (selectionState.oldParents) {
        selectionState.oldParents.forEach((n) => {
          const node = localGraph.node(n);
          if (node) {
            const { gfx, text, color } = node;
            const bounds = text.getLocalBounds(new Rectangle());
            drawNode(gfx, bounds, colorToHex(color), 0xffffff);
          }
        });
      }
      pixiContext.links.clear();

      localGraph.edges.forEach((edge) => {
        const { source, target } = edge;
        const isParentTarget = selectionState.path && selectionState.parents &&
          selectionState.parents.includes(target.name);
        const isSelectedNodeTarget = selectionState.path && selectionState.node &&
          selectionState.node == target.name;
        pixiContext.links.lineStyle(selectionState.path &&
          (isParentTarget || isSelectedNodeTarget) && !edge.subsume
          ? 1.5
          : 0.5,
          (isParentTarget || isSelectedNodeTarget) && !edge.subsume
          ? 0xde9dff
          : colorToHex(edge.color)
        );
        drawArrow(pixiContext.links, source, target, edge.label);
        pixiContext.links.closePath();
      });
    }
  }, [selectionState, localGraph, pixiContext]);

  // Update view size according to parent div size.
  useEffect(() => {
    if (pixiContext) {
      const { renderer } = pixiContext;
      const size = props.size;

      renderer.view.width = size.width;
      renderer.view.height = size.height;
      renderer.resize(size.width, size.height);
    }
    //eslint-disable-next-line
  }, [props.size, pixiContext]);

  // Display new graphs according to options
  useEffect(() => {
    if (graphState && pixiContext && localOptions) {
      const {graphLibGraph, subsumedEdges, hierarchyGraph } = graphState;
      const { stage, superStage } = pixiContext;

      if (!localOptions.showSubsumedNodes) {
        const hierarchyTree = hierarchy(getGraphNoSubsumed(hierarchyGraph));

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());

        displayNewGraph(
          customGraph,
          pixiContext
        );

        const viewBounds = superStage.getBounds();
        const graphBounds = stage.getBounds();

        const dHeight = (customGraph.nodes.length <= 200)
          ? (viewBounds.height - 100) / graphBounds.height
          : (viewBounds.height - 100) / graphBounds.width;

        stage.position = new ObservablePoint(
          () => null,
          null,
          midpoint.x,
          (midpoint.y * 2) - 100
        );
        stage.scale = new ObservablePoint(() => null, null, stage.scale.x, stage.scale.y);
        stage.scale.set(dHeight, dHeight);
        const MAX_NODES = 200;

        if (customGraph.nodes.length > MAX_NODES) {
          stage.rotation = -(Math.PI / 2);
        } else {
          stage.rotation = Math.PI;
        }

        setTransformInfo({
          x: stage.position.x,
          y: stage.position.y,
          k: dHeight,
        });

        setLocalGraph(customGraph);
      }

      if (localOptions.showAllNodes) {
        const hierarchyTree = hierarchy(hierarchyGraph);

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());

        graphLibGraph.nodes().forEach((n) => {
          if (!customGraph.node(n)) {
            customGraph.addGraphLibNode(n);
          }
        });

        subsumedEdges.forEach((edge: [GraphLibEdge, CubicleEdge]) => {
          // TODO: Probably should check if edge is already in graph.
          customGraph.addDechargedEdge(edge);
        });

        displayNewGraph(
          customGraph,
          pixiContext
        );

        const viewBounds = superStage.getBounds();
        const graphBounds = stage.getBounds();

        const dHeight = (customGraph.nodes.length <= 200)
          ? (viewBounds.height - 100) / graphBounds.height
          : (viewBounds.height - 100) / graphBounds.width;

        stage.position = new ObservablePoint(
          () => null,
          null,
          midpoint.x,
          (midpoint.y * 2) - 100
        );
        stage.scale = new ObservablePoint(() => null, null, stage.scale.x, stage.scale.y);
        stage.scale.set(dHeight, dHeight);

        if (customGraph.nodes.length > 200) {
          stage.rotation = -(Math.PI / 2);
        } else {
          stage.rotation = Math.PI;
        }

        setTransformInfo({
          x: stage.position.x,
          y: stage.position.y,
          k: dHeight,
        });
        setLocalGraph(customGraph);
      }
    }
    //eslint-disable-next-line
  }, [
    localOptions?.showAllNodes,
    localOptions?.showSubsumedNodes,
    graphState,
    props.index,
    pixiContext,
    midpoint,
  ]);

  // Update zoom only when changed
  useEffect(() => {
    console.log("New zoom", zoomInfo);
    if (pixiContext && localGraph) {
      const { stage } = pixiContext;

      const { x, y, k } = {
        x: zoomInfo.x + zoomInfo.k * transformInfo.x,
        y: zoomInfo.y + zoomInfo.k * transformInfo.y,
        k: zoomInfo.k * transformInfo.k,
      };
      stage.position.set(x, y);
      stage.scale.set(k);
    }
    //eslint-disable-next-line
  }, [zoomInfo, transformInfo, pixiContext, localGraph, midpoint]);

  useEffect(() => {
    if (pixiContext) {
      const { ticker } = pixiContext;
      ticker.update();
    }
  }, [pixiContext]);

  return (
    <div onContextMenu={onRightClick} style={{height: "100%"}}>
      <div style={{height: "100%"}} ref={ref}/>
      {
        optionsState[props.index] &&
        <Menu
          keepMounted
          open={contextMenuPos.y !== null}
          onClose={onMenuSelection()}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenuPos.x && contextMenuPos.y
            ? {top: contextMenuPos.y, left: contextMenuPos.x}
            : undefined
          }
        >
          <MenuItem
            onClick={() => {
              dispatch(toggleAllNodes(props.index));
              setContextMenuPos({x: null, y: null});
            }}
          >
            <Icon>
              {
                optionsState[props.index].showAllNodes &&
                <CheckIcon />
              }
            </Icon>
            Display all nodes
          </MenuItem>
          <MenuItem onClick={onMenuSelection()}>
            <Icon>
              {
                optionsState[props.index].showApproxNodes &&
                <CheckIcon />
              }
            </Icon>
            Display Approx. nodes
          </MenuItem>
          <MenuItem onClick={onMenuSelection()}>
            <Icon>
              {
                optionsState[props.index].showInvariantNodes &&
                <CheckIcon />
              }
            </Icon>
            Display Invariant nodes
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(toggleSubsumedNodes(props.index));
              setContextMenuPos({x: null, y: null});
            }}
          >
            <Icon>
              {
                optionsState[props.index].showSubsumedNodes &&
                <CheckIcon />
              }
            </Icon>
            Display Subsumed nodes
          </MenuItem>
        </Menu>
      }
    </div>
  );
}
