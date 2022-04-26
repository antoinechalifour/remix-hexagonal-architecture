import { DataFunctionArgs } from "@remix-run/node";
import { requireAuthentication } from "./http";

export const Authenticated =
  (): MethodDecorator =>
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: DataFunctionArgs) {
      await requireAuthentication(args.request);
      return originalMethod.apply(this, [args]);
    };

    return descriptor;
  };
