// /comment.ts
export interface CommentType {
  id: number;
  author: string;
  role?: string;
  avatar?: string;
  text: string;
  timestamp?: string;
  reactions: Record<string, number>;
  reactedByUser: Record<string, boolean>;
  replies: CommentType[];
}
