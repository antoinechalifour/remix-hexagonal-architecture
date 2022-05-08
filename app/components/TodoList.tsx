import type { TodoDto } from "shared";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "../ui/EmptyMessage";
import { TodoItem } from "./TodoItem";
import { useFetcher } from "@remix-run/react";
import { useDrop } from "react-dnd";

interface TodoListProps {
  title: string;
  todoListId: string;
  todos: TodoDto[];
  emptyMessage: string;
}

export const TodoList = ({
  title,
  todoListId,
  todos,
  emptyMessage,
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
            <li key={todo.id}>
              <TodoItem todoListId={todoListId} todo={todo} index={index} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
