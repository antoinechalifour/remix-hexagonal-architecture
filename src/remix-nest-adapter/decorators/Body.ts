export const METADATA_BODY = Symbol("body");

export const Body =
  (): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(METADATA_BODY, parameterIndex, target, propertyKey);
  };
