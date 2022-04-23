import { Module } from "@nestjs/common";
import { Prisma } from "./database/Prisma";
import { GenerateUUID } from "./id/GenerateUUID";
import { RealClock } from "./time/RealClock";
import { PRISMA } from "./keys";

const prismaProvider = {
  provide: PRISMA,
  useClass: Prisma,
};

@Module({
  providers: [prismaProvider, GenerateUUID, RealClock],
  exports: [prismaProvider, GenerateUUID, RealClock],
})
export class InfrastructureModule {}
