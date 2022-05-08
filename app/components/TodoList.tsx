import type { TodoDto } from "shared";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "../ui/EmptyMessage";

interface TodoListProps {
  title: string;
  todos: TodoDto[];
  emptyMessage: string;
  renderTodo: (todoItem: TodoDto, index: number) => React.ReactNode;
}

export const TodoList = ({
  title,
  todos,
  emptyMessage,
  renderTodo,
}: TodoListProps) => {
  return (
    <section className="mt-8">
      <h2 className="text-lg text-lighter">
        {title} ({todos.length})
      </h2>

      {isEmpty(todos) ? (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      ) : (
        <ol className="mt-4 space-y-2">
          {todos.map((todo, index) => (
            <li key={todo.id}>{renderTodo(todo, index)}</li>
          ))}
        </ol>
      )}
    </section>
  );
};
