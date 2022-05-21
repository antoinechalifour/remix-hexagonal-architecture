import type { TodoDto, TodoListDto } from "shared/client";
import type { Filter } from "front/todolist/TagFilters";

import { useState } from "react";
import { isEmpty } from "fp-ts/Array";

function hasTagIn(todo: TodoDto, tags: string[]) {
  if (tags.length === 0) return true;
  return todo.tags.some((tag) => tags.includes(tag));
}

function makeFilterLabel(
  filter: Filter,
  partialList: unknown[],
  fullList: unknown[]
) {
  if (filter.isFiltered())
    return `showing ${partialList.length} of ${fullList.length}`;

  return fullList.length;
}

export function useTodoListFilter(todoList: TodoListDto) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const doingTodos = todoList.doingTodos.filter((todo) =>
    hasTagIn(todo, selectedTags)
  );
  const completedTodos = todoList.completedTodos.filter((todo) =>
    hasTagIn(todo, selectedTags)
  );

  const filter: Filter = {
    isFiltered: () => !isEmpty(selectedTags),
    isSelected: (tag) => selectedTags.includes(tag),
    select: (tagToSelect) => setSelectedTags((tags) => [...tags, tagToSelect]),
    unselect: (tagToUnselect) =>
      setSelectedTags((tags) => tags.filter((tag) => tagToUnselect !== tag)),
    reset: () => setSelectedTags([]),
  };

  return {
    filter,
    doingTodos,
    doingTodoFilterLabel: makeFilterLabel(
      filter,
      doingTodos,
      todoList.doingTodos
    ),
    completedTodos,
    completedTodoFilterLabel: makeFilterLabel(
      filter,
      completedTodos,
      todoList.completedTodos
    ),
  };
}
