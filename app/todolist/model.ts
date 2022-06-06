import type { CompletedTodoDto, DoingTodoDto, TodoDto } from "shared/client";

export function hasTagIn(todo: TodoDto, tags: string[]) {
  if (tags.length === 0) return true;
  return todo.tags.some((tag) => tags.includes(tag));
}

export function todosTaggedWith(todos: TodoDto[], tags: string[]) {
  return todos.filter((todo) => hasTagIn(todo, tags));
}

export function filterLabel(matching: TodoDto[], all: TodoDto[]) {
  const matchingCount = matching.length;
  const allCount = all.length;

  if (matchingCount === allCount) return allCount;

  return `showing ${matchingCount} of ${allCount}`;
}

export function pushTag(tags: string[], tagToPush: string) {
  return [...tags, tagToPush];
}

export function removeTag(tags: string[], tagToRemove: string) {
  return tags.filter((tag) => tag !== tagToRemove);
}

export function hasTag(tags: string[], tagToCheck: string) {
  return tags.includes(tagToCheck);
}

export function getTodo<T extends TodoDto>(todos: T[], id: string) {
  return todos.find((todo) => todo.id === id);
}

export function removeTodo<T extends TodoDto>(todos: T[], id: string): T[] {
  return todos.filter((todo) => todo.id !== id);
}

export function addTodo<T extends TodoDto>(todos: T[], todo: T): T[] {
  return [todo, ...todos];
}

export function addTodoLast<T extends TodoDto>(todos: T[], todo: T): T[] {
  return [...todos, todo];
}

export function completedTodo(todo: DoingTodoDto): CompletedTodoDto {
  return {
    ...todo,
    isComplete: true,
  };
}

export function doingTodo(todo: CompletedTodoDto): DoingTodoDto {
  return {
    ...todo,
    isComplete: false,
  };
}

export function renameTodoInTodos<T extends TodoDto>(
  todos: T[],
  id: string,
  title: string
) {
  return todos.map((todo) => {
    if (todo.id !== id) return todo;

    return {
      ...todo,
      title,
    };
  });
}

function tagTodo<T extends TodoDto>(todo: T, tag: string): T {
  return {
    ...todo,
    tags: [...todo.tags, tag],
  };
}

export function tagTodoInTodos<T extends TodoDto>(
  todos: T[],
  id: string,
  tag: string
) {
  return todos.map((todo) => {
    if (todo.id !== id) return todo;

    return tagTodo(todo, tag);
  });
}

function untagTodo<T extends TodoDto>(todo: T, tagToRemove: string): T {
  return {
    ...todo,
    tags: todo.tags.filter((tag) => tag !== tagToRemove),
  };
}

export function untagTodoInTodos<T extends TodoDto>(
  todos: T[],
  id: string,
  tag: string
) {
  return todos.map((todo) => {
    if (todo.id !== id) return todo;

    return untagTodo(todo, tag);
  });
}
