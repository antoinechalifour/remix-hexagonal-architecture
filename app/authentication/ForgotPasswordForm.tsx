import { useFetcher } from "@remix-run/react";

import { PageTitle } from "front/ui/PageTitle";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

export const ForgotPasswordForm = () => {
  const resetPassword = useFetcher();

  return (
    <resetPassword.Form method="post" className="my-8 grid gap-4">
      <PageTitle className="mb-8">Forgot your password?</PageTitle>

      {resetPassword.type === "done" && (
        <p className="my-8 rounded-2xl border-2 border-primary bg-primary-lighter p-4 text-inverse">
          If an account is link to this email address, an email will be sent
          shortly.
        </p>
      )}

      <FloatingLabelInput
        name="email"
        label="Email address"
        type="email"
        required
      />

      <ButtonPrimary className="mx-auto mt-4" type="submit">
        Reset my password
      </ButtonPrimary>
    </resetPassword.Form>
  );
};
