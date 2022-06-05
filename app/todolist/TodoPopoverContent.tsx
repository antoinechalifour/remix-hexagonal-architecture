import type { TodoDto } from "shared/client";
import React from "react";
import { Popover } from "front/ui/Popover";
import { TagsList } from "front/todolist/TagsList";
import { AddTag } from "front/todolist/AddTag";
import { ArchiveTodo } from "front/todolist/ArchiveTodo";

export type TodoPopoverContentProps = {
  todo: TodoDto;
};

export const TodoPopoverContent = ({ todo }: TodoPopoverContentProps) => {
  return (
    <Popover.Content side="right">
      <Popover.SectionTitle className="text-faded">Tags</Popover.SectionTitle>

      <TagsList todo={todo} />
      <AddTag todo={todo} />

      <Popover.Separator />

      <Popover.SectionTitle className="text-danger">
        Danger zone
      </Popover.SectionTitle>

      <ArchiveTodo todo={todo} />

      <Popover.Arrow />
    </Popover.Content>
  );
};
