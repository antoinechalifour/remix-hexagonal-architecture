import type { GenerateId } from "shared";
import type { PasswordHasher } from "./PasswordHasher";

export type Account = {
  id: string;
  email: string;
  hash: string;
};

export async function register(
  email: string,
  password: string,
  generateId: GenerateId,
  passwordHasher: PasswordHasher
): Promise<Account> {
  return {
    id: generateId.generate(),
    email,
    hash: await passwordHasher.hash(password),
  };
}
