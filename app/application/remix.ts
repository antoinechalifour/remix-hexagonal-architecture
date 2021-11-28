import { ActionFunction, LinkDescriptor, LinksFunction } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import Joi from "joi";

export const link = (href: string): LinkDescriptor => ({
  rel: "stylesheet",
  href,
});

export const componentCss =
  (...descriptors: LinkDescriptor[]): LinksFunction =>
  () =>
    descriptors;

const formatErrors = (error: Joi.ValidationError) => {
  const errors: Record<string, string> = {};

  error.details.forEach((detail) => {
    errors[detail.context?.key!] = detail.message;
  });

  return errors;
};

export const runAction = async (
  { request }: DataFunctionArgs,
  validationSchema: Joi.ObjectSchema,
  callback: (payload: Record<string, any>) => ReturnType<ActionFunction>
) => {
  const formData = await request.formData();
  const { value, error } = validationSchema.validate(
    Object.fromEntries(formData.entries())
  );

  if (error?.details) {
    return { errors: formatErrors(error) };
  }

  return callback(value);
};
