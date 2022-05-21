import type { GenerateId } from "shared/id";
import type { PasswordHasher } from "./PasswordHasher";

import { InvalidVerificationTokenError } from "./InvalidVerificationTokenError";

export type BaseAccount = {
  id: string;
  email: string;
  hash: string;
};

export type UnverifiedAccount = BaseAccount & {
  verified: false;
  verificationToken: string;
};

export type VerifiedAccount = BaseAccount & {
  verified: true;
};

export async function register(
  email: string,
  password: string,
  generateId: GenerateId,
  passwordHasher: PasswordHasher
): Promise<UnverifiedAccount> {
  return {
    id: generateId.generate(),
    email,
    hash: await passwordHasher.hash(password),
    verified: false,
    verificationToken: generateId.generate(),
  };
}

export function verify(
  account: UnverifiedAccount,
  token: string
): VerifiedAccount {
  if (account.verificationToken !== token)
    throw new InvalidVerificationTokenError(token);

  return {
    id: account.id,
    email: account.email,
    hash: account.hash,
    verified: true,
  };
}
