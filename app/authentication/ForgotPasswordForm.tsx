import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";

export const ForgotPasswordForm = () => {
  const resetPassword = useFetcher();

  return (
    <FormCard title="Forgot your password?">
      <resetPassword.Form method="post" className="grid gap-4">
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

        <ButtonPrimary type="submit">Reset my password</ButtonPrimary>
      </resetPassword.Form>
    </FormCard>
  );
};
