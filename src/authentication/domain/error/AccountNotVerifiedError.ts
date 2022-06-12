export class AccountNotVerifiedError extends Error {
  constructor(email: string) {
    super(`Account ${email} is not verified`);
  }

  static is(err: unknown): err is AccountNotVerifiedError {
    return err instanceof AccountNotVerifiedError;
  }
}
