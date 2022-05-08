import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { Form, useSubmit, useTransition } from "remix";
import { CheckboxOption } from "../ui/CheckboxOption";
import { Button } from "../ui/Button";
import { useDrag, useDrop } from "react-dnd";
import { useFetcher } from "@remix-run/react";

interface TodoItemProps {
  todoListId: string;
  todo: TodoDto;
  index: number;
}

interface DragItem {
  todoId: string;
}

interface DropResult {
  newIndex: number;
}

interface CollectedProps {
  isDragging: boolean;
}

const useReorderTodo = (
  todoListId: string,
  todoId: string,
  currentIndex: number
) => {
  const todosOrder = useFetcher();

  const moveTodo = (newIndex: number) => {
    const formData = new FormData();
    formData.append("todoId", todoId);
    formData.append("newIndex", newIndex.toString());

    todosOrder.submit(formData, {
      method: "put",
      action: `/l/${todoListId}/order`,
    });
  };

  const [{ isDragging }, drag] = useDrag<DragItem, DropResult, CollectedProps>({
    type: "todo",
    item: { todoId: todoId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      console.log(dropResult);
      if (dropResult?.newIndex) moveTodo(dropResult.newIndex);
    },
  });

  const [, drop] = useDrop<DragItem, DropResult>({
    accept: "todo",
    drop: () => ({
      newIndex: currentIndex,
    }),
  });

  return {
    isDragging,
    ref: (node: HTMLDivElement | null) => drag(drop(node)),
  };
};

export const TodoItem = ({ todoListId, todo, index }: TodoItemProps) => {
  const { ref, isDragging } = useReorderTodo(todoListId, todo.id, index);
  const submit = useSubmit();
  const transition = useTransition();
  const htmlId = `todo-${todo.id}`;
  const completionAction = `/l/${todoListId}/todo/${todo.id}`;
  const archiveAction = `/l/${todoListId}/todo/${todo.id}/archive`;
  const isArchiving = transition.submission?.action === archiveAction;

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
    submit(e.currentTarget);

  return (
    <div
      ref={ref}
      className={classNames(
        "grid grid-cols-[1fr_auto] items-center gap-3",
        "rounded-2xl py-4 px-6",
        "bg-dark shadow",
        { "opacity-50": isArchiving, "opacity-25": isDragging }
      )}
    >
      <Form
        method="post"
        action={completionAction}
        onChange={handleChange}
        replace
      >
        <CheckboxOption
          id={htmlId}
          isChecked={todo.isComplete}
          label={
            <span
              className={classNames({
                "line-through opacity-75": todo.isComplete,
              })}
            >
              {todo.title}
            </span>
          }
        />
      </Form>

      <Form method="post" action={archiveAction} replace>
        <Button disabled={isArchiving} title="Archive this todo">
          🗑
        </Button>
      </Form>
    </div>
  );
};
