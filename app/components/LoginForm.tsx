import type { AuthenticationErrorDto } from "shared";
import { Form, useLoaderData } from "remix";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { PageTitle } from "front/ui/PageTitle";

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();

  return (
    <Form method="post" className="my-8 grid gap-4">
      <PageTitle>Welcome back</PageTitle>

      {loaderData?.error && (
        <p className="my-8 rounded-2xl border-2 border-danger bg-danger-lighter p-4 text-inverse">
          {loaderData.error}
        </p>
      )}

      <FloatingLabelInput name="username" label="Email address" />
      <FloatingLabelInput name="password" label="Password" type="password" />

      <ButtonPrimary>Login</ButtonPrimary>
    </Form>
  );
};
