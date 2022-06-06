import type { TodoDto } from "shared/client";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "front/ui/EmptyMessage";

interface TodosProps {
  title: React.ReactNode;
  todos: TodoDto[];
  emptyMessage: string;
  renderTodo: (todoItem: TodoDto, index: number) => React.ReactNode;
}

export const Todos = ({
  title,
  todos,
  emptyMessage,
  renderTodo,
}: TodosProps) => (
  <section className="mt-8">
    {title}

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
