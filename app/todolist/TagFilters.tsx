import React from "react";
import classNames from "classnames";
import { isEmpty } from "fp-ts/Array";
import { PlainButton } from "front/ui/Button";
import { TodoTag } from "front/todolist/TodoTag";
import { useFilter } from "front/todolist/state";

type TagFiltersProps = {
  tags: string[];
};

export const TagFilters = ({ tags }: TagFiltersProps) => {
  const filter = useFilter();
  if (isEmpty(tags)) return null;

  return (
    <nav className="space-y-2 pt-10">
      <p>
        Filter by tag{" "}
        {filter.active && (
          <PlainButton
            className="ml-1 text-xs underline"
            onClick={filter.clear}
          >
            clear
          </PlainButton>
        )}
      </p>

      <ul className="flex w-full flex-wrap">
        {tags.map((tag) => {
          const active = filter.isSelected(tag);
          const handler = active ? filter.deselect : filter.select;

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
