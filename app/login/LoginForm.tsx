import type { AuthenticationErrorDto } from "shared/client";
import type { Transition } from "@remix-run/react/transition";

import { Form, Link, useActionData, useLoaderData, useTransition } from "remix";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary, ButtonSecondary } from "front/ui/Button";
import { PageTitle } from "front/ui/PageTitle";

type LoginFormErrors = {
  errors: {
    email: string;
    password: string;
  };
};

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();
  const actionData = useActionData<LoginFormErrors>();
  const submitting = getSubmittingState(useTransition());

  const submitButtonsProps = {
    type: "submit" as const,
    disabled: submitting != null,
    className: "flex-1",
  };

  return (
    <Form method="post" className="my-8 grid gap-4">
      <PageTitle>Welcome (back?)</PageTitle>

      {loaderData?.error && (
        <p className="my-8 rounded-2xl border-2 border-danger bg-danger-lighter p-4 text-inverse">
          {loaderData.error}
        </p>
      )}

      <FloatingLabelInput
        name="email"
        label="Email address"
        type="email"
        required
        errorMessage={actionData?.errors.email}
      />
      <FloatingLabelInput
        name="password"
        label="Password"
        type="password"
        required
        errorMessage={actionData?.errors.password}
      />

      <div>
        <Link to="/forgot-password" className="-mt-1 mb-4 text-sm underline">
          Forgot your password?
        </Link>
      </div>

      <div className="flex flex-row-reverse gap-4">
        <ButtonPrimary {...submitButtonsProps} name="login">
          {submitting === "login" ? (
            <UpdateIcon className="mx-auto animate-spin" />
          ) : (
            "Login"
          )}
        </ButtonPrimary>
        <ButtonSecondary {...submitButtonsProps} name="register">
          {submitting === "register" ? (
            <UpdateIcon className="mx-auto animate-spin" />
          ) : (
            "Register"
          )}
        </ButtonSecondary>
      </div>
    </Form>
  );
};

function getSubmittingState(
  transition: Transition
): null | "register" | "login" {
  if (transition.state !== "submitting") return null;

  return transition.submission.formData.has("register") ? "register" : "login";
}
