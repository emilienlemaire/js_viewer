import type { Container, AbstractRenderer } from "pixi.js";
import type { Edge as CubicleEdge } from "../../types/CubicleGraph";
import type { Edge as GraphLibEdge } from "graphlib";
import type { Node, Edge, HierarchyGraph } from "../../types/Graph";
import type { PIXIContext } from "../../types/Context";
import { getGraphNoSubsumed, Graph as GraphType } from "../../common/graphs";
import type { GraphSplitProps } from "../../types/Props";
import type { Position } from "../../types/Common";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Point, ObservablePoint, Rectangle } from "pixi.js";
import { hierarchy, zoom as d3zoom } from "d3";

import useD3 from "../../hooks/useD3";
import { initPIXI, initNodeGraphics } from "../../common/init";
import { drawArrow, drawNode, colorToHex } from "../../common/draw";
import { tree as d3Tree } from "d3";

import { Graph } from "../../common/graphs";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import CheckIcon from "@material-ui/icons/Check";

import {
  setSelectedNode,
  setEmptySelection,
  selectionSelector,
} from "../../store/selection/selectionSlice";
import { graphSelector } from "../../store/graph/graphSlice";
import {
  optionsSelector,
  toggleAllNodes,
  toggleSubsumedNodes,
} from "../../store/options/optionsSlice";

export default function GraphSplit(
  props: GraphSplitProps
): React.FunctionComponentElement<GraphSplitProps> {

  const dispatch = useDispatch();

  const graphState = useSelector(graphSelector);
  const selectionState = useSelector(selectionSelector);
  const optionsState = useSelector(optionsSelector);

  const [requested, setRequested] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [pixiContext, setPIXIContext] = useState<PIXIContext | null>(null);
  const [localGraph, setLocalGraph] = useState<GraphType | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<Position>({
    x: null,
    y: null,
  });

  const render = (stage: Container, renderer: AbstractRenderer): () => void => {
    return () => {
      setRequested(null);

      renderer.render(stage);
    };
  };

  const requestRender = (stage: Container, renderer: AbstractRenderer): void => {
    if (requested) return;
    setRequested(requestAnimationFrame(render(stage, renderer)));
  };

  const onBackgroundClick = () => {
    dispatch(setEmptySelection());
  };

  const onNodeClick = (node: Node) => {
    if (selectionState.node && node.name == selectionState.node.name) {
      dispatch(setEmptySelection());
    } else {
      dispatch(setSelectedNode(node));
    }
  };

  const onHover = (node: Node) => {
    setHoveredNode(node);
  };

  const onOut = () => {
    setHoveredNode(null);
  };

  const onRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuPos({
      x: event.clientX - 2,
      y: event.clientY - 4,
    });
  };

  const onMenuSelection = (action: string) => {
    switch(action) {
      case "all":

      break;
      case "nothing":
      default: break;
    }
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

        const midpoint = new Point(width / 2, height / 2);

        const {superStage, stage, renderer, ticker, links} = initPIXI(
          width,
          height,
          onBackgroundClick
        );

        const onPosOrScaleChange = () => {
          requestRender(superStage, renderer);
        };

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


        customGraph.nodes.forEach((node: Node) => {
          initNodeGraphics(stage, superStage , node, onNodeClick, onHover, onOut);
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
        setLocalGraph(customGraph);

        const viewBounds = superStage.getBounds();
        const graphBounds = stage.getBounds();
        const padding = 100;
        const MAX_NODES = 200;

        const dHeight = (customGraph.nodes.length <= MAX_NODES)
          ? (viewBounds.height - padding) / graphBounds.height
          : (viewBounds.height - padding) / graphBounds.width;

        if (customGraph.nodes.length > MAX_NODES) {
          stage.rotation = -(Math.PI / 2);
        } else {
          stage.rotation = Math.PI;
        }

        stage.position = new ObservablePoint(onPosOrScaleChange, null, midpoint.x, height - padding);
        stage.scale = new ObservablePoint(onPosOrScaleChange, null, stage.scale.x, stage.scale.y);
        stage.scale.set(dHeight, dHeight);

        div.selectAll("*").remove();
        (div.node() as HTMLDivElement).appendChild(renderer.view);

        const zoom = d3zoom<HTMLCanvasElement, unknown>().on("zoom", (event) => {
          const { x, y, k } = event.transform.translate(midpoint.x, height - padding).scale(dHeight);
          stage.position.set(x, y);
          stage.scale.set(k, k);
          requestRender(superStage, renderer);
        });

        div.selectAll<HTMLCanvasElement, unknown>("canvas").call(zoom);

        requestRender(superStage, renderer);
      }
    }, [graphState]);

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;

      if (localGraph) {
        if (selectionState.oldNode) {
          const { gfx, text, color } = selectionState.oldNode;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xffffff);
        }

        if (selectionState.node && selectionState.node) {
          const { gfx, text, color } = selectionState.node;
          const bounds = text.getLocalBounds(new Rectangle());
          drawNode(gfx, bounds, colorToHex(color), 0xb4e6a4);
        }

        if (selectionState.parents) {
          selectionState.parents.forEach((n) => {
            if (n) {
              const { gfx, text, color } = n;
              const bounds = text.getLocalBounds(new Rectangle());
              drawNode(gfx, bounds, colorToHex(color), 0xde9dff);
            }
          });
        }

        if (selectionState.oldParents) {
          selectionState.oldParents.forEach((n) => {
            if (n) {
              const { gfx, text, color } = n as Node;
              const bounds = text.getLocalBounds(new Rectangle());
              drawNode(gfx, bounds, colorToHex(color), 0xffffff);
            }
          });
        }
      }
      requestRender(superStage, renderer);
    }
    //eslint-disable-next-line
  }, [selectionState, pixiContext]);

  useEffect(() => {
    if (pixiContext && localGraph) {
      pixiContext.links.clear();

      localGraph.edges.forEach((edge) => {
        const { source, target } = edge;
        pixiContext.links.lineStyle(selectionState.path && selectionState.path.includes(edge)
          ? 1.5
          : 0.5,
          selectionState.path && selectionState.path.includes(edge)
          ? 0xde9dff
          : colorToHex(edge.color)
        );
        drawArrow(pixiContext.links, source, target, edge.label);
        pixiContext.links.closePath();
      });
    }
  }, [selectionState, localGraph, pixiContext]);

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;
      requestRender(superStage, renderer);
    }
    //eslint-disable-next-line
  }, [pixiContext, hoveredNode]);

  useEffect(() => {
    if (pixiContext) {
      const { superStage, renderer } = pixiContext;
      const size = props.size;

      renderer.view.width = size.width;
      renderer.view.height = size.height;
      renderer.resize(size.width, size.height);
      requestRender(superStage, renderer);
    }
    //eslint-disable-next-line
  }, [props.size, pixiContext]);

  useEffect(() => {
    const options = optionsState[props.index];
    if (graphState && pixiContext && options) {
      const {graphLibGraph, subsumedEdges, hierarchyGraph } = graphState;
      const {stage, superStage, links, renderer } = pixiContext;

      if (!options.showSubsumedNodes) {
        const hierarchyTree = hierarchy(getGraphNoSubsumed(hierarchyGraph));

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());
        console.log(customGraph);

        {/* stage.clear(); */}
        stage.removeChildren();
        links.clear();
        links.removeChildren();
        stage.addChild(links);

        customGraph.nodes.forEach((node: Node) => {
          initNodeGraphics(stage, superStage , node, onNodeClick, onHover, onOut);
        });


        customGraph.edges.forEach((edge: Edge) => {
          console.log("Drawing edge", edge);
          const { source, target } = edge;
          links.lineStyle(
            0.5,
            edge.subsume ? colorToHex("gray") : colorToHex("black")
          );
          drawArrow(links, source, target, edge.label);
          links.closePath();
        });

        const viewBounds = superStage.getBounds();
        const graphBounds = stage.getBounds();
        const padding = 100;
        const MAX_NODES = 200;

        const dHeight = (customGraph.nodes.length <= MAX_NODES)
          ? (viewBounds.height - padding) / graphBounds.height
          : (viewBounds.height - padding) / graphBounds.width;

        if (customGraph.nodes.length > MAX_NODES) {
          stage.rotation = -(Math.PI / 2);
        } else {
          stage.rotation = Math.PI;
        }
        stage.scale.set(dHeight, dHeight);

        setLocalGraph(customGraph);
      }

      if (options.showAllNodes) {
        const hierarchyTree = hierarchy(hierarchyGraph);

        const nodeSize: [number, number] = (hierarchyTree.descendants.length > 200)
          ? [300, 300]
          : [50, 75];
        const tree = d3Tree<HierarchyGraph>().nodeSize(nodeSize)(hierarchyTree);
        const customGraph = new Graph(tree, graphLibGraph, graphLibGraph.edges());
        console.log(customGraph);

        stage.removeChildren();
        links.clear();
        links.removeChildren();
        stage.addChild(links);

        graphLibGraph.nodes().forEach((n) => {
          if (!customGraph.node(n)) {
            customGraph.addGraphLibNode(n);
          }
        });

        subsumedEdges.forEach((edge: [GraphLibEdge, CubicleEdge]) => {
          customGraph.addDechargedEdge(edge);
        });

        customGraph.nodes.forEach((node: Node) => {
          initNodeGraphics(stage, superStage , node, onNodeClick, onHover, onOut);
        });


        customGraph.edges.forEach((edge: Edge) => {
          console.log("Drawing edge", edge);
          const { source, target } = edge;
          links.lineStyle(
            0.5,
            edge.subsume ? colorToHex("gray") : colorToHex("black")
          );
          drawArrow(links, source, target, edge.label);
          links.closePath();
        });

        {/* const viewBounds = superStage.getBounds();
        const graphBounds = stage.getBounds();
        const padding = 100;
        const MAX_NODES = 200;

        const dHeight = (customGraph.nodes.length <= MAX_NODES)
          ? (viewBounds.height - padding) / graphBounds.height
          : (viewBounds.height - padding) / graphBounds.width;

        if (customGraph.nodes.length > MAX_NODES) {
          stage.rotation = -(Math.PI / 2);
        } else {
          stage.rotation = Math.PI;
        }
        stage.scale.set(dHeight, dHeight); */}

        setLocalGraph(customGraph);
      }

      requestRender(superStage, renderer);
    }
  //eslint-disable-next-line
  }, [optionsState, graphState, props.index, pixiContext]);

  return (
    <div onContextMenu={onRightClick} style={{height: "100%"}}>
      <div style={{height: "100%"}} ref={ref}/>
      {optionsState[props.index] &&
      <Menu
        keepMounted
        open={contextMenuPos.y !== null}
        onClose={onMenuSelection("nothing")}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuPos.x && contextMenuPos.y
          ? {top: contextMenuPos.y, left: contextMenuPos.x}
          : undefined
        }
      >
        <MenuItem onClick={() => {
          dispatch(toggleAllNodes(props.index));
          setContextMenuPos({x: null, y: null});
        }}>
          <Icon>
            {optionsState[props.index].showAllNodes &&
              <CheckIcon />}
          </Icon>
          Display all nodes
        </MenuItem>
        <MenuItem onClick={onMenuSelection("approx")}>
          <Icon>
            {optionsState[props.index].showApproxNodes &&
              <CheckIcon />}
          </Icon>
          Display Approx. nodes
        </MenuItem>
        <MenuItem onClick={onMenuSelection("invariant")}>
          <Icon>
            {optionsState[props.index].showInvariantNodes &&
              <CheckIcon />}
          </Icon>
          Display Invariant nodes
        </MenuItem>
        <MenuItem onClick={() => {
          dispatch(toggleSubsumedNodes(props.index));
          setContextMenuPos({x: null, y: null});
        }}>
          <Icon>
            {optionsState[props.index].showSubsumedNodes &&
              <CheckIcon />}
          </Icon>
          Display Subsumed nodes
        </MenuItem>
      </Menu>
    }
    </div>
  );
}
