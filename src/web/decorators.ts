import { DataFunctionArgs } from "@remix-run/node";
import { header, requireAuthentication } from "./http";
import { validateSync } from "class-validator";
import { json } from "remix";
import { getSession } from "./sessions";

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

const METADATA_BODY = Symbol("body");
const METADATA_BODY_CTR = Symbol("body_constructor");
const METADATA_PARAMS = Symbol("params");
const METADATA_PARAMS_CTR = Symbol("params_constructor");
const METADATA_SESSION = Symbol("session");

export const DataFunction =
  (): MethodDecorator =>
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;
    const bodyParameterIndex = Reflect.getOwnMetadata(
      METADATA_BODY,
      target,
      propertyKey
    );
    const paramsParameterIndex = Reflect.getOwnMetadata(
      METADATA_PARAMS,
      target,
      propertyKey
    );
    const sessionParameterIndex = Reflect.getOwnMetadata(
      METADATA_SESSION,
      target,
      propertyKey
    );

    descriptor.value = async function (args: DataFunctionArgs) {
      const newArgs: any[] = [];

      if (bodyParameterIndex != null) {
        const Constructor = Reflect.getMetadata(
          METADATA_BODY_CTR,
          target,
          propertyKey
        );
        const body = new Constructor();
        const formData = await args.request.formData();
        Object.assign(body, Object.fromEntries(formData.entries()));

        const validationErrors = validateSync(body);

        if (validationErrors.length > 0) {
          return json({ errors: true }, 400);
        }

        newArgs[bodyParameterIndex] = body;
      }

      if (paramsParameterIndex != null) {
        const Constructor = Reflect.getMetadata(
          METADATA_PARAMS_CTR,
          target,
          propertyKey
        );
        const params = new Constructor();
        Object.assign(params, args.params);

        const validationErrors = validateSync(params);

        if (validationErrors.length > 0) return json({ errors: true }, 400);

        newArgs[paramsParameterIndex] = params;
      }

      if (sessionParameterIndex != null) {
        newArgs[sessionParameterIndex] = await getSession(
          header("Cookie", args.request)
        );
      }

      newArgs.push(args);

      return originalMethod.apply(this, newArgs);
    };
  };

export const Body =
  (): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(METADATA_BODY, parameterIndex, target, propertyKey);
    Reflect.defineMetadata(
      METADATA_BODY_CTR,
      Reflect.getMetadata("design:type", target, propertyKey),
      target,
      propertyKey
    );
  };

export const Params =
  (): ParameterDecorator =>
  (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(
      METADATA_PARAMS,
      parameterIndex,
      target,
      propertyKey
    );
    Reflect.defineMetadata(
      METADATA_PARAMS_CTR,
      Reflect.getMetadata("design:type", target, propertyKey),
      target,
      propertyKey
    );
  };

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
