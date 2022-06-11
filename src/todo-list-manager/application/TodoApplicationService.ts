import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { Prisma, PrismaQueryRunner } from "shared/database";
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
import { TodoListEvents } from "../infrastructure/TodoListEvents";
import { TodoListEventDatabaseRepository } from "../infrastructure/TodoListEventDatabaseRepository";

@Injectable()
export class TodoApplicationService {
  constructor(
    @Inject(PRISMA) private readonly prisma: Prisma,
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
        this.transactionalTodos(prisma),
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.generateId,
        this.clock,
        this.transactionalTodoListEvents(prisma)
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
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.transactionalTodos(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
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
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.transactionalTodos(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, todoId, isDone === "on", currentUser.id)
    );
  }

  async updateTodoTitle(
    todoListId: string,
    todoId: string,
    title: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new UpdateTodoTitle(
        this.transactionalTodos(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, todoId, title, currentUser.id)
    );
  }

  async addTagToTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new AddTagToTodo(
        this.transactionalTodos(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, todoId, currentUser.id, tag)
    );
  }

  async removeTagFromTodo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new RemoveTagFromTodo(
        this.transactionalTodos(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, todoId, currentUser.id, tag)
    );
  }

  private transactionalTodoLists(prisma: PrismaQueryRunner) {
    return new TodoListDatabaseRepository(prisma);
  }

  private transactionalTodos(prisma: PrismaQueryRunner) {
    return new TodoDatabaseRepository(prisma);
  }

  private transactionalTodoListPermissions(prisma: PrismaQueryRunner) {
    return new TodoListPermissionsDatabaseRepository(prisma);
  }

  private transactionalTodoListEvents(prisma: PrismaQueryRunner) {
    return new TodoListEvents(
      this.events,
      new TodoListEventDatabaseRepository(prisma)
    );
  }
}
