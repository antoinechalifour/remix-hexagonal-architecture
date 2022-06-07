import React from "react";
import { displayDate } from "front/Date";
import { AddTodoForm } from "front/todolist/TodoList/AddTodoForm";
import { Collaborators } from "front/todolist/Sharing/Collaborators";
import { TodoListEditableTitle } from "front/todolist/TodoList/TodoListEditableTitle";
import { TodoListCompletion } from "front/todolist/TodoList/TodoListCompletion";
import { useTodoListInfo } from "front/todolist/state";

export const TodoListHeader = () => {
  const { createdAt, isOwner } = useTodoListInfo();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
        <TodoListEditableTitle />
        <Collaborators className="mt-2 sm:mt-0" canShare={isOwner} />
      </div>

      <TodoListCompletion className="my-4" />

      <p className="pl-3 text-xs">↳ Created {displayDate(createdAt)}</p>

      <AddTodoForm />
    </div>
  );
};
