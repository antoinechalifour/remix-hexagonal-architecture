import { json } from "@remix-run/node";

type ErrorCasting<T extends Error> = {
  is(err: unknown): err is T;
};
type ErrorOptions = {
  status: number;
  message?: string;
};
type ErrorMapping<T extends Error> = [ErrorCasting<T>, ErrorOptions];

export const MapErrorThrowing =
  <T extends Error>(mapping: ErrorMapping<T>[]): MethodDecorator =>
  (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        for (let [CustomErrorConstructor, options] of mapping) {
          if (CustomErrorConstructor.is(err))
            throw json(
              { message: options.message ?? err.message },
              {
                status: options.status,
              }
            );
        }
        throw err;
      }
    };
  };

export const MapErrorReturning =
  <T extends Error>(mapping: ErrorMapping<T>[]): MethodDecorator =>
  (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        for (let [CustomErrorConstructor, options] of mapping) {
          if (CustomErrorConstructor.is(err))
            return json(
              { message: options.message ?? err.message },
              {
                status: options.status,
              }
            );
        }
        throw err;
      }
    };
  };
