import type { HomePageReadModel } from "~/query/HomePageReadModel";

export interface FetchHomePageQuery {
  run(): Promise<HomePageReadModel>;
}
