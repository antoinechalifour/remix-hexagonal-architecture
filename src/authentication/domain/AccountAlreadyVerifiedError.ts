export class AccountAlreadyVerifiedError extends Error {
  constructor(email: string) {
    super(`Account ${email} is already verified`);
  }

  static is(err: unknown): err is AccountAlreadyVerifiedError {
    return err instanceof AccountAlreadyVerifiedError;
  }
}
