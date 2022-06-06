import * as React from "react";
import { Link } from "@remix-run/react";

export const RootLayout = ({
  children,
  authenticated,
}: React.PropsWithChildren<{ authenticated: boolean }>) => (
  <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-darker">
    <header className="sticky top-0 z-10 bg-dark py-2 font-semibold text-lighter shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3">
        <Link to="/">
          <img
            src="/assets/images/todos-white.svg"
            alt="Todos"
            className="w-[75px]"
          />
        </Link>

        {authenticated && <Link to="/logout">Logout</Link>}
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl py-2 px-3  pb-20">
      {children}
    </main>
  </div>
);
