"use client";

import React, { useMemo, useState } from "react";
import { mockComments, CommentType } from "@/data/comments";
import ConfirmModal from "./ConfirmModal";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { addReplyRecursive, editRecursive, deleteRecursive, reactRecursive } from "./helpers";

const CommentsSection: React.FC = () => {
  const currentUser = "You";
  const [comments, setComments] = useState<CommentType[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "delete" | "report"; id: number | null; }>({
    open: false,
    action: "delete",
    id: null,
  });

  const INITIAL = 3;
  const LOAD_MORE_STEP = 5;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL);
  const visibleComments = useMemo(() => comments.slice(0, visibleCount), [comments, visibleCount]);

  const handleAddComment = (text: string, parentId?: number) => {
    const comment: CommentType = {
      id: Date.now(),
      author: currentUser,
      text,
      timestamp: "Just now",
      avatar: "https://i.pravatar.cc/150?img=20",
      reactions: {},
      reactedByUser: {},
      replies: [],
    };
    if (!parentId) setComments((prev) => [comment, ...prev]);
    else setComments((prev) => addReplyRecursive(prev, parentId, comment));
  };

  const handleEdit = (id: number, text: string) => setComments((prev) => editRecursive(prev, id, text));
  const handleDeleteConfirm = (id: number) => {
    setComments((prev) => deleteRecursive(prev, id));
    setConfirmModal({ open: false, action: "delete", id: null });
  };
  const handleReportConfirm = (id: number) => {
    alert(`Reported comment ${id}`);
    setConfirmModal({ open: false, action: "report", id: null });
  };
  const handleReact = (id: number, type: string) => setComments((prev) => reactRecursive(prev, id, type));

  return (
    <div className="mt-6 border-t border-gray-300 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-black">Comments</h3>

      {visibleCount < comments.length && (
        <button
          onClick={() => setVisibleCount((v) => Math.min(comments.length, v + LOAD_MORE_STEP))}
          className="py-1 px-4 text-sm hover:bg-gray-200 rounded-md flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Show {Math.min(LOAD_MORE_STEP, comments.length - visibleCount)} more...
        </button>
      )}

      <div className="mt-4 space-y-4">
        {visibleComments.map((c) => (
          <Comment
            key={c.id}
            comment={c}
            currentUser={currentUser}
            onReply={(parentId, text) => handleAddComment(text, parentId)}
            onEdit={handleEdit}
            onDelete={(id) => setConfirmModal({ open: true, action: "delete", id })}
            onReport={(id) => setConfirmModal({ open: true, action: "report", id })}
            onReact={handleReact}
          />
        ))}

        <CommentInput
          value={newComment}
          onChange={setNewComment}
          onPost={() => {
            const t = newComment.trim();
            if (!t) return;
            handleAddComment(t);
            setNewComment("");
            setVisibleCount((v) => Math.max(v, visibleCount + 1));
          }}
          onDiscard={() => setNewComment("")}
          showButtons={newComment.length > 0}
          placeholder="Add a public comment..."
          avatarUrl="https://i.pravatar.cc/150?img=12" 
        />
      </div>

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.action === "delete" ? "Delete Comment?" : "Report Comment?"}
        description={
          confirmModal.action === "delete"
            ? "Are you sure you want to delete this comment? This action cannot be undone."
            : "Are you sure you want to report this comment?"
        }
        onConfirm={() =>
          confirmModal.action === "delete"
            ? handleDeleteConfirm(confirmModal.id!)
            : handleReportConfirm(confirmModal.id!)
        }
        onCancel={() => setConfirmModal({ open: false, action: "delete", id: null })}
      />
    </div>
  );
};

export default CommentsSection;
