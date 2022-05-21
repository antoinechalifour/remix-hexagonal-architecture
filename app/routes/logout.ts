import type { LoaderFunction } from "remix";
import type { RemixAppContext } from "web";

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.logout(args);
