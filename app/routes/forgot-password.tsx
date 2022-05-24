import type { ActionFunction, MetaFunction } from "remix";
import type { RemixAppContext } from "web";
import { ForgotPasswordForm } from "front/authentication/ForgotPasswordForm";

export const meta: MetaFunction = () => ({
  title: "TLM | Forgot your password?",
});

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.forgotPassword(args);

export default ForgotPasswordForm;
