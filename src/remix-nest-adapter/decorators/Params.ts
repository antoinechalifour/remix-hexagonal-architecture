export const METADATA_PARAMS = Symbol("params");
export const Params =
  (): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(
      METADATA_PARAMS,
      parameterIndex,
      target,
      propertyKey
    );
  };
