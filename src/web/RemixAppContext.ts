import { ActionFunction, LoaderFunction } from "remix";
import { Actions } from "./Actions";
import { Loaders } from "./Loaders";

export type RemixAppContext = {
  actions: {
    [key in keyof Actions]: ActionFunction;
  };
  loaders: {
    [key in keyof Loaders]: LoaderFunction;
  };
};
