export class EmailAlreadyInUseError extends Error {
  constructor(private readonly email: string) {
    super(`Email ${email} is already in use`);
  }

  static is(err: unknown): err is EmailAlreadyInUseError {
    return err instanceof EmailAlreadyInUseError;
  }
}
