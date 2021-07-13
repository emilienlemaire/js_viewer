import React from "react";

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
