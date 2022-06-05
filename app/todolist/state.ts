import type {
  CompletedTodoDto,
  DoingTodoDto,
  TodoListCollaboratorDto,
  TodoListPageDto,
} from "shared/client";
import type { MutableSnapshot } from "recoil";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect } from "react";
import { useLoaderData, useNavigate } from "remix";
import {
  addTodo,
  completedTodo,
  doingTodo,
  filterLabel,
  getTodo,
  hasTag,
  pushTag,
  removeTag,
  removeTodo,
  renameTodoInTodos,
  tagTodoInTodos,
  todosTaggedWith,
  untagTodoInTodos,
} from "front/todolist/model";

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

const matchingDoingTodosState = selector({
  key: RECOIL_KEYS.matchingDoingTodosState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const doingTodos = get(doingTodosState);

    if (!filterActive) return doingTodos;

    return todosTaggedWith(doingTodos, get(tagFilterState));
  },
});

const doingTodosLabelState = selector({
  key: RECOIL_KEYS.doingTodosLabelState,
  get: ({ get }) =>
    filterLabel(get(matchingDoingTodosState), get(doingTodosState)),
});

const matchingCompletedTodosState = selector({
  key: RECOIL_KEYS.matchingCompletedTodosState,
  get: ({ get }) => {
    const filterActive = get(filterActiveState);
    const completedTodos = get(completedTodosState);

    if (!filterActive) return completedTodos;

    return todosTaggedWith(completedTodos, get(tagFilterState));
  },
});

const completedTodosLabelState = selector({
  key: RECOIL_KEYS.completedTodosLabelState,
  get: ({ get }) =>
    filterLabel(get(matchingCompletedTodosState), get(completedTodosState)),
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
    setSelectedTags((tags) => pushTag(tags, tagToSelect));
  const deselect = (tagToDeselect: string) =>
    setSelectedTags((tags) => removeTag(tags, tagToDeselect));
  const clear = () => setSelectedTags([]);
  const isSelected = (tagToCheck: string) => hasTag(selectedTags, tagToCheck);

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
  const navigate = useNavigate();

  const [, setTodoListInfo] = useRecoilState(todoListInfoState);
  const [, setDoingTodos] = useRecoilState(doingTodosState);
  const [, setCompletedTodos] = useRecoilState(completedTodosState);
  const [, setCollaborators] = useRecoilState(collaboratorsState);

  useEffect(() => {
    const source = new EventSource(`/events/l/${loaderData.todoList.id}`);

    source.addEventListener("update", () => navigate(".", { replace: true }));

    return () => source.close();
  }, [navigate, loaderData.todoList.id]);

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
    setCompletedTodos(loaderData.todoList.completedTodos);
    setCollaborators(loaderData.collaborators);
  }, [
    loaderData,
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

export function useOptimisticUpdates() {
  const [, setTodoListInfo] = useRecoilState(todoListInfoState);
  const [doingTodos, setDoingTodos] = useRecoilState(doingTodosState);
  const [completedTodos, setCompletedTodos] =
    useRecoilState(completedTodosState);

  const renameTodoList = (title: string) =>
    setTodoListInfo((info) => ({
      ...info,
      title,
    }));

  const renameTodo = (id: string, title: string) => {
    setDoingTodos((todos) => renameTodoInTodos(todos, id, title));
    setCompletedTodos((todos) => renameTodoInTodos(todos, id, title));
  };

  const archiveTodo = (id: string) => {
    setDoingTodos((todos) => removeTodo(todos, id));
    setCompletedTodos((todos) => removeTodo(todos, id));
  };

  const markAsCompleted = (id: string) => {
    const todo = getTodo(doingTodos, id);
    if (todo == null) return;

    setDoingTodos((todos) => removeTodo(todos, id));
    setCompletedTodos((todos) => addTodo(todos, completedTodo(todo)));
  };

  const markAsDoing = (id: string) => {
    const todo = getTodo(completedTodos, id);
    if (todo == null) return;

    setCompletedTodos((todos) => removeTodo(todos, id));
    setDoingTodos((todos) => addTodo(todos, doingTodo(todo)));
  };

  const tagTodo = (id: string, tag: string) => {
    setDoingTodos((todos) => tagTodoInTodos(todos, id, tag));
    setCompletedTodos((todos) => tagTodoInTodos(todos, id, tag));
  };

  const untagTodo = (id: string, tag: string) => {
    setDoingTodos((todos) => untagTodoInTodos(todos, id, tag));
    setCompletedTodos((todos) => untagTodoInTodos(todos, id, tag));
  };

  return {
    renameTodoList: useCallback(renameTodoList, [setTodoListInfo]),
    renameTodo: useCallback(renameTodo, [setCompletedTodos, setDoingTodos]),
    archiveTodo: useCallback(archiveTodo, [setCompletedTodos, setDoingTodos]),
    markAsCompleted: useCallback(markAsCompleted, [
      doingTodos,
      setCompletedTodos,
      setDoingTodos,
    ]),
    markAsDoing: useCallback(markAsDoing, [
      completedTodos,
      setCompletedTodos,
      setDoingTodos,
    ]),
    tagTodo: useCallback(tagTodo, [setCompletedTodos, setDoingTodos]),
    untagTodo: useCallback(untagTodo, [setCompletedTodos, setDoingTodos]),
  };
}
