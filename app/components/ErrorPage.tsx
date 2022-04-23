import React from "react";
import { componentCss, link } from "../stylesheet";
import css from "./ErrorPage.css";

export const links = componentCss(link(css));

export const ErrorPage: React.FC = ({ children }) => (
  <div className="ErrorPage">{children}</div>
);

export const ErrorPageHero: React.FC = ({ children }) => (
  <h1 className="ErrorPageHero">{children}</h1>
);

export const ErrorPageMessage: React.FC = ({ children }) => (
  <p className="ErrorPageMessage">{children}</p>
);
