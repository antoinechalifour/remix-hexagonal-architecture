import type {
  DoingTodoDto,
  CompletedTodoDto,
  TodoListPageDto,
  TodoListCollaboratorDto,
} from "shared/client";
import type { MutableSnapshot } from "recoil";
import type { TodoDto } from "shared/client";
import { useCallback, useEffect } from "react";
import { useLoaderData } from "remix";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useFetcher } from "@remix-run/react";

const RECOIL_KEYS = {
  tagFilterState: "tagFilterState",
  filterActiveState: "filterActiveState",
  collaboratorsState: "collaboratorsState",
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

const collaboratorsState = atom<TodoListCollaboratorDto[]>({
  key: RECOIL_KEYS.collaboratorsState,
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

export function makeInitialState({
  todoList,
  completion,
  collaborators,
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
    set(completedTodosState, todoList.completedTodos);
    set(collaboratorsState, collaborators);
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

export function useCollaborators() {
  const [collaborators] = useRecoilState(collaboratorsState);

  return collaborators;
}

export function useTodoListInfo() {
  const [todoListInfo] = useRecoilState(todoListInfoState);

  return todoListInfo;
}

export function useSyncLoaderData() {
  const loaderData = useLoaderData<TodoListPageDto>();
  const refresher = useFetcher<TodoListPageDto>();

  const [, setTodoListInfo] = useRecoilState(todoListInfoState);
  const [, setDoingTodos] = useRecoilState(doingTodosState);
  const [, setCompletedTodos] = useRecoilState(completedTodosState);
  const [, setCollaborators] = useRecoilState(collaboratorsState);

  const todoListPage = refresher.data || loaderData;
  const load = refresher.load;

  useEffect(() => {
    const source = new EventSource(`/events/l/${todoListPage.todoList.id}`);

    source.addEventListener("update", () => load(window.location.pathname));

    return () => source.close();
  }, [load, todoListPage.todoList.id]);

  useEffect(() => {
    setTodoListInfo({
      id: todoListPage.todoList.id,
      title: todoListPage.todoList.title,
      tags: todoListPage.todoList.tags,
      completion: todoListPage.completion,
      createdAt: todoListPage.todoList.createdAt,
      isOwner: todoListPage.isOwner,
    });
    setDoingTodos(todoListPage.todoList.doingTodos);
    setCompletedTodos(todoListPage.todoList.completedTodos);
    setCollaborators(todoListPage.collaborators);
  }, [
    todoListPage,
    setCollaborators,
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
