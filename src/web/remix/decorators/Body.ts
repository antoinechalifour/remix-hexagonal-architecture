export const METADATA_BODY = Symbol("body");

export const Body =
  (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(METADATA_BODY, parameterIndex, target, propertyKey);
  };
