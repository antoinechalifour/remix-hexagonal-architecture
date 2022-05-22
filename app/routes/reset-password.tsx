import { PageTitle } from "front/ui/PageTitle";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import type { ActionFunction } from "remix";
import { useLocation } from "remix";

export const action: ActionFunction = async (args) => {
  console.log(await args.request.formData());

  return null;
};

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
        />

        <ButtonPrimary className="mt-4" type="submit">
          Set new password
        </ButtonPrimary>
      </resetPassword.Form>
    </div>
  );
}
