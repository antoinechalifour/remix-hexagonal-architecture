import type {
  DoingTodoDto,
  DoneTodos,
  TodoListPageDto,
  TodoListContributorDto,
} from "shared/client";
import type { MutableSnapshot } from "recoil";
import type { TodoDto } from "shared/client";
import { useCallback, useEffect, useRef } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

const RECOIL_KEYS = {
  tagFilterState: "tagFilterState",
  filterActiveState: "filterActiveState",
  contributorsState: "contributorsState",
  todoListInfoState: "todoListInfoState",
  doingTodosState: "doingTodosState",
  doingTodosLabelState: "doingTodosLabelState",
  matchingDoingTodosState: "matchingDoingTodosState",
  completedTodosState: "completedTodosState",
  completedTodosLabelState: "completedTodosLabelState",
  matchingCompletedTodosState: "matchingCompletedTodosState",
  todoListOutdatedState: "todoListOutdatedState",
};

const tagFilterState = atom<string[]>({
  key: RECOIL_KEYS.tagFilterState,
  default: [],
});

const filterActiveState = selector({
  key: RECOIL_KEYS.filterActiveState,
  get: ({ get }) => get(tagFilterState).length > 0,
});

const contributorsState = atom<TodoListContributorDto[]>({
  key: RECOIL_KEYS.contributorsState,
  default: [],
});

const todoListInfoState = atom({
  key: RECOIL_KEYS.todoListInfoState,
  default: {
    id: "",
    title: "",
    completion: 0,
    tags: [] as string[],
    createdAt: "",
    isOwner: false,
  },
});

const doingTodosState = atom<DoingTodoDto[]>({
  key: RECOIL_KEYS.doingTodosState,
  default: [],
});

const completedTodosState = atom<DoneTodos[]>({
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

const todoListOutdatedState = atom({
  key: RECOIL_KEYS.todoListOutdatedState,
  default: false,
});

export function makeInitialState({
  todoList,
  completion,
  contributors,
  isOwner,
}: TodoListPageDto) {
  return ({ set }: MutableSnapshot) => {
    set(todoListInfoState, {
      id: todoList.id,
      title: todoList.title,
      tags: todoList.tags,
      completion: completion,
      createdAt: todoList.createdAt,
      isOwner,
    });
    set(doingTodosState, todoList.doingTodos);
    set(completedTodosState, todoList.doneTodos);
    set(contributorsState, contributors);
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

export function useContributors() {
  return useRecoilValue(contributorsState);
}

export function useTodoListInfo() {
  return useRecoilValue(todoListInfoState);
}

export function useTodoListOutdated() {
  return useRecoilValue(todoListOutdatedState);
}

export function useSyncLoaderData() {
  const loaderData = useLoaderData<TodoListPageDto>();
  const navigate = useNavigate();
  const versionRef = useRef("");

  const setTodoListInfo = useSetRecoilState(todoListInfoState);
  const setDoingTodos = useSetRecoilState(doingTodosState);
  const setCompletedTodos = useSetRecoilState(completedTodosState);
  const setContributors = useSetRecoilState(contributorsState);
  const setTodoListOutdated = useSetRecoilState(todoListOutdatedState);

  useEffect(() => {
    versionRef.current = loaderData.todoList.version;
  });

  useEffect(() => {
    setTodoListOutdated(false);
  }, [loaderData, setTodoListOutdated]);

  useEffect(() => {
    const source = new EventSource(`/events/l/${loaderData.todoList.id}`);

    source.addEventListener("update", (e) => {
      if (versionRef.current !== e.data) setTodoListOutdated(true);
    });

    return () => source.close();
  }, [navigate, loaderData.todoList.id, setTodoListOutdated]);

  useEffect(() => {
    setTodoListInfo({
      id: loaderData.todoList.id,
      title: loaderData.todoList.title,
      tags: loaderData.todoList.tags,
      completion: loaderData.completion,
      createdAt: loaderData.todoList.createdAt,
      isOwner: loaderData.isOwner,
    });
    setDoingTodos(loaderData.todoList.doingTodos);
    setCompletedTodos(loaderData.todoList.doneTodos);
    setContributors(loaderData.contributors);
  }, [
    loaderData,
    setContributors,
    setCompletedTodos,
    setDoingTodos,
    setTodoListInfo,
  ]);
}

export function useTodos() {
  const doingTodos = useRecoilValue(matchingDoingTodosState);
  const doingTodosLabel = useRecoilValue(doingTodosLabelState);
  const completedTodos = useRecoilValue(matchingCompletedTodosState);
  const completedTodosLabel = useRecoilValue(completedTodosLabelState);

  return {
    doingTodos,
    completedTodos,
    doingTodosLabel,
    completedTodosLabel,
  };
}

export function useAllDoingTodos() {
  return useRecoilValue(doingTodosState);
}
