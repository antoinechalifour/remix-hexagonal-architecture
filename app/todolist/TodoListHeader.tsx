import type {
  TodoListContributorsDto,
  TodoListDetailsDto,
} from "shared/client";

import React from "react";
import { displayDate } from "front/Date";
import { AddTodoForm } from "front/todolist/AddTodoForm";
import { Collaborators } from "front/todolist/Collaborators";
import { TodoListEditableTitle } from "front/todolist/TodoListEditableTitle";

export type TodoListHeaderProps = {
  todoList: TodoListDetailsDto;
  collaborators: TodoListContributorsDto[];
};

export const TodoListHeader = ({
  todoList,
  collaborators,
}: TodoListHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <TodoListEditableTitle todoList={todoList} />
        <Collaborators collaborators={collaborators} />
      </div>

      <p className="pl-3 text-xs">
        ↳ You created this list {displayDate(todoList.createdAt)}
      </p>

      <AddTodoForm />
    </div>
  );
};
