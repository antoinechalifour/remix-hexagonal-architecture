type ErrorCasting<T extends Error> = {
  is(err: unknown): err is T;
};
type ErrorMapping<T extends Error> = [ErrorCasting<T>, number];

export const MapErrorThrowing =
  <T extends Error>(mapping: ErrorMapping<T>[]): MethodDecorator =>
  (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        for (let [CustomErrorConstructor, httpStatus] of mapping) {
          if (CustomErrorConstructor.is(err))
            throw new Response(err.message, {
              status: httpStatus,
            });
        }
        throw err;
      }
    };
  };
