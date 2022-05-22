import type { ActionFunction } from "remix";
import type { RemixAppContext } from "web";

import { useCatch } from "remix";
import { ResetPasswordForm } from "front/authentication/ResetPasswordForm";
import { PageTitle } from "front/ui/PageTitle";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.resetPassword(args);

export default ResetPasswordForm;

export const CatchBoundary = () => {
  const error = useCatch();

  return (
    <div>
      <PageTitle>Your password could not be reset</PageTitle>

      <p className="mt-8">{error.data.message}</p>
    </div>
  );
};
