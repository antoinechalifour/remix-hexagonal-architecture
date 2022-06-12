import type { Contributors } from "../domain/Contributors";
import type { Contributor } from "../domain/Contributor";
import type { Account as AccountRow } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { ContributorNotFoundError } from "../domain/error/ContributorNotFoundError";

@Injectable()
export class ContributorsAdapter
  extends PrismaRepository
  implements Contributors
{
  async ofIds(contributorsIds: string[]): Promise<Contributor[]> {
    const rows = await this.prisma.account.findMany({
      where: {
        id: { in: contributorsIds },
      },
    });

    return rows.map(toContributor);
  }

  async ofEmail(email: string): Promise<Contributor> {
    const row = await this.prisma.account.findFirst({
      where: { email },
    });

    if (row == null) throw new ContributorNotFoundError(email);

    return toContributor(row);
  }
}

function toContributor(account: AccountRow) {
  return {
    id: account.id,
    email: account.email,
  };
}
