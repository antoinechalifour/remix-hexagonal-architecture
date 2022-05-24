import type { AuthenticationErrorDto } from "shared/client";
import { Form, Link, useActionData, useLoaderData, useTransition } from "remix";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";
import { Notification } from "front/authentication/Notification";
import { usePasswordConfirmation } from "front/authentication/usePasswordConfirmation";

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
  const { password, confirmation, matches } = usePasswordConfirmation();

  return (
    <FormCard title="Register">
      <Form method="post" className="grid gap-4">
        {loaderData?.error && (
          <Notification level="error">{loaderData.error}</Notification>
        )}

        <FloatingLabelInput
          name="email"
          label="Email address"
          errorMessage={actionData?.errors.email}
          inputProps={{
            type: "email",
            required: true,
            autoComplete: "email",
          }}
        />

        <FloatingLabelInput
          name="password"
          label="Password"
          errorMessage={actionData?.errors.password}
          inputProps={{
            type: "password",
            minLength: 8,
            maxLength: 64,
            autoComplete: "new-password",
          }}
          inputRef={password}
        />

        <FloatingLabelInput
          name="password-confirmation"
          label="Confirm your password"
          errorMessage={!matches ? "Passwords do not match" : undefined}
          inputProps={{
            type: "password",
            required: true,
            minLength: 8,
            maxLength: 64,
            autoComplete: "new-password",
          }}
          inputRef={confirmation}
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
    </FormCard>
  );
};
