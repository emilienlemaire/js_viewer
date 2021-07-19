/**
 * src/types/Props.ts
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
import type { Size } from "./Common";

/**
 * GraphProps.
 */
export interface GraphProps {
  /**
   * @type {string} The className for the styling of the component.
   */
  className: string;
}

/**
 * DropzoneProps.
 */
export interface DropzoneProps {
  /**
   * @type {boolean} Is the modal dispayed or not.
   */
  show: boolean;
}

/**
 * MenuProps.
 */
export interface MenuProps {
  /**
   * @type {string} The className for the styling of the component.
   */
  className: string;
}

/**
 * ContextMenuProps.
 */
export interface ContextMenuProps {
  /**
   * @type {number} The index of the context menu split.
   */
  index: number;
  /**
   * @type {number | null} The x coordinate of the context menu. If null the menu is not shown.
   */
  x: number | null;
  /**
   * @type {number | null} The y coordinates of the context menu. If null the menu is not shown.
   */
  y: number | null;
}

/**
 * GraphSplitProps.
 */
export interface GraphSplitProps {
  /**
   * @type {Size} The size of the graph split.
   */
  size: Size;
  /**
   * @type {number} The index of the graph split.
   */
  index: number;
  /**
   * @type {() => void} Callback when the split is closed.
   */
  onClose: () => void;
}

