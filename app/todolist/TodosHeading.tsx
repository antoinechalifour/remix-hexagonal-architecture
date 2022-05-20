import React from "react";

export type TodosHeadingProps = { title: string; filterLabel: string | number };

export const TodosHeading = ({ title, filterLabel }: TodosHeadingProps) => (
  <h2 className="flex items-center text-lg text-lighter">
    {title} <span className="ml-2 text-sm text-light">({filterLabel})</span>
  </h2>
);
