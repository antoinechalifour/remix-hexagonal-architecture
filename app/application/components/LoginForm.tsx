import { Form, useLoaderData } from "remix";
import {
  FloatingLabelInput,
  links as floatingLabelInputLinks,
} from "~/application/ui/FloatingLabelInput";
import {
  ButtonPrimary,
  links as buttonPrimaryLinks,
} from "~/application/ui/Button";
import { links as pageTitleLinks, PageTitle } from "~/application/ui/PageTitle";
import { componentCss, link } from "~/application/remix/styling";
import { AuthenticationReadModel } from "~/application/authentication/AuthenticationReadModel";
import css from "./LoginForm.css";

export const links = componentCss(
  ...floatingLabelInputLinks(),
  ...buttonPrimaryLinks(),
  ...pageTitleLinks(),
  link(css)
);

export const LoginForm = () => {
  const loaderData = useLoaderData<AuthenticationReadModel>();

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
