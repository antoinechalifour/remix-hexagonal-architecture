import type { ActionFunction } from "remix";
import type { RemixAppContext } from "web";

import { ResetPasswordForm } from "front/authentication/ResetPasswordForm";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.resetPassword(args);

export default ResetPasswordForm;
