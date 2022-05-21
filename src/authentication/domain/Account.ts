import type { GenerateId } from "shared";
import type { PasswordHasher } from "./PasswordHasher";

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
