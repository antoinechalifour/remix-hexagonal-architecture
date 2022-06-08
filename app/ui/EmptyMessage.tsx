import type { ReactNode } from "react";
import React from "react";
import classNames from "classnames";

export type EmptyMessageProps = { children: ReactNode; className?: string };
export const EmptyMessage = ({ children, className }: EmptyMessageProps) => (
  <p
    className={classNames(
      "my-4 rounded-2xl bg-dark py-4 px-8 shadow",
      className
    )}
  >
    {children}
  </p>
);
