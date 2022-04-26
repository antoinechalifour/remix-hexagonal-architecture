import { DataFunctionArgs } from "@remix-run/node";
import { validateSync, ValidationError } from "class-validator";
import { getSession } from "../../web/sessions";
import { header } from "../../web/http";
import { METADATA_BODY } from "./Body";
import { METADATA_PARAMS } from "./Params";
import { METADATA_SESSION } from "./CurrentSession";

class DecoratorValidationError extends Error {
  constructor(message: string, public validationErrors: ValidationError[]) {
    super(message);
  }
}

interface ErrorFormatter {
  format(errors: ValidationError[]): Record<string, string>;
}

class DefaultErrorFormatter implements ErrorFormatter {
  format(errors: ValidationError[]): Record<string, string> {
    const formatted: Record<string, string> = {};

    for (let validationError of errors) {
      const constraints = validationError.constraints;
      if (!constraints) continue;

      const [, message] = Object.entries(constraints)[0];

      formatted[validationError.property] = message;
    }

    return formatted;
  }
}

export const DataFunction =
  (errorFormatter = new DefaultErrorFormatter()): MethodDecorator =>
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
    const ParamTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    );

    async function parseBody(args: DataFunctionArgs) {
      const formData = await args.request.formData();
      const body = new ParamTypes[bodyParameterIndex]();
      Object.assign(body, Object.fromEntries(formData.entries()));
      const validationErrors = validateSync(body);

      if (validationErrors.length > 0) {
        throw new DecoratorValidationError(
          "Body validation failed",
          validationErrors
        );
      }

      return body;
    }

    async function parseParams(args: DataFunctionArgs) {
      const params = new ParamTypes[paramsParameterIndex]();
      Object.assign(params, args.params);
      const validationErrors = validateSync(params);

      if (validationErrors.length > 0) {
        throw new DecoratorValidationError(
          "Params validation failed",
          validationErrors
        );
      }

      return params;
    }

    function parseSession(args: DataFunctionArgs) {
      return getSession(header("Cookie", args.request));
    }

    descriptor.value = async function (args: DataFunctionArgs) {
      const newArgs: any[] = [];

      try {
        if (bodyParameterIndex != null)
          newArgs[bodyParameterIndex] = await parseBody(args);
        if (paramsParameterIndex != null)
          newArgs[paramsParameterIndex] = await parseParams(args);
        if (sessionParameterIndex != null)
          newArgs[sessionParameterIndex] = await parseSession(args);
      } catch (e) {
        if (!(e instanceof DecoratorValidationError)) throw e;

        return {
          errors: errorFormatter.format(e.validationErrors),
        };
      }

      newArgs.push(args);

      return originalMethod.apply(this, newArgs);
    };
  };
