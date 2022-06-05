import React from "react";
import classNames from "classnames";
import { isEmpty } from "fp-ts/Array";
import { PlainButton } from "front/ui/Button";
import { TodoTag } from "front/todolist/TodoTag";
import { useFilter, useTodoListInfo } from "front/todolist/state";

export const TagFilters = () => {
  const { active, clear, deselect, isSelected, select } = useFilter();
  const { tags } = useTodoListInfo();

  if (isEmpty(tags)) return null;

  return (
    <nav className="space-y-2 pt-10">
      <p>
        Filter by tag{" "}
        {active && (
          <PlainButton className="ml-1 text-xs underline" onClick={clear}>
            clear
          </PlainButton>
        )}
      </p>

      <ul className="flex w-full flex-wrap">
        {tags.map((tag) => {
          const active = isSelected(tag);
          const handler = active ? deselect : select;

          return (
            <li key={tag} className="p-1">
              <PlainButton
                onClick={() => handler(tag)}
                className={"cursor-pointer rounded"}
              >
                <TodoTag
                  className={classNames("transition-opacity", {
                    "opacity-30": !active,
                  })}
                >
                  {tag}
                </TodoTag>
              </PlainButton>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
