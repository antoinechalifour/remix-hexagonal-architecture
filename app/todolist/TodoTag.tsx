import React from "react";
import classNames from "classnames";
import { colorFromString } from "front/palette";

export type TodoTagProps = { children: string; className?: string };

export const TodoTag = ({ children, className }: TodoTagProps) => (
  <span
    className={classNames(
      "truncate rounded py-1 px-2 font-mono text-xs font-bold",
      colorFromString(children),
      className
    )}
  >
    {children}
  </span>
);
