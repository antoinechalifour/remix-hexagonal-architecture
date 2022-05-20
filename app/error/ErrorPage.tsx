import React from "react";

export const ErrorPage: React.FC = ({ children }) => (
  <div className="my-24 grid gap-6 text-center">{children}</div>
);

export const ErrorPageHero: React.FC = ({ children }) => (
  <h1 className="text-9xl">{children}</h1>
);

export const ErrorPageMessage: React.FC = ({ children }) => <p>{children}</p>;
