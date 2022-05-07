import type { AuthenticationErrorDto } from "shared";
import { Form, useLoaderData } from "remix";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary, ButtonSecondary } from "front/ui/Button";
import { PageTitle } from "front/ui/PageTitle";

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();

  return (
    <Form method="post" className="my-8 grid gap-4">
      <PageTitle>Welcome (back?)</PageTitle>

      {loaderData?.error && (
        <p className="my-8 rounded-2xl border-2 border-danger bg-danger-lighter p-4 text-inverse">
          {loaderData.error}
        </p>
      )}

      <FloatingLabelInput name="email" label="Email address" type="email" />
      <FloatingLabelInput name="password" label="Password" type="password" />

      <div className="flex flex-row-reverse gap-4">
        <ButtonPrimary className="flex-1" name="login">
          Login
        </ButtonPrimary>
        <ButtonSecondary className="flex-1" name="register">
          Register
        </ButtonSecondary>
      </div>
    </Form>
  );
};
