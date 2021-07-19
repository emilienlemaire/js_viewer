/**
 * src/components/Graph/GraphSplit.tsx
 * Copyright (c) 2021 Emilien Lemaire <emilien.lem@icloud.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Edge as CubicleEdge } from "../../types/CubicleGraph";
import type { Edge as GraphLibEdge } from "graphlib";
import type { HierarchyGraph } from "../../types/Graph";
import type { PIXIContext } from "../../types/Context";
import type { GraphSplitProps } from "../../types/Props";
import type { ZoomInfo } from "../../types/Common";
import type { OptionsInfo } from "../../types/Store";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useContextMenu } from "react-contexify";
import { ObservablePoint, Point, Rectangle } from "../../common/pixi";
import { D3ZoomEvent, hierarchy, zoom as d3zoom, tree as d3Tree } from "d3";

import useD3 from "../../hooks/useD3";
import { initPIXI } from "../../common/init";
import { drawArrow, drawNode, colorToHex } from "../../common/draw";
import { getGraphNoSubsumed, Graph as GraphType } from "../../common/graphs";
import { onBackgroundClick, onTicked } from "../../common/eventHandlers";

import { Graph } from "../../common/graphs";

import { selectionSelector } from "../../store/selection/selectionSlice";
import { graphSelector } from "../../store/graph/graphSlice";
import {
  optionsSelector,
} from "../../store/options/optionsSlice";
import { displayNewGraph } from "../../common/displayGraph";

import ContextMenu from "./ContextMenu";
import CrossIcon from "../../icons/Cross";

import "../../css/TopAppBar.css";

/**
 * The component containing a graph split. One is generated for each split one the screen.
 *
 * @param {GraphSplitProps} props - The props for this component.
 * @returns {React.FunctionComponentElement<GraphSplitProps>} The component according to the props.
 */
export default function GraphSplit(
  props: GraphSplitProps
): React.FunctionComponentElement<GraphSplitProps> {

  const graphState = useSelector(graphSelector);
  const selectionState = useSelector(selectionSelector);
  const optionsState = useSelector(optionsSelector);

  const [pixiContext, setPIXIContext] = useState<PIXIContext | null>(null);
  const [localGraph, setLocalGraph] = useState<GraphType | null>(null);
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
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const { show } = useContextMenu({
    id: `context-menu-${props.index}`,
  });

  /**
   * The right click event handler.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The right click event to handle.
   */
  const onRightClick: React.MouseEventHandler<HTMLDivElement> =
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      show(e);
    };

  // We get all the initialization we need inside this hook.
  const ref = useD3(
    (div) => {
      // If we don't have a graph yet, no need to the initialization.
      if (graphState) {
        // WE get the width and heigh of the split.
        const width = (div.node() as HTMLDivElement).clientWidth,
          height = props.size.height;

        setSize({ width, height: props.size.height });

        // WE get the mid point to center the graph later.
        setMidpoint(new Point(width / 2, height / 2));

        const {superStage, stage, renderer, ticker, links} = initPIXI(
          width,
          height,
          onBackgroundClick
        );

        const {graphLibGraph: graph, d3Tree: tree, subsumedEdges } = graphState;

        const customGraph = new Graph(tree, graph, graph.edges());

        // If any node was removed with the subsuned edge removal we add them again here.
        graph.nodes().forEach((n) => {
          if (!customGraph.node(n)) {
            customGraph.addGraphLibNode(n);
          }
        });

        // WE also add the subsumed edges to the graph.
        subsumedEdges.forEach((edge: [GraphLibEdge, CubicleEdge]) => {
          customGraph.addSubsumedEdge(edge);
        });

        // Display our generated graph.
        displayNewGraph(
          customGraph,
          {superStage, stage, renderer, ticker, links} as PIXIContext
        );

        // Set our local context for the other hooks.
        setPIXIContext({superStage, stage, renderer, ticker, links} as PIXIContext);
        setLocalGraph(customGraph);

        // We clean the split befoore adding the renderer view.
        div.selectAll("*").remove();
        (div.node() as HTMLDivElement).appendChild(renderer.view);

        // Initialize the zoom handler.
        const zoom = d3zoom<HTMLCanvasElement, unknown>().on(
          "zoom",
          (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
            setZoomInfo({...(event.transform)});
          }).filter((event) => {
            return !event.ctrlKey;
          });

        // Add the zoom handler to the split. We don't do anything on double click, this might
        // be an option for later.
        div.selectAll<HTMLCanvasElement, unknown>("canvas")
          .call(zoom)
          .on("dblclick.zoom", null);

        // We don't really need more FPS, this would use GPU and CPU cycles for nothing.
        ticker.maxFPS = 60;

        // Add the rendering function to the ticker and start it.
        ticker.add(onTicked(renderer, superStage));
        ticker.start();
      }
    // This hook is called only when the graphState is modified (i.e. a new file is loaded).
    }, [graphState]);

  // Update localOptions only when they change in the global state
  useEffect(() => {
    const options = optionsState[props.index];
    // We must check that only the options related to this split are modified, if the options of
    // other splits are modified, we don't do anything.
    if (options && options != localOptions) {
      setLocalOptions(options);
    }
    // This hook is called when the globals option, localOptions or the index of the split are
    // modified.
  }, [optionsState, localOptions, props.index]);

  // Update graph view when selection is edited
  useEffect(() => {
    // If we don't have a pixiContext or a local graoh yet, no need to do anything.
    if (pixiContext && localGraph) {
      // If a node from a past selection is no more selected, we give it back its default color.
      if (selectionState.oldNode) {
        const oldNode = localGraph.node(selectionState.oldNode);
        if (oldNode) {
          const { gfx, text, color } = oldNode;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xffffff);
        }
      }

      // If we have a selected node, we give it the selection color.
      if (selectionState.node) {
        const node = localGraph.node(selectionState.node);
        if (node) {
          const { gfx, text, color } = node;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xb4e6a4);
        }
      }

      // If the selected node has parents, we give them the good selection color.
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

      // If there are old paretns from previous selections that are no more selected, we give them
      // back their default color.
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

      // We clean the links, they are all contains in the same graphics object so we need
      // to redraw all of them at every selection change.
      pixiContext.links.clear();

      localGraph.edges.forEach((edge) => {
        const { source, target } = edge;
        // Check if the edge is in the selected path.
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
        // We draw the arrow of the edge and close the path for the next edge to be drawn.
        drawArrow(pixiContext.links, source, target, edge.label);
        pixiContext.links.closePath();
      });
    }
    // We only call this hook when the selectionState, the localGraph or the pixiContext is modified.
  }, [selectionState, localGraph, pixiContext]);

  // Update view size according to parent div size.
  useEffect(() => {
    // If we don't have a pixiCOntext or if the size is zero we don't do anything.
    if (pixiContext && size.width > 0 && size.height > 0) {
      const { renderer } = pixiContext;

      // We resize the renderer view according to our new width and height.
      renderer.view.width = size.width;
      renderer.view.height = size.height;
      renderer.resize(size.width, size.height);
    }
    //Only call this hook if the size is changed.
    //eslint-disable-next-line
  }, [pixiContext, size]);

  // Display new graphs according to options
  useEffect(() => {
    if (graphState && pixiContext && localOptions) {
      const {graphLibGraph, subsumedEdges, hierarchyGraph } = graphState;
      const { stage, superStage } = pixiContext;

      // We choosed to hide the subsumed nodes.
      if (!localOptions.showSubsumedNodes) {
        // We recalculate the layout of the graph without any subsumed node or edges.
        const hierarchyTree = hierarchy(getGraphNoSubsumed(hierarchyGraph));

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);

        // We create a new local graph and display it.
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());

        displayNewGraph(
          customGraph,
          pixiContext
        );

        // Some calculation for new graph to fill the split.
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

        // We rotate the graph accroding to its size.
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

      // If we choose to display all nodes.
      if (localOptions.showAllNodes) {
        // We get the full graph layout from our global graph context.
        const hierarchyTree = hierarchy(hierarchyGraph);

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());

        // We add any missing node
        graphLibGraph.nodes().forEach((n) => {
          if (!customGraph.node(n)) {
            customGraph.addGraphLibNode(n);
          }
        });

        // We add subsumed edges that are deleted from the global state graph.
        subsumedEdges.forEach((edge: [GraphLibEdge, CubicleEdge]) => {
          customGraph.addSubsumedEdge(edge);
        });

        displayNewGraph(
          customGraph,
          pixiContext
        );

        // We calculate the rotation and the scale of the graph according to its dispalyed size.
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
    //We only call this hook when the local options, the gloabl graph state, the index,
    // the pixiContext ir the midpoint are modified.
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
    if (pixiContext && localGraph) {
      const { stage } = pixiContext;

      const { x, y, k } = {
        x: zoomInfo.x + zoomInfo.k * transformInfo.x,
        y: zoomInfo.y + zoomInfo.k * transformInfo.y,
        k: zoomInfo.k * transformInfo.k,
      };

      // We scale and position the graph according to the current zomming state.
      stage.position.set(x, y);
      stage.scale.set(k);
    }
    // This hook is called only when the zoomInfo, transforInfo, pixiContext, local graph state or
    //  midpoint are modified.
    //eslint-disable-next-line
  }, [zoomInfo, transformInfo, pixiContext, localGraph, midpoint]);

  // If the pixiCOntext is modified, we want to redraw our graph.
  useEffect(() => {
    if (pixiContext) {
      const { ticker } = pixiContext;
      ticker.update();
    }
  }, [pixiContext]);

  return (
    <div onContextMenu={onRightClick} style={{height: "100%"}}>
      { optionsState.length > 1 &&
      <div className="float-right">
        <a
          className="dropdownbtn"
          onClick={props.onClose}
        >
          <CrossIcon className="my-float" />
        </a>
      </div>
      }
      <div style={{height: "100%"}} ref={ref}/>
      <ContextMenu index={props.index} x={0} y={0} />
    </div>
  );
}
