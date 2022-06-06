import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import type { RemixAppContext } from "web";
import { RegisterForm } from "front/authentication/RegisterForm";

export const meta: MetaFunction = () => ({
  title: "Todos | Register",
});

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.register(args);

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.register(args);

export default RegisterForm;
