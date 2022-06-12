export class InvalidPasswordResetTokenError extends Error {
  constructor(token: string) {
    super(`Invalid password reset token ${token}`);
  }

  static is(err: unknown): err is InvalidPasswordResetTokenError {
    return err instanceof InvalidPasswordResetTokenError;
  }
}
