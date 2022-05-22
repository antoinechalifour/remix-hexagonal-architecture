import type { GenerateId } from "shared/id";
import type { PasswordHasher } from "./PasswordHasher";

import { InvalidVerificationTokenError } from "./InvalidVerificationTokenError";
import { Clock } from "shared/time";
import { add } from "date-fns";

export type UnverifiedAccount = {
  type: "unverified";
  id: string;
  email: string;
  hash: string;
  verified: false;
  verificationToken: string;
};

export type VerifiedAccount = {
  type: "verified";
  id: string;
  email: string;
  hash: string;
  verified: true;
};

export type AccountForPasswordResetting = {
  type: "password-reset";
  id: string;
  email: string;
  passwordResetToken: string;
  passwordResetExpiration: Date;
};

export async function register(
  email: string,
  password: string,
  generateId: GenerateId,
  passwordHasher: PasswordHasher
): Promise<UnverifiedAccount> {
  return {
    type: "unverified",
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
    type: "verified",
    id: account.id,
    email: account.email,
    hash: account.hash,
    verified: true,
  };
}

export function generateResetPasswordToken(
  account: VerifiedAccount,
  generateId: GenerateId,
  clock: Clock
): AccountForPasswordResetting {
  return {
    type: "password-reset",
    id: account.id,
    email: account.email,
    passwordResetToken: generateId.generate(),
    passwordResetExpiration: add(clock.now(), { days: 7 }),
  };
}
