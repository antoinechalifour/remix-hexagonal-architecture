import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";
import { PrismaClient } from "@prisma/client";
import { TodoListDatabaseQuery } from "todo-list-manager";

let prisma: PrismaClient;
let query: TodoListDatabaseQuery;

beforeAll(() => configureTestingDatabaseEnvironment());

beforeEach(async () => {
  await prepareDatabase();

  prisma = new PrismaClient();
  query = new TodoListDatabaseQuery(prisma);
});

it("returns the details of a TodoList", async () => {
  // Arrange
  const theTodoListId = "52421b1b-2cc6-4f91-9811-bb920084b1ba";
  await prisma.$transaction([
    prisma.todoList.create({
      data: {
        id: theTodoListId,
        todosOrder: [
          "9fc17fc3-a7f3-4552-b762-c6c25033da94",
          "5498ad46-6ce9-4129-b604-5d286d2c1534",
        ],
        createdAt: new Date("2022-05-29T14:00:00.000Z"),
        title: "Example todo list",
      },
    }),
    prisma.todo.create({
      data: {
        id: "5498ad46-6ce9-4129-b604-5d286d2c1534",
        createdAt: new Date("2022-05-29T14:30:00.000Z"),
        title: "Buy pizza",
        tags: ["shopping", "food"],
        isDone: false,
        todoListId: theTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
        createdAt: new Date("2022-05-29T14:35:00.000Z"),
        title: "Buy beers",
        tags: ["shopping", "food", "fun"],
        isDone: false,
        todoListId: theTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
        createdAt: new Date("2022-05-29T14:40:00.000Z"),
        title: "Buy milk",
        tags: ["shopping"],
        isDone: true,
        doneAt: new Date("2022-06-01T14:40:00.000Z"),
        todoListId: theTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "d6c76bb3-68f0-47d6-8818-0cfd180f6997",
        createdAt: new Date("2022-05-29T14:50:00.000Z"),
        title: "Buy brioche",
        tags: ["shopping"],
        isDone: true,
        doneAt: new Date("2022-06-05T14:40:00.000Z"),
        todoListId: theTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "f7a445b8-ff7e-4a86-a9ed-fb23dd2afc2d",
        createdAt: new Date("2022-05-29T15:00:00.000Z"),
        title: "Buy bread",
        tags: ["shopping"],
        isDone: true,
        doneAt: new Date("2022-05-30T14:40:00.000Z"),
        todoListId: theTodoListId,
      },
    }),
  ]);

  // Act
  const details = await query.detailsOfTodoList(theTodoListId);

  // Assert
  expect(details).toEqual({
    id: "52421b1b-2cc6-4f91-9811-bb920084b1ba",
    title: "Example todo list",
    tags: ["food", "fun", "shopping"],
    createdAt: "2022-05-29T14:00:00+00:00",
    doneTodos: [
      {
        id: "d6c76bb3-68f0-47d6-8818-0cfd180f6997",
        title: "Buy brioche",
        isDone: true,
        createdAt: "2022-05-29T14:50:00+00:00",
        tags: ["shopping"],
      },
      {
        id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
        title: "Buy milk",
        isDone: true,
        createdAt: "2022-05-29T14:40:00+00:00",
        tags: ["shopping"],
      },
      {
        id: "f7a445b8-ff7e-4a86-a9ed-fb23dd2afc2d",
        title: "Buy bread",
        isDone: true,
        createdAt: "2022-05-29T15:00:00+00:00",
        tags: ["shopping"],
      },
    ],
    doingTodos: [
      {
        createdAt: "2022-05-29T14:35:00+00:00",
        id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
        isDone: false,
        tags: ["shopping", "food", "fun"],
        title: "Buy beers",
      },
      {
        createdAt: "2022-05-29T14:30:00+00:00",
        id: "5498ad46-6ce9-4129-b604-5d286d2c1534",
        isDone: false,
        tags: ["shopping", "food"],
        title: "Buy pizza",
      },
    ],
  });
});

it("returns the summary of the given TodoLists (none given)", async () => {
  // Act
  const summary = await query.summaryOfTodoLists([]);

  // Assert
  expect(summary).toEqual([]);
});

it("returns the summary of the given TodoLists (multiple given)", async () => {
  const theFirstTodoListId = "52421b1b-2cc6-4f91-9811-bb920084b1ba";
  const theSecondTodoListId = "801c2b48-4f56-414e-8f40-8a7714a7d302";
  await prisma.$transaction([
    prisma.todoList.create({
      data: {
        id: theFirstTodoListId,
        todosOrder: [
          "9fc17fc3-a7f3-4552-b762-c6c25033da94",
          "5498ad46-6ce9-4129-b604-5d286d2c1534",
          "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
        ],
        createdAt: new Date("2022-05-29T14:00:00.000Z"),
        title: "Food",
      },
    }),
    prisma.todoList.create({
      data: {
        id: theSecondTodoListId,
        todosOrder: ["159f5d93-7a1e-417f-9bcc-16b94b458aa2"],
        createdAt: new Date("2022-05-30T14:00:00.000Z"),
        title: "Things to fix",
      },
    }),
    prisma.todo.create({
      data: {
        id: "5498ad46-6ce9-4129-b604-5d286d2c1534",
        createdAt: new Date("2022-05-29T14:30:00.000Z"),
        title: "Buy pizza",
        tags: ["shopping", "food"],
        isDone: false,
        todoListId: theFirstTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
        createdAt: new Date("2022-05-29T14:35:00.000Z"),
        title: "Buy beers",
        tags: ["shopping", "food", "fun"],
        isDone: false,
        todoListId: theFirstTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
        createdAt: new Date("2022-05-29T14:40:00.000Z"),
        title: "Buy milk",
        tags: ["shopping"],
        isDone: true,
        todoListId: theFirstTodoListId,
      },
    }),
    prisma.todo.create({
      data: {
        id: "159f5d93-7a1e-417f-9bcc-16b94b458aa2",
        createdAt: new Date("2022-05-30T14:00:00.000Z"),
        title: "Car",
        tags: ["broken"],
        isDone: false,
        todoListId: theSecondTodoListId,
      },
    }),
  ]);

  // Act
  const summary = await query.summaryOfTodoLists([
    theFirstTodoListId,
    theSecondTodoListId,
  ]);

  // Assert
  expect(summary).toEqual([
    {
      createdAt: "2022-05-29T14:00:00+00:00",
      id: "52421b1b-2cc6-4f91-9811-bb920084b1ba",
      numberOfTodos: 2,
      title: "Food",
    },
    {
      createdAt: "2022-05-30T14:00:00+00:00",
      id: "801c2b48-4f56-414e-8f40-8a7714a7d302",
      numberOfTodos: 1,
      title: "Things to fix",
    },
  ]);
});
