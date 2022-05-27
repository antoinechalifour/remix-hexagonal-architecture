import type { Collaborators } from "../domain/Collaborators";
import type { Collaborator } from "../domain/Collaborator";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";

@Injectable()
export class CollaboratorsAdapter
  extends PrismaRepository
  implements Collaborators
{
  async ofEmail(email: string): Promise<Collaborator> {
    const account = await this.prisma.account.findFirst({
      where: { email },
      rejectOnNotFound: true,
    });

    return {
      id: account.id,
      email: account.email,
    };
  }
}
