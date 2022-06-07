import type { Collaborators } from "../domain/Collaborators";
import type { Collaborator } from "../domain/Collaborator";
import type { Account as AccountRow } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { CollaboratorNotFoundError } from "../domain/CollaboratorNotFoundError";

@Injectable()
export class CollaboratorsAdapter
  extends PrismaRepository
  implements Collaborators
{
  async ofIds(collaboratorIds: string[]): Promise<Collaborator[]> {
    const collaboratorsRows = await this.prisma.account.findMany({
      where: {
        id: { in: collaboratorIds },
      },
    });

    return collaboratorsRows.map(toCollaborator);
  }

  async ofEmail(email: string): Promise<Collaborator> {
    const account = await this.prisma.account.findFirst({
      where: { email },
    });

    if (account == null) throw new CollaboratorNotFoundError(email);

    return toCollaborator(account);
  }
}

function toCollaborator(account: AccountRow) {
  return {
    id: account.id,
    email: account.email,
  };
}
