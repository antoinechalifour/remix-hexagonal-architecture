import React from "react";

export type ErrorMessageProps = { children: React.ReactNode };

export const EmptyMessage = ({ children }: ErrorMessageProps) => (
  <p className="my-4 rounded-2xl bg-dark py-4 px-8 shadow">{children}</p>
);
