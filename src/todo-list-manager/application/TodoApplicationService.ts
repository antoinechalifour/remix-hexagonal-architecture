import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { Prisma } from "shared/database";
import { RealClock } from "shared/time";
import { NestEvents } from "shared/events";
import { GenerateUUID } from "shared/id";
import { PRISMA } from "../../keys";
import { AddTodoToTodoList } from "../usecase/AddTodoToTodoList";
import { MarkTodo } from "../usecase/MarkTodo";
import { DeleteTodoFromTodoList } from "../usecase/DeleteTodoFromTodoList";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { TodoDatabaseRepository } from "../infrastructure/TodoDatabaseRepository";
import { TodoListPermissionsDatabaseRepository } from "../infrastructure/TodoListPermissionsDatabaseRepository";
import { UpdateTodoTitle } from "../usecase/UpdateTodoTitle";
import { AddTagToTodo } from "../usecase/AddTagToTodo";
import { RemoveTagFromTodo } from "../usecase/RemoveTagFromTodo";

@Injectable()
export class TodoApplicationService {
  constructor(
    @Inject(PRISMA) private readonly prisma: Prisma,
    private readonly todos: TodoDatabaseRepository,
    private readonly todoListPermissions: TodoListPermissionsDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly events: NestEvents
  ) {}

  async addTodoToTodoList(
    todoListId: string,
    title: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new AddTodoToTodoList(
        new TodoDatabaseRepository(prisma),
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma),
        this.generateId,
        this.clock,
        this.events
      ).execute(todoListId, title, currentUser.id)
    );
  }

  async deleteFromTodoList(
    todoListId: string,
    todoId: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new DeleteTodoFromTodoList(
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma),
        this.events
      ).execute(todoListId, todoId, currentUser.id)
    );
  }

  async markTodo(
    todoListId: string,
    todoId: string,
    isDone: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new MarkTodo(
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma),
        this.clock,
        this.events
      ).execute(todoListId, todoId, isDone === "on", currentUser.id)
    );
  }

  async updateTodoTitle(
    todoListId: string,
    todoId: string,
    title: string,
    currentUser: CurrentUser
  ) {
    await new UpdateTodoTitle(
      this.todos,
      this.todoListPermissions,
      this.events
    ).execute(todoListId, todoId, title, currentUser.id);
  }

  async addTagToTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new AddTagToTodo(
      this.todos,
      this.todoListPermissions,
      this.events
    ).execute(todoListId, todoId, currentUser.id, tag);
  }

  async removeTagFromTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new RemoveTagFromTodo(
      this.todos,
      this.todoListPermissions,
      this.events
    ).execute(todoListId, todoId, currentUser.id, tag);
  }
}
