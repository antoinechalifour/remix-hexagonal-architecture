import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { RealClock } from "shared/time";
import { NestEvents } from "shared/events";
import { GenerateUUID } from "shared/id";
import { Prisma } from "shared/database";
import { PRISMA } from "../../keys";
import { TodoListUpdated } from "../domain/TodoListUpdated";
import { TodoListShared } from "../domain/TodoListShared";
import { AddTodoList } from "../usecase/AddTodoList";
import { ArchiveTodoList } from "../usecase/ArchiveTodoList";
import { ReorderTodos } from "../usecase/ReorderTodos";
import { RenameTodoList } from "../usecase/RenameTodoList";
import { ShareTodoList } from "../usecase/ShareTodoList";
import { ViewHomePage } from "../usecase/ViewHomePage";
import { ViewTodoList } from "../usecase/ViewTodoList";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { TodoListPermissionsDatabaseRepository } from "../infrastructure/TodoListPermissionsDatabaseRepository";
import { CollaboratorsAdapter } from "../infrastructure/CollaboratorsAdapter";
import { TodoListDatabaseQuery } from "../infrastructure/TodoListDatabaseQuery";

@Injectable()
export class TodoListApplicationService {
  constructor(
    @Inject(PRISMA) private readonly prisma: Prisma,
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly todoListPermissions: TodoListPermissionsDatabaseRepository,
    private readonly todoListQuery: TodoListDatabaseQuery,
    private readonly collaborators: CollaboratorsAdapter,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly events: NestEvents
  ) {}

  add(title: string, currentUser: CurrentUser) {
    return this.prisma.$transaction((prisma) =>
      new AddTodoList(
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

  async rename(
    todoListId: string,
    todoListTitle: string,
    currentUser: CurrentUser
  ) {
    await new RenameTodoList(this.todoLists, this.todoListPermissions).execute(
      todoListId,
      todoListTitle,
      currentUser.id
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async reorder(
    todoListId: string,
    currentUser: CurrentUser,
    todoId: string,
    newIndex: number
  ) {
    await new ReorderTodos(this.todoLists, this.todoListPermissions).execute(
      todoListId,
      currentUser.id,
      todoId,
      newIndex
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async share(
    todoListId: string,
    collaboratorEmail: string,
    currentUser: CurrentUser
  ) {
    await new ShareTodoList(
      this.todoListPermissions,
      this.collaborators
    ).execute(todoListId, currentUser.id, collaboratorEmail);

    this.events.publish(new TodoListShared(todoListId, collaboratorEmail));
  }

  viewHomePage(collaboratorId: string) {
    return new ViewHomePage(
      this.todoListPermissions,
      this.todoListQuery
    ).execute(collaboratorId);
  }

  viewTodoList(todoListId: string, collaboratorId: string) {
    return new ViewTodoList(
      this.todoListPermissions,
      this.collaborators,
      this.todoListQuery
    ).execute(todoListId, collaboratorId);
  }
}
