import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { PrismaClient } from "@prisma/client";
import { TodoListPermissionsDatabaseRepository } from "todo-list-manager";
import { shareWithCollaborator } from "../../domain/TodoListPermission";
import { aTodoListPermission } from "../domain/builders/TodoListPermission";
import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";

let prisma: PrismaClient;
let todoListPermissions: TodoListPermissions;

beforeAll(() => configureTestingDatabaseEnvironment());

beforeEach(async () => {
  await prepareDatabase();

  prisma = new PrismaClient();
  todoListPermissions = new TodoListPermissionsDatabaseRepository(prisma);
});

it("persists and retrieves todo list permissions", async () => {
  // Arrange
  const theTodoListId = "22693e37-1c98-40c5-841f-40c53f11d86b";
  const theOwnerId = "592c26c0-3144-4ef0-b1ba-fa748e6ba2e3";
  const todoListPermission = aTodoListPermission()
    .forTodoList(theTodoListId)
    .forOwner(theOwnerId)
    .withCollaboratorsAuthorized(
      "b3bb9c18-1d45-4590-9f2e-870c9deebe06",
      "b53fe547-437c-4fed-8824-797bfe0305c6"
    )
    .build();

  // Persist
  await todoListPermissions.save(todoListPermission);

  expect(await todoListPermissions.ofTodoList(theTodoListId)).toEqual(
    todoListPermission
  );

  // By owner
  expect(await todoListPermissions.ofCollaborator(theOwnerId)).toEqual([
    todoListPermission,
  ]);

  // Update, by collaborator
  const newCollaboratorId = "03c02ef9-d429-4d5a-bde7-6cc0da1d0912";
  const newPermissions = shareWithCollaborator(
    todoListPermission,
    newCollaboratorId
  );
  await todoListPermissions.save(newPermissions);

  expect(await todoListPermissions.ofCollaborator(newCollaboratorId)).toEqual([
    newPermissions,
  ]);
});
