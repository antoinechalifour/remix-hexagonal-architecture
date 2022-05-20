import React from "react";
import classNames from "classnames";

export type TodoTagProps = { children: string; className?: string };

export const TodoTag = ({ children, className }: TodoTagProps) => (
  <span
    className={classNames(
      "truncate rounded py-1 px-2 font-mono text-xs font-bold",
      getPalette(children),
      className
    )}
  >
    {children}
  </span>
);

function getPalette(str: string) {
  const palette = [
    "bg-gradient-to-r from-teal-200 to-green-200 text-green-900",
    "bg-gradient-to-r from-indigo-200 to-sky-200 text-sky-900",
    "bg-gradient-to-r from-red-200 to-orange-200 text-orange-900",
    "bg-gradient-to-r from-fuchsia-200 to-rose-200 text-rose-900",
    "bg-gradient-to-r from-purple-200 to-indigo-200 text-indigo-900",
    "bg-gradient-to-r from-pink-200 to-yellow-200 text-yellow-900",
  ];
  const sum = str
    .split("")
    .map((letter) => letter.charCodeAt(0))
    .reduce((a, b) => a + b, 0);
  const index = sum % palette.length;

  return palette[index];
}
