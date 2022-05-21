import type { LoaderFunction } from "remix";
import type { RemixAppContext } from "web";
import { useCatch } from "remix";

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.verifyAccount(args);

export default function VerifyAccount() {
  return <div>Account verified !</div>;
}

export function CatchBoundary() {
  const error = useCatch();

  console.log(error);

  return <div>Failed</div>;
}
