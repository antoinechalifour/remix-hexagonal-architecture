export class InvalidCredentialsError extends Error {
  static is(err: unknown): err is InvalidCredentialsError {
    return err instanceof InvalidCredentialsError;
  }
}
