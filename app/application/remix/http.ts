import Joi from "joi";

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
