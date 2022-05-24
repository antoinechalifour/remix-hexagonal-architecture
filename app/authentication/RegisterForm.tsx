import type { AuthenticationErrorDto } from "shared/client";

import { Form, Link, useActionData, useLoaderData, useTransition } from "remix";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { PageTitle } from "front/ui/PageTitle";

type RegistrationFormErrors = {
  errors: {
    email: string;
    password: string;
  };
};

export const RegisterForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();
  const actionData = useActionData<RegistrationFormErrors>();
  const transition = useTransition();

  return (
    <Form
      method="post"
      className="my-8 mx-auto grid max-w-md gap-4 rounded-lg bg-dark/30 p-8 shadow-xl"
    >
      <PageTitle className="text-center">Register</PageTitle>

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
        minLength={8}
        maxLength={64}
        errorMessage={actionData?.errors.password}
      />

      <FloatingLabelInput
        name="password-confirmation"
        label="Confirm your password"
        type="password"
        required
        minLength={8}
        maxLength={64}
        errorMessage={actionData?.errors.password}
      />

      <ButtonPrimary
        type="submit"
        className="flex-1"
        disabled={transition.state === "submitting"}
        name="register"
      >
        {transition.state === "submitting" ? (
          <UpdateIcon className="mx-auto animate-spin" />
        ) : (
          "Register"
        )}
      </ButtonPrimary>

      <div className="text-right">
        <Link to="/login" className="text-sm underline">
          Already have an account?
        </Link>
      </div>
    </Form>
  );
};
