import { execSync } from "child_process";

export async function prepareDatabase() {
  execSync("yarn integration:clean");
}

export function configureTestingDatabaseEnvironment() {
  process.env.DATABASE_URL =
    "postgresql://user:password@localhost:6070/todolistmanager-integration";
}
