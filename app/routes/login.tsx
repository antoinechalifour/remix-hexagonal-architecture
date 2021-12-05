import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { container } from "~/container";
import { componentCss } from "~/application/remix/styling";
import { LoginAction } from "~/application/actions/LoginAction";
import { LoadLoginPage } from "~/application/authentication/LoadLoginPage";
import {
  links as loginFormLinks,
  LoginForm,
} from "~/application/components/LoginForm";

export const meta: MetaFunction = () => ({
  title: "TLM | Login",
});

export const links = componentCss(...loginFormLinks());

export const loader: LoaderFunction = (context) =>
  container.build(LoadLoginPage).run(context);

export const action: ActionFunction = (context) =>
  container.build(LoginAction).run(context);

export default function LoginPage() {
  return <LoginForm />;
}
