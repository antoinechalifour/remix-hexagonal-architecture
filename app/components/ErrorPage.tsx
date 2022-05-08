import React from "react";

export type ErrorComponentProps = { children: React.ReactNode };

export const ErrorPage = ({ children }: ErrorComponentProps) => (
  <div className="my-24 grid gap-6 text-center">{children}</div>
);

export const ErrorPageHero = ({ children }: ErrorComponentProps) => (
  <h1 className="text-9xl">{children}</h1>
);

export const ErrorPageMessage = ({ children }: ErrorComponentProps) => (
  <p>{children}</p>
);
