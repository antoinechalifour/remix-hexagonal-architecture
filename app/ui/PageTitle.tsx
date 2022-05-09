import React from "react";

export type PageTitleProps = { children: React.ReactNode };

export const PageTitle = ({ children }: PageTitleProps) => (
  <h1 className="text-2xl font-semibold text-lighter">{children}</h1>
);
