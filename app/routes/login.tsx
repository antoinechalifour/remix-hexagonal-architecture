import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { RemixAppContext } from "shared";
import { componentCss } from "web/remix/styling";
import { links as loginFormLinks, LoginForm } from "web/components/LoginForm";

export const meta: MetaFunction = () => ({
  title: "TLM | Login",
});

export const links = componentCss(...loginFormLinks());

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.loginPage.run(args);

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.login.run(args);

export default function LoginPage() {
  return <LoginForm />;
}
