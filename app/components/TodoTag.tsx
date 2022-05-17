import type { ReactNode } from "react";
import React from "react";
import classNames from "classnames";

export type TodoTagProps = { children: ReactNode; className?: string };
export const TodoTag = ({ children, className }: TodoTagProps) => (
  <span
    className={classNames(
      "rounded bg-sky-100 py-1 px-2 font-mono text-xs text-sky-700",
      className
    )}
  >
    {children}
  </span>
);
