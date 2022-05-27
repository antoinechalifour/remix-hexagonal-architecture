import { Collaborator } from "./Collaborator";

export interface Collaborators {
  ofEmail: (email: string) => Promise<Collaborator>;
}
