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
import { TodoListUpdated } from "../domain/TodoListUpdated";

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
        this.clock
      ).execute(todoListId, title, currentUser.id)
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
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
        new TodoDatabaseRepository(prisma)
      ).execute(todoListId, todoId, currentUser.id)
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
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
        this.clock
      ).execute(todoListId, todoId, isDone === "on", currentUser.id)
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async updateTodoTitle(
    todoListId: string,
    todoId: string,
    title: string,
    currentUser: CurrentUser
  ) {
    await new UpdateTodoTitle(this.todos, this.todoListPermissions).execute(
      todoListId,
      todoId,
      title,
      currentUser.id
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async addTagToTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new AddTagToTodo(this.todos, this.todoListPermissions).execute(
      todoListId,
      todoId,
      currentUser.id,
      tag
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async removeTagFromTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new RemoveTagFromTodo(this.todos, this.todoListPermissions).execute(
      todoListId,
      todoId,
      currentUser.id,
      tag
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }
}
