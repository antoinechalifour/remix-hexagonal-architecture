import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { json, redirect } from "remix";
import {
  commitSession,
  isAuthenticatedSession,
} from "~/application/remix/sessions";
import { sessionFromCookies } from "~/application/remix/http";

export class LoadLoginPage {
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
