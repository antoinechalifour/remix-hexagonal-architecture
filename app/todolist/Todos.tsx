import type { TodoDto } from "shared";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "front/ui/EmptyMessage";

interface TodosProps {
  title: string;
  todos: TodoDto[];
  emptyMessage: string;
  renderTodo: (todoItem: TodoDto, index: number) => React.ReactNode;
}

export const Todos = ({
  title,
  todos,
  emptyMessage,
  renderTodo,
}: TodosProps) => {
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
