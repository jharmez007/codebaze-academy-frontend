export interface CommentType {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  avatar?: string;
  reactions: Record<string, number>;
  reactedByUser: Record<string, boolean>;
  replies: CommentType[];
}

export const addReplyRecursive = (
  arr: CommentType[],
  parentId: number,
  reply: CommentType
): CommentType[] =>
  arr.map((c) =>
    c.id === parentId
      ? { ...c, replies: [reply, ...(c.replies ?? [])] }
      : c.replies
      ? { ...c, replies: addReplyRecursive(c.replies, parentId, reply) }
      : c
  );

export const editRecursive = (
  arr: CommentType[],
  id: number,
  newText: string
): CommentType[] =>
  arr.map((c) =>
    c.id === id
      ? { ...c, text: newText }
      : c.replies
      ? { ...c, replies: editRecursive(c.replies, id, newText) }
      : c
  );

export const deleteRecursive = (arr: CommentType[], id: number): CommentType[] =>
  arr
    .filter((c) => c.id !== id)
    .map((c) => (c.replies ? { ...c, replies: deleteRecursive(c.replies, id) } : c));

export const reactRecursive = (
  arr: CommentType[],
  id: number,
  type: string
): CommentType[] =>
  arr.map((c) => {
    if (c.id === id) {
      const reacted = c.reactedByUser?.[type] ?? false;
      const count = c.reactions?.[type] ?? 0;
      return {
        ...c,
        reactions: { ...c.reactions, [type]: reacted ? Math.max(0, count - 1) : count + 1 },
        reactedByUser: { ...c.reactedByUser, [type]: !reacted },
      };
    }
    if (c.replies) return { ...c, replies: reactRecursive(c.replies, id, type) };
    return c;
  });
