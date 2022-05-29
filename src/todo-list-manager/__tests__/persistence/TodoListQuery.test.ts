import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";
import { PrismaClient } from "@prisma/client";
import { TodoListDatabaseQuery } from "todo-list-manager";

describe("TodoListDatabaseQuery", () => {
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
            "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
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
          isComplete: false,
          todoListId: theTodoListId,
        },
      }),
      prisma.todo.create({
        data: {
          id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
          createdAt: new Date("2022-05-29T14:35:00.000Z"),
          title: "Buy beers",
          tags: ["shopping", "food", "fun"],
          isComplete: false,
          todoListId: theTodoListId,
        },
      }),
      prisma.todo.create({
        data: {
          id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
          createdAt: new Date("2022-05-29T14:40:00.000Z"),
          title: "Buy milk",
          tags: ["shopping"],
          isComplete: true,
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
      completedTodos: [
        {
          createdAt: "2022-05-29T14:40:00+00:00",
          id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
          isComplete: true,
          tags: ["shopping"],
          title: "Buy milk",
        },
      ],
      doingTodos: [
        {
          createdAt: "2022-05-29T14:35:00+00:00",
          id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
          isComplete: false,
          tags: ["shopping", "food", "fun"],
          title: "Buy beers",
        },
        {
          createdAt: "2022-05-29T14:30:00+00:00",
          id: "5498ad46-6ce9-4129-b604-5d286d2c1534",
          isComplete: false,
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
    expect(summary).toEqual({ todoLists: [], totalNumberOfDoingTodos: 0 });
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
          isComplete: false,
          todoListId: theFirstTodoListId,
        },
      }),
      prisma.todo.create({
        data: {
          id: "9fc17fc3-a7f3-4552-b762-c6c25033da94",
          createdAt: new Date("2022-05-29T14:35:00.000Z"),
          title: "Buy beers",
          tags: ["shopping", "food", "fun"],
          isComplete: false,
          todoListId: theFirstTodoListId,
        },
      }),
      prisma.todo.create({
        data: {
          id: "1949fc6a-87e6-4772-b9d9-0a742c5872fd",
          createdAt: new Date("2022-05-29T14:40:00.000Z"),
          title: "Buy milk",
          tags: ["shopping"],
          isComplete: true,
          todoListId: theFirstTodoListId,
        },
      }),
      prisma.todo.create({
        data: {
          id: "159f5d93-7a1e-417f-9bcc-16b94b458aa2",
          createdAt: new Date("2022-05-30T14:00:00.000Z"),
          title: "Car",
          tags: ["broken"],
          isComplete: false,
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
    expect(summary).toEqual({
      totalNumberOfDoingTodos: 3,
      todoLists: [
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
      ],
    });
  });
});
