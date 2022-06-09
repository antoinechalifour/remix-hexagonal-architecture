import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { RealClock } from "shared/time";
import { NestEvents } from "shared/events";
import { GenerateUUID } from "shared/id";
import { Prisma } from "shared/database";
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
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma),
        this.generateId,
        this.clock
      ).execute(title, currentUser.id)
    );
  }

  async archive(todoListId: string, currentUser: CurrentUser) {
    await this.prisma.$transaction((prisma) =>
      new ArchiveTodoList(
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma)
      ).execute(todoListId, currentUser.id)
    );
  }

  async updateTodoListTitle(
    todoListId: string,
    todoListTitle: string,
    currentUser: CurrentUser
  ) {
    await new UpdateTodoListTitle(
      this.todoLists,
      this.todoListPermissions,
      this.events
    ).execute(todoListId, todoListTitle, currentUser.id);
  }

  async reorderTodo(
    todoListId: string,
    currentUser: CurrentUser,
    todoId: string,
    newIndex: number
  ) {
    await new ReorderTodo(
      this.todoLists,
      this.todoListPermissions,
      this.events
    ).execute(todoListId, currentUser.id, todoId, newIndex);
  }

  async grantAccess(
    todoListId: string,
    contributorEmail: string,
    currentUser: CurrentUser
  ) {
    await new GrantAccess(
      this.todoListPermissions,
      this.contributors,
      this.events
    ).execute(todoListId, currentUser.id, contributorEmail);
  }

  async revokeAccess(
    todoListId: string,
    contributorId: string,
    currentUser: CurrentUser
  ) {
    await new RevokeAccess(this.todoListPermissions).execute(
      todoListId,
      currentUser.id,
      contributorId
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
}
