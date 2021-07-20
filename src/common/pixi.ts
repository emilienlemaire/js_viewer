/**
 * src/common/pixi.ts
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
 * @file This enables us to have all the PIXIjs objects we need to be imported from one place.
 */
/** @module common/pixi */
export * from '@pixi/constants';
export * from '@pixi/math';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
import * as utils from '@pixi/utils';
export { utils };
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/sprite';
export * from '@pixi/graphics';
export * from '@pixi/text';
export * from '@pixi/interaction';

// Renderer plugins
import { Renderer } from '@pixi/core';
import { BatchRenderer } from '@pixi/core';
Renderer.registerPlugin('batch', BatchRenderer);
import { InteractionManager } from '@pixi/interaction';
Renderer.registerPlugin('interaction', InteractionManager);
