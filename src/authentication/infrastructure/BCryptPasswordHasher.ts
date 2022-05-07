import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { PasswordHasher } from "../domain/PasswordHasher";

@Injectable()
export class BCryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
