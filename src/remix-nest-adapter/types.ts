import { ActionFunction, LoaderFunction } from "remix";

export type MakeRemixContext<Actions, Loaders> = {
  actions: {
    [key in keyof Actions]: ActionFunction;
  };
  loaders: {
    [key in keyof Loaders]: LoaderFunction;
  };
};
