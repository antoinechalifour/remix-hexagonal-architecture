import type { Collaborators } from "../../../domain/Collaborators";
import type { CollaboratorId } from "../../../domain/CollaboratorId";
import type { Collaborator } from "../../../domain/Collaborator";

export class CollaboratorsInMemory implements Collaborators {
  private database = new Map<CollaboratorId, Collaborator>();
  private databaseByEmail = new Map<string, Collaborator>();

  addTestCollaborator(collaborator: Collaborator) {
    this.database.set(collaborator.id, collaborator);
    this.databaseByEmail.set(collaborator.email, collaborator);
  }

  async ofEmail(email: string): Promise<Collaborator> {
    const collaborator = this.databaseByEmail.get(email);
    if (collaborator == null) throw new Error("oups");

    return collaborator;
  }

  async ofIds(collaboratorIds: string[]): Promise<Collaborator[]> {
    throw new Error("Method not implemented.");
  }
}
