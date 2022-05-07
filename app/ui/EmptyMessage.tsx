import React from "react";

export const EmptyMessage: React.FC = ({ children }) => (
  <p className="my-4 rounded-2xl bg-dark py-4 px-8 shadow">{children}</p>
);
