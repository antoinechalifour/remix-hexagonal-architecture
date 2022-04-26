export const METADATA_SESSION = Symbol("session");
export const CurrentSession =
  (): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(
      METADATA_SESSION,
      parameterIndex,
      target,
      propertyKey
    );
  };
