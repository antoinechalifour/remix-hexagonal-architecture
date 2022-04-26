import { DataFunctionArgs } from "@remix-run/node";
import { getSession, isAuthenticatedSession } from "../../web/sessions";
import { redirect } from "remix";

export const Authenticated =
  (): MethodDecorator =>
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: DataFunctionArgs) {
      const session = await getSession(args.request.headers.get("Cookie"));

      if (!isAuthenticatedSession(session)) throw redirect("/login");
      return originalMethod.apply(this, [args]);
    };

    return descriptor;
  };
