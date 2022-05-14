import { MakeRemixContext } from "remix-nest-adapter";
import { Actions } from "./Actions";
import { Loaders } from "./Loaders";

export type RemixAppContext = MakeRemixContext<Actions, Loaders>;
