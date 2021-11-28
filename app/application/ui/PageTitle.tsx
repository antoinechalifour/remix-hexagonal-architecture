import React from "react";
import { componentCss, link } from "../remix";
import css from "./PageTitle.css";

export const links = componentCss(link(css));

export const PageTitle: React.FC = ({ children }) => (
  <h1 className="PageTitle">{children}</h1>
);
