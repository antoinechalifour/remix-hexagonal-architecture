import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { redirect } from "remix";
import Joi from "joi";
import { header, validateBody } from "~/application/remix/http";
import { commitSession, getSession } from "~/application/remix/sessions";
import { LoginFlow } from "~/application/authentication/LoginFlow";

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

interface LoginActionOptions {
  loginFlow: LoginFlow;
}

export class LoginAction {
  private readonly loginFlow;

  constructor({ loginFlow }: LoginActionOptions) {
    this.loginFlow = loginFlow;
  }

  async run({ request }: DataFunctionArgs) {
    const session = await getSession(header("Cookie", request));
    const [errors, payload] = await validateBody(schema, request);

    if (errors) return { errors };

    const [error, userId] = await this.loginFlow.execute(
      payload.username,
      payload.password
    );

    let url;

    if (error) {
      session.flash("error", error.message);
      url = "/login";
    } else {
      session.set("userId", userId);
      url = "/";
    }

    return redirect(url, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}
