import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class Prisma extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    return this.$connect();
  }
}
