import format from "date-fns/formatDistanceToNow";

export const displayDate = (createdAt: string) =>
  format(new Date(createdAt), { addSuffix: true });
