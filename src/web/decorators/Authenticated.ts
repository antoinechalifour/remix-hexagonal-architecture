import { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix";
import { Inject } from "@nestjs/common";
import { Authenticator } from "../Authenticator";

const authenticatorKey = Symbol("authenticator");

export const Authenticated = (): MethodDecorator => {
  const injectAuthenticator = Inject(Authenticator);

  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    injectAuthenticator(target, authenticatorKey);
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: DataFunctionArgs) {
      const authenticator: Authenticator = (this as any)[authenticatorKey];
      const isAuthenticated = await authenticator.isAuthenticated();

      if (!isAuthenticated) throw redirect("/login");
      return originalMethod.apply(this, [args]);
    };

    return descriptor;
  };
};
