import { Module } from "@nestjs/common";
import { LoginApplicationService } from "./application/LoginApplicationService";
import { CredentialsEnvironmentRepository } from "./persistence/CredentialsEnvironmentRepository";

@Module({
  providers: [LoginApplicationService, CredentialsEnvironmentRepository],
  exports: [LoginApplicationService],
})
export class AuthenticationModule {}
