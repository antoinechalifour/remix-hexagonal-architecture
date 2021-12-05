import Joi from "joi";
import {
  getSession,
  isAuthenticatedSession,
} from "~/application/remix/sessions";
import { redirect } from "remix";

const formatErrors = (error: Joi.ValidationError) => {
  const errors: Record<string, string> = {};

  error.details.forEach((detail) => {
    errors[detail.context?.key!] = detail.message;
  });

  return errors;
};

type ValidationResult<T> = [Record<string, string>, null] | [null, T];

export const validateBody = async <T = unknown>(
  schema: Joi.ObjectSchema<T>,
  request: Request
): Promise<ValidationResult<T>> => {
  const { value, error } = schema.validate(
    Object.fromEntries(await request.formData())
  );

  if (error?.details) {
    return [formatErrors(error), null];
  }

  return [null, value!];
};

export const requireAuthentication = async (request: Request) => {
  const session = await sessionFromCookies(request);

  if (!isAuthenticatedSession(session)) throw redirect("/login");
};

export const header = (headerName: string, request: Request) =>
  request.headers.get(headerName);

export const sessionFromCookies = (request: Request) =>
  getSession(header("Cookie", request));
