export class PasswordResetTokenExpiredError extends Error {
  constructor(token: string) {
    super(`Password reset token ${token} is expired`);
  }

  static is(err: unknown): err is PasswordResetTokenExpiredError {
    return err instanceof PasswordResetTokenExpiredError;
  }
}
