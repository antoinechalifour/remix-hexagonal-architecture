import type { Contributor } from "./Contributor";
import type { ContributorId } from "./ContributorId";

export interface Contributors {
  ofIds(contributorsIds: ContributorId[]): Promise<Contributor[]>;
  ofEmail(email: string): Promise<Contributor>;
}
