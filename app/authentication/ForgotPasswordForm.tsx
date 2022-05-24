import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";
import { Notification } from "front/authentication/Notification";

export const ForgotPasswordForm = () => {
  const resetPassword = useFetcher();

  return (
    <FormCard title="Forgot your password?">
      <resetPassword.Form method="post" className="grid gap-4">
        {resetPassword.type === "done" && (
          <Notification>
            If an account is link to this email address, an email will be sent
            shortly.
          </Notification>
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
