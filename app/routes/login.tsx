import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { RemixAppContext } from "web";

import { LoginForm } from "front/components/LoginForm";

export const meta: MetaFunction = () => ({
  title: "TLM | Login",
});

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.login(args);

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.login(args);

export default function LoginPage() {
  return <LoginForm />;
}
