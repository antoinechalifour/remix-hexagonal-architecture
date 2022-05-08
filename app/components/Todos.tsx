import type { TodoListDto } from "shared";

import React from "react";
import { displayDate } from "../Date";
import { PageTitle } from "../ui/PageTitle";
import { AddTodoForm } from "./AddTodoForm";
import { TodoList } from "./TodoList";
import { TodoItem } from "front/components/TodoItem";
import { ReorderableTodoItem } from "front/components/ReorderableTodoItem";

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
      todos={todoList.doingTodos}
      emptyMessage="Come on! Don't you have anything to do?"
      renderTodo={(todoItem, index) => (
        <ReorderableTodoItem
          todoListId={todoList.id}
          todo={todoItem}
          index={index}
        />
      )}
    />

    <TodoList
      title="Things done"
      todos={todoList.completedTodos}
      emptyMessage="Alright let's get to work!"
      renderTodo={(todoItem, index) => (
        <TodoItem todoListId={todoList.id} todo={todoItem} />
      )}
    />
  </section>
);
