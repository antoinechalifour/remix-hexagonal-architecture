import { Injectable } from "@nestjs/common";
import { AddTodo } from "../usecase/AddTodo";
import { ChangeTodoCompletion } from "../usecase/ChangeTodoCompletion";
import { ArchiveTodo } from "../usecase/ArchiveTodo";
import { TodoListPrismaRepository } from "../persistence/TodoListPrismaRepository";
import { TodoPrismaRepository } from "../persistence/TodoPrismaRepository";
import { RealClock } from "../infrastructure/RealClock";
import { GenerateUUID } from "shared";

@Injectable()
export class TodoApplicationService {
  constructor(
    private readonly todoLists: TodoListPrismaRepository,
    private readonly todos: TodoPrismaRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock
  ) {}

  add(todoListId: string, title: string, ownerId: string) {
    return new AddTodo(
      this.todos,
      this.todoLists,
      this.generateId,
      this.clock
    ).execute(todoListId, title, ownerId);
  }

  archive(todoListId: string, todoId: string, ownerId: string) {
    return new ArchiveTodo(this.todoLists, this.todos).execute(
      todoListId,
      todoId,
      ownerId
    );
  }

  changeTodoCompletion(todoId: string, isChecked: string, ownerId: string) {
    return new ChangeTodoCompletion(this.todos).execute(
      todoId,
      isChecked,
      ownerId
    );
  }
}
