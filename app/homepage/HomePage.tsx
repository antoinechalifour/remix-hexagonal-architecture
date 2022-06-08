import type { HomePageDto } from "shared/client";

import React from "react";
import { PageTitle } from "front/ui/PageTitle";
import { AddTodoListForm } from "front/homepage/AddTodoListForm";
import { useLoaderData } from "@remix-run/react";
import { TodoListsSection } from "front/homepage/TodoListsSection";

export const HomePage = () => {
  const { todoListsOwned, todoListsContributed } = useLoaderData<HomePageDto>();

  return (
    <section className="space-y-14">
      <PageTitle>Welcome</PageTitle>

      <AddTodoListForm />

      <TodoListsSection
        title="Your todo lists"
        emptyMessage="You have not created any todo list yet."
        todoLists={todoListsOwned}
      />

      <TodoListsSection
        title="Shared with you"
        emptyMessage="No todo list has been shared with you yet!"
        todoLists={todoListsContributed}
      />
    </section>
  );
};
