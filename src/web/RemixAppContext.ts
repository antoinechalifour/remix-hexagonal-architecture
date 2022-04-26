import { Actions } from "./Actions";
import { Loaders } from "./Loaders";
import { MakeRemixContext } from "remix-nest-adapter";

export type RemixAppContext = MakeRemixContext<Actions, Loaders>;
