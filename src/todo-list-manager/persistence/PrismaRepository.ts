import { PrismaClient } from "@prisma/client";
import { Inject } from "@nestjs/common";
import { PRISMA } from "../keys";

export type PrismaQueryRunner = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export abstract class PrismaRepository {
  constructor(@Inject(PRISMA) protected readonly prisma: PrismaQueryRunner) {}
}
