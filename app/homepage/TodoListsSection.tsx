import type { TodoListSummaryDto } from "shared/client";
import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "front/ui/EmptyMessage";
import { TodoListItem } from "front/homepage/TodoListItem";

export type TodoListsSectionProps = {
  title: string;
  emptyMessage: string;
  todoLists: TodoListSummaryDto[];
};
export const TodoListsSection = ({
  title,
  emptyMessage,
  todoLists,
}: TodoListsSectionProps) => (
  <section className="divide-y divide-dotted divide-light/30">
    <h2 className="pb-4 text-lg font-semibold text-lighter">{title}</h2>

    <div className="pt-4">
      {isEmpty(todoLists) ? (
        <EmptyMessage className="mt-0">{emptyMessage}</EmptyMessage>
      ) : (
        <ol className="space-y-2">
          {todoLists.map((todoList) => (
            <li key={todoList.id}>
              <TodoListItem todoList={todoList} />
            </li>
          ))}
        </ol>
      )}
    </div>
  </section>
);
