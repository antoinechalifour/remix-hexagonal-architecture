import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Inject } from "@nestjs/common";
import { PRISMA } from "../keys";

export type PrismaQueryRunner = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export abstract class PrismaRepository {
  constructor(@Inject(PRISMA) protected readonly prisma: PrismaQueryRunner) {}

  protected isUniqueConstraintFailed(
    e: unknown
  ): e is PrismaClientKnownRequestError {
    return e instanceof PrismaClientKnownRequestError && e.code === "P2002";
  }
}
