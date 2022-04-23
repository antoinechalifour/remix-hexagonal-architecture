import { execSync } from "child_process";

export async function prepareDatabase() {
  execSync("yarn integration:clean");
  execSync("yarn integration:prepare");
}

export function configureTestingDatabaseEnvironment() {
  process.env.DATABASE_URL = "file:./integration_todolists.db";
}
