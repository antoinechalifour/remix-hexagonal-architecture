import type { ActionFunction, MetaFunction } from "remix";
import type { RemixAppContext } from "web";

import { PageTitle } from "front/ui/PageTitle";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { useFetcher } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "TLM | Forgot your password?",
});

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.forgotPassword(args);

export default function ForgotPassword() {
  const resetPassword = useFetcher();

  return (
    <resetPassword.Form method="post" className="my-8 grid gap-4">
      <PageTitle className="mb-8">Forgot your password?</PageTitle>

      {resetPassword.type === "done" && (
        <p className="my-8 rounded-2xl border-2 border-primary bg-primary-lighter p-4 text-inverse">
          An email containing the instructions has been sent.
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
}
