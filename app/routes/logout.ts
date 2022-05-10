import { LoaderFunction } from "remix";
import { RemixAppContext } from "web";

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.logout(args);

export default function LogoutPage() {
  return null;
}
