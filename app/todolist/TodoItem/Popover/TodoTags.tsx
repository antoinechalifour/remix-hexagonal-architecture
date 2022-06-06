import type { TodoDto } from "shared/client";
import React from "react";
import { Popover } from "front/ui/Popover";
import { TagsList } from "front/todolist/TodoItem/Popover/TagsList";
import { AddTag } from "front/todolist/TodoItem/Popover/AddTag";

export type TodoTagsProps = { todo: TodoDto };
export const TodoTags = ({ todo }: TodoTagsProps) => (
  <>
    <Popover.SectionTitle className="text-faded">Tags</Popover.SectionTitle>
    <TagsList todo={todo} />
    <AddTag todo={todo} />
  </>
);
