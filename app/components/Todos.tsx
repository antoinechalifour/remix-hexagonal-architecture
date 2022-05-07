import type { TodoListDto } from "shared";

import React from "react";
import { displayDate } from "../Date";
import { PageTitle } from "../ui/PageTitle";
import { AddTodoForm } from "./AddTodoForm";
import { TodoList } from "./TodoList";

interface TodosProps {
  todoList: TodoListDto;
}

export const Todos = ({ todoList }: TodosProps) => (
  <section className="space-y-10">
    <div className="space-y-4">
      <PageTitle>{todoList.title}</PageTitle>

      <p className="pl-3 text-xs">
        ↳ You created this list {displayDate(todoList.createdAt)}
      </p>

      <AddTodoForm
        todoListId={todoList.id}
        key={todoList.completedTodos.length + todoList.doingTodos.length}
      />
    </div>

    <TodoList
      title="Things to do"
      todoListId={todoList.id}
      todos={todoList.doingTodos}
      emptyMessage="Come on! Don't you have anything to do?"
    />

    <TodoList
      title="Things done"
      todoListId={todoList.id}
      todos={todoList.completedTodos}
      emptyMessage="Alright let's get to work!"
    />
  </section>
);
