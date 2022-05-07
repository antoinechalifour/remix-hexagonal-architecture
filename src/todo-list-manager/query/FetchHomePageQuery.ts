import type { HomePageDto } from "shared";
import type { OwnerId } from "../domain/OwnerId";

export interface FetchHomePageQuery {
  run(ownerId: OwnerId): Promise<HomePageDto>;
}
