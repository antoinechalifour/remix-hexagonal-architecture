import { Injectable } from "@nestjs/common";
import { TodoListEvent } from "../domain/TodoListEvent";
import { PrismaRepository } from "shared/database";

@Injectable()
export class TodoListEventDatabaseRepository extends PrismaRepository {
  async save(event: TodoListEvent) {
    console.log("Repository to implement:", event);
  }
}
