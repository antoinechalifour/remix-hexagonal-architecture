import { PageTitle } from "front/ui/PageTitle";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import type { ActionFunction } from "remix";
import { useLocation } from "remix";
import type { RemixAppContext } from "web";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.resetPassword(args);

export default function ResetPassword() {
  const resetPassword = useFetcher();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <div className="py-8">
      <PageTitle>Reset your password</PageTitle>
      <resetPassword.Form method="post" className="mt-8">
        <input
          type="hidden"
          name="email"
          value={searchParams.get("email") as string}
        />
        <input
          type="hidden"
          name="token"
          value={searchParams.get("token") as string}
        />

        <FloatingLabelInput
          name="password"
          label="Your new password"
          type="password"
          required
          minLength={8}
          maxLength={64}
        />

        <ButtonPrimary className="mt-4" type="submit">
          Set new password
        </ButtonPrimary>
      </resetPassword.Form>
    </div>
  );
}
