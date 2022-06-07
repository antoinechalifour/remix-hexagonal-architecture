import type { TodoDto } from "shared/client";
import React from "react";
import { Popover } from "front/ui/Popover";
import { DeleteTodo } from "front/todolist/TodoItem/Popover/DeleteTodo";

export type TodoDangerZoneProps = { todo: TodoDto };
export const TodoDangerZone = ({ todo }: TodoDangerZoneProps) => (
  <>
    <Popover.SectionTitle className="text-danger">
      Danger zone
    </Popover.SectionTitle>

    <Popover.Item>
      <DeleteTodo todo={todo} />
    </Popover.Item>
  </>
);
