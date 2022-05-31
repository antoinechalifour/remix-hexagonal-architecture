import type { Collaborator } from "./Collaborator";
import type { CollaboratorId } from "./CollaboratorId";

export interface Collaborators {
  ofIds(collaboratorIds: CollaboratorId[]): Promise<Collaborator[]>;
  ofEmail(email: string): Promise<Collaborator>;
}
