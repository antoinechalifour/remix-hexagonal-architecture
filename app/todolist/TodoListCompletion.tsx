import classNames from "classnames";
import { Tooltip } from "front/ui/Tooltip";
import { useTodoListInfo } from "front/todolist/state";

export type TodoListCompletionProps = {
  className?: string;
};

export const TodoListCompletion = ({ className }: TodoListCompletionProps) => {
  const { completion } = useTodoListInfo();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={classNames("relative h-1 rounded bg-dark/50", className)}
        >
          <p className="sr-only">This todo list is ${completion}% complete.</p>

          <div
            className="absolute top-0 bottom-0 left-0 rounded bg-gradient-to-r from-sky-300 to-lime-300 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </Tooltip.Trigger>

      <Tooltip.Content sideOffset={4}>
        <Tooltip.Arrow />
        {completion}% complete
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
