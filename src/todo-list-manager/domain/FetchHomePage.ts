import type { HomePageDto } from "shared";
import type { OwnerId } from "./OwnerId";

export interface FetchHomePage {
  run(ownerId: OwnerId): Promise<HomePageDto>;
}
