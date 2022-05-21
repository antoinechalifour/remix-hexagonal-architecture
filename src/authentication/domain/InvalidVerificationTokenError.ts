export class InvalidVerificationTokenError extends Error {
  constructor(token: string) {
    super(`Token ${token} is invalid`);
  }
}
