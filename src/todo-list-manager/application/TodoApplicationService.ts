import { Inject, Injectable } from "@nestjs/common";
import { CurrentUser } from "authentication";
import { Prisma } from "shared/database";
import { RealClock } from "shared/time";
import { NestEvents } from "shared/events";
import { GenerateUUID } from "shared/id";
import { PRISMA } from "../../keys";
import { AddTodo } from "../usecase/AddTodo";
import { ChangeTodoCompletion } from "../usecase/ChangeTodoCompletion";
import { ArchiveTodo } from "../usecase/ArchiveTodo";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { TodoDatabaseRepository } from "../infrastructure/TodoDatabaseRepository";
import { TodoListPermissionsDatabaseRepository } from "../infrastructure/TodoListPermissionsDatabaseRepository";
import { RenameTodo } from "../usecase/RenameTodo";
import { TagTodo } from "../usecase/TagTodo";
import { UntagTodo } from "../usecase/UntagTodo";
import { TodoListUpdated } from "../domain/TodoListUpdated";

@Injectable()
export class TodoApplicationService {
  constructor(
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly todos: TodoDatabaseRepository,
    private readonly todoListPermissions: TodoListPermissionsDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    @Inject(PRISMA) private readonly prisma: Prisma,
    private readonly events: NestEvents
  ) {}

  async add(todoListId: string, title: string, currentUser: CurrentUser) {
    await this.prisma.$transaction((prisma) =>
      new AddTodo(
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

  async archive(todoListId: string, todoId: string, currentUser: CurrentUser) {
    await this.prisma.$transaction((prisma) =>
      new ArchiveTodo(
        new TodoListDatabaseRepository(prisma),
        new TodoListPermissionsDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma)
      ).execute(todoListId, todoId, currentUser.id)
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async changeTodoCompletion(
    todoListId: string,
    todoId: string,
    isChecked: string,
    currentUser: CurrentUser
  ) {
    await this.prisma.$transaction((prisma) =>
      new ChangeTodoCompletion(
        new TodoListDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma)
      ).execute(todoListId, todoId, isChecked, currentUser.id)
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async renameTodo(
    todoListId: string,
    todoId: string,
    title: string,
    currentUser: CurrentUser
  ) {
    await new RenameTodo(this.todos).execute(todoId, title, currentUser.id);

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async tagTogo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new TagTodo(this.todos).execute(todoId, currentUser.id, tag);

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async untagTogo(
    todoListId: string,
    todoId: string,
    tag: string,
    currentUser: CurrentUser
  ) {
    await new UntagTodo(this.todos).execute(todoId, currentUser.id, tag);

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }
}
