export class ContributorNotFoundError extends Error {
  constructor(email: string) {
    super(`Contributor ${email} was not found`);
  }

  static is(err: unknown): err is ContributorNotFoundError {
    return err instanceof ContributorNotFoundError;
  }
}
