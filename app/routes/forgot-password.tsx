import type { ActionFunction, MetaFunction } from "remix";

import { PageTitle } from "front/ui/PageTitle";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { useFetcher } from "@remix-run/react";
import { json } from "remix";

export const meta: MetaFunction = () => ({
  title: "TLM | Forgot your password?",
});

export const action: ActionFunction = async (args) => {
  const message = await args.request.formData();
  console.log(message);

  if (message.get("email") == "antoine.chalifour@gmail.com")
    throw json({ hello: "world" }, 400);

  return null;
};

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
