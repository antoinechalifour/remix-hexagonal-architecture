import type { DataFunctionArgs } from "@remix-run/node";

import { json, redirect } from "remix";
import { commitSession, isAuthenticatedSession } from "../sessions";
import { sessionFromCookies } from "../http";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginPageLoader {
  async run({ request }: DataFunctionArgs) {
    const session = await sessionFromCookies(request);

    if (isAuthenticatedSession(session)) return redirect("/");

    const error = session.get("error");

    return json(
      { error },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}
