import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import type { RemixAppContext } from "web";

import { ResetPasswordForm } from "front/authentication/ResetPasswordForm";
import { PageTitle } from "front/ui/PageTitle";

export const meta: MetaFunction = () => ({
  title: "Todos | Reset your password",
});

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
