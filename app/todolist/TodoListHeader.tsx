import React from "react";
import { displayDate } from "front/Date";
import { AddTodoForm } from "front/todolist/AddTodoForm";
import { Collaborators } from "front/todolist/Collaborators";
import { TodoListEditableTitle } from "front/todolist/TodoListEditableTitle";
import { TodoListCompletion } from "front/todolist/TodoListCompletion";
import { useTodoListInfo } from "front/todolist/state";

export const TodoListHeader = () => {
  const { createdAt, id, isOwner } = useTodoListInfo();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
        <TodoListEditableTitle />
        <Collaborators
          className="mt-2 sm:mt-0"
          todoListId={id}
          canShare={isOwner}
        />
      </div>

      <TodoListCompletion className="my-4" />

      <p className="pl-3 text-xs">↳ Created {displayDate(createdAt)}</p>

      <AddTodoForm />
    </div>
  );
};
