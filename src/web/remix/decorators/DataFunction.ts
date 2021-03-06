import { DataFunctionArgs } from "@remix-run/node";
import { validateSync, ValidationError } from "class-validator";
import { METADATA_BODY } from "./Body";
import { METADATA_PARAMS } from "./Params";
import { plainToClass } from "class-transformer";
import { METADATA_QUERY } from "./Query";

class DecoratorValidationError extends Error {
  constructor(message: string, public validationErrors: ValidationError[]) {
    super(message);
  }
}

export interface ErrorFormatter {
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
    const queryParameterIndex = Reflect.getOwnMetadata(
      METADATA_QUERY,
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
      const body = plainToClass<any, any>(
        ParamTypes[bodyParameterIndex],
        Object.fromEntries(formData.entries())
      );
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
      const params = plainToClass<any, any>(
        ParamTypes[paramsParameterIndex],
        args.params
      );
      const validationErrors = validateSync(params);

      if (validationErrors.length > 0) {
        throw new Response(null, { status: 400 });
      }

      return params;
    }

    async function parseQuery(args: DataFunctionArgs) {
      const searchParams = new URL(args.request.url).searchParams;
      const query = plainToClass<any, any>(
        ParamTypes[queryParameterIndex],
        Object.fromEntries(searchParams.entries())
      );
      const validationErrors = validateSync(query);

      if (validationErrors.length > 0) {
        throw new Response(null, { status: 400 });
      }

      return query;
    }

    descriptor.value = async function (args: DataFunctionArgs) {
      const newArgs: any[] = [];

      try {
        if (bodyParameterIndex != null)
          newArgs[bodyParameterIndex] = await parseBody(args);
        if (paramsParameterIndex != null)
          newArgs[paramsParameterIndex] = await parseParams(args);
        if (queryParameterIndex != null)
          newArgs[queryParameterIndex] = await parseQuery(args);
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
