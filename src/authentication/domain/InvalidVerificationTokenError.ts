export class InvalidVerificationTokenError extends Error {
  constructor(token: string) {
    super(`Token ${token} is invalid`);
  }

  static is(err: unknown): err is InvalidVerificationTokenError {
    return err instanceof InvalidVerificationTokenError;
  }
}
