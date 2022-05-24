import type { AuthenticationErrorDto } from "shared/client";
import { Form, Link, useActionData, useLoaderData, useTransition } from "remix";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";
import { Notification } from "front/authentication/Notification";

type LoginFormErrors = {
  errors: {
    email: string;
    password: string;
  };
};

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();
  const actionData = useActionData<LoginFormErrors>();
  const transition = useTransition();

  return (
    <FormCard title="Login">
      <Form method="post" className="grid gap-4">
        {loaderData?.error && (
          <Notification level="error">{loaderData.error}</Notification>
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

        <ButtonPrimary
          type="submit"
          disabled={transition.state === "submitting"}
          className="flex-1"
          name="login"
        >
          {transition.state === "submitting" ? (
            <UpdateIcon className="mx-auto animate-spin" />
          ) : (
            "Login"
          )}
        </ButtonPrimary>

        <div className="flex flex-col space-y-2 text-center sm:flex-row sm:justify-between sm:space-x-1 sm:space-y-0">
          <Link to="/forgot-password" className="text-sm underline">
            Forgot your password?
          </Link>
          <Link to="/register" className="text-sm underline">
            Don't have an account yet?
          </Link>
        </div>
      </Form>
    </FormCard>
  );
};
