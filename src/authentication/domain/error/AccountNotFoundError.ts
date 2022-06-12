export class AccountNotFoundError extends Error {
  constructor(email: string) {
    super(`Account ${email} was not found`);
  }

  static is(err: unknown): err is AccountNotFoundError {
    return err instanceof AccountNotFoundError;
  }
}
