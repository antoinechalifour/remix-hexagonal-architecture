import type { Contributors } from "../../../domain/Contributors";
import type { ContributorId } from "../../../domain/ContributorId";
import type { Contributor } from "../../../domain/Contributor";

export class ContributorsInMemory implements Contributors {
  private database = new Map<ContributorId, Contributor>();
  private databaseByEmail = new Map<string, Contributor>();

  addTestContributor(contributor: Contributor) {
    this.database.set(contributor.id, contributor);
    this.databaseByEmail.set(contributor.email, contributor);
  }

  async ofEmail(email: string): Promise<Contributor> {
    const contributor = this.databaseByEmail.get(email);
    if (contributor == null) throw new Error("oups");

    return contributor;
  }

  async ofIds(contributorsIds: string[]): Promise<Contributor[]> {
    throw new Error("Method not implemented.");
  }
}
