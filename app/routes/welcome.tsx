import type { MetaFunction } from "remix";

import { Welcome } from "front/authentication/Welcome";

export const meta: MetaFunction = () => ({
  title: "TLM | Welcome",
});

export default Welcome;
