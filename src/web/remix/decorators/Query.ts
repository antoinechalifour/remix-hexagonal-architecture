export const METADATA_QUERY = Symbol("query");

export const Query =
  (): ParameterDecorator => (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(METADATA_QUERY, parameterIndex, target, propertyKey);
  };
