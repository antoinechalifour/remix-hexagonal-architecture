import type { DataFunctionArgs } from "@remix-run/node";

import { redirect } from "remix";
import Joi from "joi";
import { LoginApplicationService } from "authentication";
import { header, validateBody } from "../http";
import { commitSession, getSession } from "../sessions";
import { Injectable } from "@nestjs/common";

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

@Injectable()
export class LoginAction {
  constructor(
    private readonly loginApplicationService: LoginApplicationService
  ) {}

  async run({ request }: DataFunctionArgs) {
    const session = await getSession(header("Cookie", request));
    const [errors, payload] = await validateBody(schema, request);

    if (errors) return { errors };

    const [error, userId] = await this.loginApplicationService.login(
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
