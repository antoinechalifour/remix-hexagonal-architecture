import { Module } from "@nestjs/common";
import { GenerateUUID, Prisma } from "shared";
import { LoginApplicationService } from "./application/LoginApplicationService";
import { BCryptPasswordHasher } from "./infrastructure/BCryptPasswordHasher";
import { AccountPrismaRepository } from "./persistence/AccountPrismaRepository";

@Module({
  providers: [
    LoginApplicationService,
    AccountPrismaRepository,
    BCryptPasswordHasher,
    GenerateUUID,
    Prisma,
  ],
  exports: [LoginApplicationService],
})
export class AuthenticationModule {}
