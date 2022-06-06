import type { MetaFunction } from "@remix-run/node";

import { Welcome } from "front/authentication/Welcome";

export const meta: MetaFunction = () => ({
  title: "Todos | Welcome",
});

export default Welcome;
