/*
 * src/types/CubicleGraph.ts
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


/**
 * Node.
 */
export interface Node {
  /**
   * @type {string}
   */
  color: string;
  /**
   * @type {string}
   */
  label?: string;
  /**
   * @type {string}
   */
  shape?: string;
  /**
   * @type {string}
   */
  fontcolor?: string;
  /**
   * @type {string}
   */
  fontsize?: string;
  /**
   * @type {string}
   */
  style?: string;
  /**
   * @type {string}
   */
  fillcolor?: string;
  /**
   * @type {string}
   */
  orig?: string;
  /**
   * @type {string}
   */
  approx?: string;
  /**
   * @type {string}
   */
  invariant?: string;
  /**
   * @type {string}
   */
  subsumed?: string;
  /**
   * @type {string}
   */
  unsafe?: string;
  /**
   * @type {string}
   */
  error?: string;
}

/**
 * Edge.
 */
export interface Edge {
  /**
   * @type {string}
   */
  color: string;
  /**
   * @type {string}
   */
  penwidth: string;
  /**
   * @type {string}
   */
  fontname: string;
  /**
   * @type {string}
   */
  label?: string;
  /**
   * @type {string}
   */
  style?: string;
  /**
   * @type {string}
   */
  arrowhead?: string;
  /**
   * @type {string}
   */
  constraint?: string;
  /**
   * @type {string}
   */
  dir?: string;
  /**
   * @type {string}
   */
  pencolor?: string;
  /**
   * @type {string}
   */
  fontcolor?: string;
  /**
   * @type {string}
   */
  subsume?: string;
  /**
   * @type {string}
   */
  candidate?: string;
  /**
   * @type {string}
   */
  error?: string;
}
