/**
 * src/types/Graph.ts
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
import type { Text, Graphics } from "../common/pixi";
import type { Node as CubicleNode, Edge as CubicleEdge } from "./CubicleGraph";
import type { Graph } from "../common/graphs";

/**
* HierarchyGraph.
*
* This is a recursively defined graph.
*/
export interface HierarchyGraph {
  /**
   * @type {string} The name of the node.
   */
  name: string;
  /**
   * @type {CubicleNode} The data of the node.
   */
  data: CubicleNode;
  /**
   * @type {HierarchyGraph[]} The children of the node.
   */
  children?: HierarchyGraph[]
}

/**
 * Node.
 */
export interface Node {
  /**
   * @type {string} The name of the node.
   */
  name: string;
  /**
   * @type {string} The label of the node.
   */
  label: string;
  /**
   * @type {string} The color (named) of the node.
   */
  color: string;
  /**
   * @type {number} The x coordinate of the node.
   */
  x: number;
  /**
   * @type {number} The y coordinate of the node.
   */
  y: number;
  /**
   * @type {Text} The Text object fro the label of the node.
   */
  text: Text;
  /**
   * @type {Graphics} The graphics where the node is displayed.
   */
  gfx: Graphics;
  /**
   * @type {Node[]} The children of the node.
   */
  children?: Node[];
  /**
   * @type {number} The y target corrdinate for the drawn edges.
   */
  target_y?: number;
  /**
   * @type {Graph} The graphlib graph that the node originate from.
   */
  graph: Graph;
}

/**
 * Edge.
 *
 * @extends {CubicleEdge}
 */
export interface Edge extends CubicleEdge {
  /**
   * @type {Node} The source node of the edge.
   */
  source: Node;
  /**
   * @type {Node} The target node of the edge.
   */
  target: Node;
}

