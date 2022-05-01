import { Injectable } from "@nestjs/common";
import { AddTodo } from "../usecase/AddTodo";
import { ChangeTodoCompletion } from "../usecase/ChangeTodoCompletion";
import { ArchiveTodo } from "../usecase/ArchiveTodo";
import type { TodoListId } from "../domain/TodoList";
import type { TodoId } from "../domain/Todo";
import { TodoListPrismaRepository } from "../persistence/TodoListPrismaRepository";
import { TodoPrismaRepository } from "../persistence/TodoPrismaRepository";
import { GenerateUUID } from "../infrastructure/GenerateUUID";
import { RealClock } from "../infrastructure/RealClock";

@Injectable()
export class TodoApplicationService {
  constructor(
    private readonly todoLists: TodoListPrismaRepository,
    private readonly todos: TodoPrismaRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock
  ) {}

  add(todoListId: string, title: string) {
    return new AddTodo(
      this.todos,
      this.todoLists,
      this.generateId,
      this.clock
    ).execute(todoListId as TodoListId, title);
  }

  archive(todoId: string) {
    return new ArchiveTodo(this.todos).execute(todoId as TodoId);
  }

  changeTodoCompletion(todoId: string, isChecked: string) {
    return new ChangeTodoCompletion(this.todos).execute(
      todoId as TodoId,
      isChecked
    );
  }
}
