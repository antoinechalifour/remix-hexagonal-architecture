import * as React from "react";
import { Link } from "remix";

export const RootLayout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-darker">
    <header className="sticky top-0 bg-dark py-6 font-semibold text-lighter shadow-lg">
      <div className="mx-auto max-w-5xl px-6">
        <Link to="/">Todo List Manager</Link>
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl p-6">{children}</main>
  </div>
);
