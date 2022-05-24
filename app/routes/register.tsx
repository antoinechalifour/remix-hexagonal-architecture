import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";
import type { RemixAppContext } from "web";
import { RegisterForm } from "front/authentication/RegisterForm";

export const meta: MetaFunction = () => ({
  title: "TLM | Register",
});

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.register(args);

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.register(args);

export default RegisterForm;
