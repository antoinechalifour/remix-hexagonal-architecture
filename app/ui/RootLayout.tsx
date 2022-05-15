import * as React from "react";
import { Link } from "remix";

export const RootLayout = ({
  children,
  authenticated,
}: React.PropsWithChildren<{ authenticated: boolean }>) => (
  <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-darker">
    <header className="sticky top-0 z-10 bg-dark py-4 font-semibold text-lighter shadow-lg sm:py-6">
      <div className="mx-auto flex max-w-5xl justify-between px-3">
        <Link to="/">Todo List Manager</Link>

        {authenticated && <Link to="/logout">Logout</Link>}
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl py-2 px-3">{children}</main>
  </div>
);
