import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RemixAppContext } from "web";

import { VerifyAccount } from "front/authentication/VerifyAccount";
import { VerifyAccountError } from "front/authentication/VerifyAccountError";

export const meta: MetaFunction = () => ({
  title: "Todos | Verifying your account...",
});

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.verifyAccount(args);

export default VerifyAccount;
export const CatchBoundary = VerifyAccountError;
