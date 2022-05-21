import type { LoaderFunction, MetaFunction } from "remix";
import type { RemixAppContext } from "web";

import { VerifyAccount } from "front/verify-account/VerifyAccount";
import { VerifyAccountError } from "front/verify-account/VerifyAccountError";

export const meta: MetaFunction = () => ({
  title: "TLM | Verifying your account...",
});

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.verifyAccount(args);

export default VerifyAccount;
export const CatchBoundary = VerifyAccountError;
