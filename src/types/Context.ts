/**
 * src/types/Context.ts
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
import type {
  Container,
  AbstractRenderer,
  Ticker,
  Graphics,
} from "../common/pixi";

/**
 * PIXIContext.
 */
export interface PIXIContext {
  /**
   * @type {Container} The global container for this context.
   */
  superStage: Container;
  /**
   * @type {Container} The graph container for this context.
   */
  stage: Container;
  /**
   * @type {AbstractRenderer} The renderer of this context.
   */
  renderer: AbstractRenderer;
  /**
   * @type {Ticker} The clock of this context.
   */
  ticker: Ticker;
  /**
   * @type {Graphics} The graphics for the edges of this context.
   */
  links: Graphics;
}

