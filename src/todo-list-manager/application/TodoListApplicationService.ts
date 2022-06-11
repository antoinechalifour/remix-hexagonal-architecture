import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { RealClock } from "shared/time";
import { NestEvents } from "shared/events";
import { GenerateUUID } from "shared/id";
import { Prisma, PrismaQueryRunner } from "shared/database";
import { PRISMA } from "../../keys";
import { CreateTodoList } from "../usecase/CreateTodoList";
import { ArchiveTodoList } from "../usecase/ArchiveTodoList";
import { ReorderTodo } from "../usecase/ReorderTodo";
import { UpdateTodoListTitle } from "../usecase/UpdateTodoListTitle";
import { GrantAccess } from "../usecase/GrantAccess";
import { ViewHomePage } from "../usecase/ViewHomePage";
import { ViewTodoList } from "../usecase/ViewTodoList";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { TodoListPermissionsDatabaseRepository } from "../infrastructure/TodoListPermissionsDatabaseRepository";
import { ContributorsAdapter } from "../infrastructure/ContributorsAdapter";
import { TodoListDatabaseQuery } from "../infrastructure/TodoListDatabaseQuery";
import { RevokeAccess } from "../usecase/RevokeAccess";
import { TodoListEvents } from "../infrastructure/TodoListEvents";
import { TodoListEventDatabaseRepository } from "../infrastructure/TodoListEventDatabaseRepository";

@Injectable()
export class TodoListApplicationService {
  constructor(
    @Inject(PRISMA) private readonly prisma: Prisma,
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly todoListPermissions: TodoListPermissionsDatabaseRepository,
    private readonly todoListQuery: TodoListDatabaseQuery,
    private readonly contributors: ContributorsAdapter,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly events: NestEvents
  ) {}

  createTodoList(title: string, currentUser: CurrentUser) {
    return this.prisma.$transaction((prisma) =>
      new CreateTodoList(
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.generateId,
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(title, currentUser.id)
    );
  }

  async archive(todoListId: string, currentUser: CurrentUser) {
    await this.prisma.$transaction((prisma) =>
      new ArchiveTodoList(
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma)
      ).execute(todoListId, currentUser.id)
    );
  }

  async updateTodoListTitle(
    todoListId: string,
    todoListTitle: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new UpdateTodoListTitle(
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, todoListTitle, currentUser.id)
    );
  }

  async reorderTodo(
    todoListId: string,
    currentUser: CurrentUser,
    todoId: string,
    newIndex: number
  ) {
    await this.prisma.$transaction((prisma) =>
      new ReorderTodo(
        this.transactionalTodoLists(prisma),
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, currentUser.id, todoId, newIndex)
    );
  }

  async grantAccess(
    todoListId: string,
    contributorEmail: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new GrantAccess(
        this.transactionalTodoListPermissions(prisma),
        this.transactionalContributors(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, currentUser.id, contributorEmail)
    );
  }

  async revokeAccess(
    todoListId: string,
    contributorId: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new RevokeAccess(
        this.transactionalTodoListPermissions(prisma),
        this.clock,
        this.transactionalTodoListEvents(prisma)
      ).execute(todoListId, currentUser.id, contributorId)
    );
  }

  viewHomePage(contributorId: string) {
    return new ViewHomePage(
      this.todoListPermissions,
      this.todoListQuery
    ).execute(contributorId);
  }

  viewTodoList(todoListId: string, contributorId: string) {
    return new ViewTodoList(
      this.todoListPermissions,
      this.contributors,
      this.todoListQuery
    ).execute(todoListId, contributorId);
  }

  private transactionalTodoLists(prisma: PrismaQueryRunner) {
    return new TodoListDatabaseRepository(prisma);
  }

  private transactionalTodoListPermissions(prisma: PrismaQueryRunner) {
    return new TodoListPermissionsDatabaseRepository(prisma);
  }

  private transactionalContributors(prisma: PrismaQueryRunner) {
    return new ContributorsAdapter(prisma);
  }

  private transactionalTodoListEvents(prisma: PrismaQueryRunner) {
    return new TodoListEvents(
      this.events,
      new TodoListEventDatabaseRepository(prisma)
    );
  }
}
