export class CollaboratorNotFoundError extends Error {
  constructor(email: string) {
    super(`Collaborator ${email} was not found`);
  }

  static is(err: unknown): err is CollaboratorNotFoundError {
    return err instanceof CollaboratorNotFoundError;
  }
}
