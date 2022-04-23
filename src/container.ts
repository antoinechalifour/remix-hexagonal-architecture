// import { asClass, asValue, createContainer } from "awilix";
// import { PrismaClient } from "@prisma/client";
// import { TodoPrismaRepository } from "./todo-list-manager/persistence/TodoPrismaRepository";
// import { TodoListPrismaRepository } from "./todo-list-manager/persistence/TodoListPrismaRepository";
// import { FetchTodoListPrismaQuery } from "./todo-list-manager/query/FetchTodoListPrismaQuery";
// import { AddTodoList } from "./todo-list-manager/usecase/AddTodoList";
// import { AddTodo } from "./todo-list-manager/usecase/AddTodo";
// import { ChangeTodoCompletion } from "./todo-list-manager/usecase/ChangeTodoCompletion";
// import { ArchiveTodo } from "./todo-list-manager/usecase/ArchiveTodo";
// import { ArchiveTodoList } from "./todo-list-manager/usecase/ArchiveTodoList";
// import { CredentialsEnvironmentRepository } from "./authentication/persistence/CredentialsEnvironmentRepository";
// import { LoginFlow } from "web/authentication/LoginFlow";
// import { GenerateUUID } from "./todo-list-manager/infrastructure/GenerateUUID";
// import { RealClock } from "./todo-list-manager/infrastructure/RealClock";
//
// export const container = createContainer();
//
// container.register({
//   addTodoList: asClass(AddTodoList).singleton(),
//   addTodo: asClass(AddTodo).singleton(),
//   archiveTodoList: asClass(ArchiveTodoList).singleton(),
//   archiveTodo: asClass(ArchiveTodo).singleton(),
//   changeTodoCompletion: asClass(ChangeTodoCompletion).singleton(),
//   prisma: asValue(new PrismaClient()),
//   todos: asClass(TodoPrismaRepository).singleton(),
//   todoLists: asClass(TodoListPrismaRepository).singleton(),
//   fetchTodoList: asClass(FetchTodoListPrismaQuery).singleton(),
//   loginFlow: asClass(LoginFlow).singleton(),
//   credentials: asClass(CredentialsEnvironmentRepository).singleton(),
//   generateId: asClass(GenerateUUID).singleton(),
//   clock: asClass(RealClock).singleton(),
// });
