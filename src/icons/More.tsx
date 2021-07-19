/**
 * src/icons/More.tsx
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
import React from "react";

/**
 * A custom More Vertical svg icon (three vertical dots)
 *
 * @param {React.SVGProps} props - Common Ract SVG props.
 * @returns {React.FunctionComponentElement<React.SVGProps<SVGSVGElement>>}
 */
function MoreVerticalIcon(
  props: React.SVGProps<SVGSVGElement>
): React.FunctionComponentElement<React.SVGProps<SVGSVGElement>> {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M13 12 A1 1 0 0 1 12 13 A1 1 0 0 1 11 12 A1 1 0 0 1 13 12 z" />
      <path d="M13 5 A1 1 0 0 1 12 6 A1 1 0 0 1 11 5 A1 1 0 0 1 13 5 z" />
      <path d="M13 19 A1 1 0 0 1 12 20 A1 1 0 0 1 11 19 A1 1 0 0 1 13 19 z" />
    </svg>
  );
}

export default MoreVerticalIcon;
