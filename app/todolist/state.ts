import type {
  DoingTodoDto,
  CompletedTodoDto,
  TodoListPageDto,
} from "shared/client";
import type { MutableSnapshot } from "recoil";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect } from "react";
import type { TodoDto } from "shared/client";
import { useLoaderData } from "remix";

const RECOIL_KEYS = {
  tagFilterState: "tagFilterState",
  filterActiveState: "filterActiveState",
  todoListInfoState: "todoListInfoState",
  doingTodosState: "doingTodosState",
  doingTodosLabelState: "doingTodosLabelState",
  matchingDoingTodosState: "matchingDoingTodosState",
  completedTodosState: "completedTodosState",
  completedTodosLabelState: "completedTodosLabelState",
  matchingCompletedTodosState: "matchingCompletedTodosState",
};

const tagFilterState = atom<string[]>({
  key: RECOIL_KEYS.tagFilterState,
  default: [],
});

const filterActiveState = selector({
  key: RECOIL_KEYS.filterActiveState,
  get: ({ get }) => get(tagFilterState).length > 0,
});

const todoListInfoState = atom({
  key: RECOIL_KEYS.todoListInfoState,
  default: {
    id: "",
    title: "",
    completion: 0,
    tags: [] as string[],
  },
});

const doingTodosState = atom<DoingTodoDto[]>({
  key: RECOIL_KEYS.doingTodosState,
  default: [],
});

const completedTodosState = atom<CompletedTodoDto[]>({
  key: RECOIL_KEYS.completedTodosState,
  default: [],
});

function hasTagIn(todo: TodoDto, tags: string[]) {
  if (tags.length === 0) return true;
  return todo.tags.some((tag) => tags.includes(tag));
}

const matchingDoingTodosState = selector({
  key: RECOIL_KEYS.matchingDoingTodosState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const doingTodos = get(doingTodosState);

    if (!filterActive) return doingTodos;

    const selectedTags = get(tagFilterState);
    return doingTodos.filter((todo) => hasTagIn(todo, selectedTags));
  },
});

const doingTodosLabelState = selector({
  key: RECOIL_KEYS.doingTodosLabelState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const doingTodos = get(doingTodosState);

    if (!filterActive) return doingTodos.length;

    const matchingTodos = get(matchingDoingTodosState);
    return `showing ${matchingTodos.length} of ${doingTodos.length}`;
  },
});

const matchingCompletedTodosState = selector({
  key: RECOIL_KEYS.matchingCompletedTodosState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const completedTodos = get(completedTodosState);

    if (!filterActive) return completedTodos;

    const selectedTags = get(tagFilterState);
    return completedTodos.filter((todo) => hasTagIn(todo, selectedTags));
  },
});

const completedTodosLabelState = selector({
  key: RECOIL_KEYS.completedTodosLabelState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const completedTodos = get(completedTodosState);

    if (!filterActive) return completedTodos.length;

    const matchingTodos = get(matchingCompletedTodosState);
    return `showing ${matchingTodos.length} of ${completedTodos.length}`;
  },
});

export function makeInitialState({ todoList, completion }: TodoListPageDto) {
  return ({ set }: MutableSnapshot) => {
    set(todoListInfoState, {
      id: todoList.id,
      title: todoList.title,
      tags: todoList.tags,
      completion: completion,
    });
    set(doingTodosState, todoList.doingTodos);
    set(completedTodosState, todoList.completedTodos);
  };
}

export function useFilter() {
  const [selectedTags, setSelectedTags] = useRecoilState(tagFilterState);
  const active = useRecoilValue(filterActiveState);

  const select = (tagToSelect: string) =>
    setSelectedTags((tags) => [...tags, tagToSelect]);
  const deselect = (tagToDeselect: string) =>
    setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDeselect));
  const clear = () => setSelectedTags([]);
  const isSelected = (tagToCheck: string) => selectedTags.includes(tagToCheck);

  return {
    active,
    select: useCallback(select, [setSelectedTags]),
    deselect: useCallback(deselect, [setSelectedTags]),
    clear: useCallback(clear, [setSelectedTags]),
    isSelected: useCallback(isSelected, [selectedTags]),
  };
}

export function useTodoList() {
  const loaderData = useLoaderData<TodoListPageDto>();

  const [todoListInfo, setTodoListInfo] = useRecoilState(todoListInfoState);
  const [, setDoingTodos] = useRecoilState(doingTodosState);
  const [, setCompletedTodos] = useRecoilState(completedTodosState);
  const doingTodos = useRecoilValue(matchingDoingTodosState);
  const doingTodosLabel = useRecoilValue(doingTodosLabelState);
  const completedTodos = useRecoilValue(matchingCompletedTodosState);
  const completedTodosLabel = useRecoilValue(completedTodosLabelState);

  useEffect(() => {
    setTodoListInfo({
      id: loaderData.todoList.id,
      title: loaderData.todoList.title,
      tags: loaderData.todoList.tags,
      completion: loaderData.completion,
    });
    setDoingTodos(loaderData.todoList.doingTodos);
    setCompletedTodos(loaderData.todoList.completedTodos);
  }, [loaderData, setCompletedTodos, setDoingTodos, setTodoListInfo]);

  return {
    todoListInfo,
    doingTodos,
    completedTodos,
    doingTodosLabel,
    completedTodosLabel,
  };
}
