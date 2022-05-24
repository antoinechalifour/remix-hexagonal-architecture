import { useFetcher } from "@remix-run/react";
import { useLocation } from "remix";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";

export const ResetPasswordForm = () => {
  const resetPassword = useFetcher();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <FormCard title="Reset your password">
      <resetPassword.Form method="post" className="grid gap-4">
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
          inputProps={{
            type: "password",
            required: true,
            minLength: 8,
            maxLength: 64,
            autoComplete: "new-password",
          }}
        />

        <FloatingLabelInput
          name="password-confirmation"
          label="Confirm your new password"
          inputProps={{
            type: "password",
            required: true,
            minLength: 8,
            maxLength: 64,
            autoComplete: "new-password",
          }}
        />

        <ButtonPrimary type="submit">Set new password</ButtonPrimary>
      </resetPassword.Form>
    </FormCard>
  );
};
