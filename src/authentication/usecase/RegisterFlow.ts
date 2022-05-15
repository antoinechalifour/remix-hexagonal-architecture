import { GenerateId } from "shared";
import { Accounts } from "../domain/Accounts";
import { register } from "../domain/Account";
import { PasswordHasher } from "../domain/PasswordHasher";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export class RegisterFlow {
  constructor(
    private readonly credentials: Accounts,
    private readonly generateId: GenerateId,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(username: string, password: string) {
    const account = await register(
      username,
      password,
      this.generateId,
      this.passwordHasher
    );

    await this.credentials.save(account);
  }
}
