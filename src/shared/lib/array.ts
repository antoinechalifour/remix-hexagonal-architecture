export function moveArrayItem<T>(
  source: T[],
  currentIndex: number,
  newIndex: number
) {
  const copy = [...source];
  const element = copy[currentIndex];
  copy.splice(currentIndex, 1);
  copy.splice(newIndex, 0, element);

  return copy;
}
