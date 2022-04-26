import { ActionFunction, LoaderFunction } from "remix";

export * from "./RemixModule";
export * from "./RemixNestBuildConfig";
export * from "./keys";

export type MakeRemixContext<Actions, Loaders> = {
  actions: {
    [key in keyof Actions]: ActionFunction;
  };
  loaders: {
    [key in keyof Loaders]: LoaderFunction;
  };
};
