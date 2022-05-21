import React from "react";
import classNames from "classnames";

type PageTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageTitle = ({ children, className }: PageTitleProps) => (
  <h1 className={classNames("text-2xl font-semibold text-lighter", className)}>
    {children}
  </h1>
);
