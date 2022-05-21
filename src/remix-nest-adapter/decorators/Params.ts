export const METADATA_PARAMS = Symbol("params");
export const Params =
  (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
      METADATA_PARAMS,
      parameterIndex,
      target,
      propertyKey
    );
  };
