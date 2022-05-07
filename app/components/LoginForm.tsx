import type { AuthenticationErrorDto } from "shared";
import { Form, useLoaderData } from "remix";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { PageTitle } from "front/ui/PageTitle";
import { componentCss, link } from "../stylesheet";
import css from "./LoginForm.css";

export const links = componentCss(link(css));

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationErrorDto>();

  return (
    <Form method="post" className="LoginForm">
      <PageTitle>Welcome back</PageTitle>

      {loaderData?.error && (
        <p className="LoginForm__error">{loaderData.error}</p>
      )}

      <FloatingLabelInput name="username" label="Email address" />
      <FloatingLabelInput name="password" label="Password" type="password" />

      <ButtonPrimary>Login</ButtonPrimary>
    </Form>
  );
};
