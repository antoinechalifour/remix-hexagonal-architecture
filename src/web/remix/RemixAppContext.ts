import { Actions } from "./Actions";
import { Loaders } from "./Loaders";
import { MakeRemixContext } from "./types";

export type RemixAppContext = MakeRemixContext<Actions, Loaders>;
