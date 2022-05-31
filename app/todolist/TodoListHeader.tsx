import type {
  TodoListContributorsDto,
  TodoListDetailsDto,
} from "shared/client";

import React from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";
import { displayDate } from "front/Date";
import { AddTodoForm } from "front/todolist/AddTodoForm";
import classNames from "classnames";
import { colorFromString } from "front/palette";

export type TodoListHeaderProps = {
  todoList: TodoListDetailsDto;
  collaborators: TodoListContributorsDto[];
};

const CollaboratorPin = ({ children }: { children: string }) => {
  return (
    <div
      className={classNames(
        "flex h-[25px] w-[25px] items-center justify-center rounded-full font-mono text-xs font-bold uppercase",
        colorFromString(children)
      )}
    >
      {children}
    </div>
  );
};

export const TodoListHeader = ({
  todoList,
  collaborators,
}: TodoListHeaderProps) => {
  const updateTodoListTitle = useFetcher();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <updateTodoListTitle.Form
          method="post"
          action={`/l/${todoList.id}/rename`}
        >
          <EditableContent
            initialValue={todoList.title}
            inputName="title"
            inputClassName="text-2xl font-semibold text-lighter"
          >
            <PageTitle>{todoList.title}</PageTitle>
          </EditableContent>
        </updateTodoListTitle.Form>

        <ul className="flex space-x-2">
          {collaborators.map((collaborator) => (
            <li key={collaborator.id}>
              <CollaboratorPin>{collaborator.shortName}</CollaboratorPin>
            </li>
          ))}
        </ul>
      </div>

      <p className="pl-3 text-xs">
        ↳ You created this list {displayDate(todoList.createdAt)}
      </p>

      <AddTodoForm />
    </div>
  );
};
