import { Injectable } from "@nestjs/common";
import { FetchHomePagePrismaQuery } from "todo-list-manager";
import { DataFunctionArgs } from "@remix-run/node";
import { requireAuthentication } from "../http";

@Injectable()
export class HomePageLoader {
  constructor(private readonly fetchHomePageQuery: FetchHomePagePrismaQuery) {}

  async run({ request }: DataFunctionArgs) {
    await requireAuthentication(request);
    return this.fetchHomePageQuery.run();
  }
}
