import type { HomePageDto } from "shared/client";
import type { OwnerId } from "./OwnerId";

export interface FetchHomePage {
  run(ownerId: OwnerId): Promise<HomePageDto>;
}
