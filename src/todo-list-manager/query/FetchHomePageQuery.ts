import type { HomePageDto } from "shared";

export interface FetchHomePageQuery {
  run(): Promise<HomePageDto>;
}
