import React from "react";
import classNames from "classnames";
import { PlainButton } from "front/ui/Button";
import { TodoTag } from "front/todolist/TodoTag";

export interface Filter {
  isFiltered: () => boolean;
  isSelected: (tag: string) => boolean;
  reset: () => void;
  select: (tag: string) => void;
  unselect: (tag: string) => void;
}

type TagFiltersProps = {
  tags: string[];
  filter: Filter;
};

export const TagFilters = ({ tags, filter }: TagFiltersProps) => (
  <nav className="space-y-2">
    <p>
      Filter by tag{" "}
      {filter.isFiltered() && (
        <PlainButton className="ml-1 text-xs underline" onClick={filter.reset}>
          clear
        </PlainButton>
      )}
    </p>

    <ul className="flex w-full flex-wrap">
      {tags.map((tag) => {
        const active = filter.isSelected(tag);
        const handler = active ? filter.unselect : filter.select;

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
