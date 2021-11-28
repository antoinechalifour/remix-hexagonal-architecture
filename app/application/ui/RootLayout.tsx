import * as React from "react";
import { Link } from "remix";
import { componentCss, link } from "../remix";
import css from "./RootLayout.css";

export const links = componentCss(link(css));

export const RootLayout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="RootLayout">
    <header>
      <div className="RootLayout__content">
        <Link to="/">Todo List Manager</Link>
      </div>
    </header>

    <main className="RootLayout__content">{children}</main>
  </div>
);
