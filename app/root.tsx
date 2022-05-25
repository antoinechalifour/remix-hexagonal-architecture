import type { LinksFunction, LoaderFunction } from "remix";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from "remix";

import * as React from "react";

import styles from "./styles/app.css";
import { RootLayout } from "./ui/RootLayout";
import {
  ErrorPage,
  ErrorPageHero,
  ErrorPageMessage,
} from "front/error/ErrorPage";
import type { RemixAppContext } from "web";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.root(args);

export default function App() {
  const { authenticated } = useLoaderData<{ authenticated: boolean }>();

  return (
    <Document>
      <RootLayout authenticated={authenticated}>
        <Outlet />
      </RootLayout>
    </Document>
  );
}

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

function Document({ children, title }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/assets/images/favicon.ico" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status !== 404) throw new Error(caught.data || caught.statusText);

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <RootLayout authenticated={false}>
        <ErrorPage>
          <ErrorPageHero>404</ErrorPageHero>
          <ErrorPageMessage>
            How did you get here? Seems like you got lost...
          </ErrorPageMessage>

          <Link to="/" className="text-xl text-lighter">
            Take me home
          </Link>
        </ErrorPage>
      </RootLayout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Error!">
      <RootLayout authenticated={false}>
        <ErrorPage>
          <ErrorPageHero>😱</ErrorPageHero>
          <ErrorPageMessage>
            Something went super wrong. Don't worry it'll get fixed soon!
          </ErrorPageMessage>

          <Link to="/" className="text-xl text-lighter">
            Take me home
          </Link>
        </ErrorPage>
      </RootLayout>
    </Document>
  );
}

const RouteChangeAnnouncement = React.memo(function RouteChangeAnnouncement() {
  let [hydrated, setHydrated] = React.useState(false);
  let [innerHtml, setInnerHtml] = React.useState("");
  let location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  let firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    let pageTitle = location.pathname === "/" ? "Home page" : document.title;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    >
      {innerHtml}
    </div>
  );
});
