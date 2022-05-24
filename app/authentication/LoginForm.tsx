import type { AuthenticationErrorDto } from "shared/client";
import { Form, Link, useActionData, useLoaderData, useTransition } from "remix";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { FormCard } from "front/authentication/FormCard";

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
      <Form method="post" className="grid  gap-4">
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

        <div className="flex justify-between space-x-1 text-center">
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
