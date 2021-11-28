import React from "react";
import { componentCss, link } from "../remix";
import css from "./EmptyMessage.css";

export const links = componentCss(link(css));

export const EmptyMessage: React.FC = ({ children }) => (
  <p className="EmptyMessage">{children}</p>
);
