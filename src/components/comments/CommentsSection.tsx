"use client";

import React, { useMemo, useState, useEffect } from "react";
import { toast } from "sonner"
import ConfirmModal from "./ConfirmModal";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

import {
  addReplyRecursive,
  editRecursive,
  deleteRecursive,
  reactRecursive,
  replaceIdRecursive,
} from "./helpers";

import type { CommentType } from "./commentType";

import { getProfile } from "@/services/profileService";
import {
  addComment,
  getComments,
  reactToComment,
  getCommentReactions,
  editComment,
  deleteComment,
  reportComment,
} from "@/services/commentService";


const CommentsSection: React.FC<{ lessonId: number }> = ({ lessonId }) => {
  const currentUser = "You";

  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "delete" | "report";
    id: number | null;
  }>({
    open: false,
    action: "delete",
    id: null,
  });

  const INITIAL = 3;
  const LOAD_MORE_STEP = 5;
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const visibleComments = useMemo(
    () => comments.slice(0, visibleCount),
    [comments, visibleCount]
  );

  // ------------------------------------------------------------
  // Fetch profile photo
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadProfile() {
      const { data } = await getProfile();
      if (data?.profile_photo) setPhoto(data.profile_photo);
    }
    loadProfile();
  }, []);

  // ------------------------------------------------------------
  // Fetch comments
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const res = await getComments(lessonId);

      if (res.data) {
        const mapped = res.data.map((c: any) => ({
          id: c.id,
          author: c.author,
          text: c.text,
          timestamp: c.timestamp,
          avatar: c.avatar,
          reactions: c.reactions || {},
          reactedByUser: c.reactedByUser || {},
          replies:
            c.replies?.map((r: any) => ({
              id: r.id,
              author: r.author,
              text: r.text,
              timestamp: r.timestamp,
              avatar: r.avatar,
              reactions: r.reactions || {},
              reactedByUser: r.reactedByUser || {},
              replies: r.replies || [],
            })) || [],
        }));

        setComments(mapped);
      } else {
        setComments([]);
      }

      setLoading(false);
    };

    fetchComments();
  }, [lessonId]);

  // ------------------------------------------------------------
  // Add new comment / reply
  // ------------------------------------------------------------
  const handleAddComment = async (text: string, parentId?: number) => {
    const tempId = Date.now();
    const newC: CommentType = {
      id: tempId,
      author: currentUser,
      text,
      timestamp: new Date().toISOString(),
      avatar: photo,
      reactions: {},
      reactedByUser: {},
      replies: [],
    };

    // Optimistic update
    if (!parentId) {
      setComments((prev) => [newC, ...prev]);
    } else {
      setComments((prev) => addReplyRecursive(prev, parentId, newC));
    }

    const res = await addComment({
      lesson_id: lessonId,
      content: text,
      parent_id: parentId || null,
    });

    if (res.data?.id) {
      setComments((prev) =>
        replaceIdRecursive(prev, tempId, res.data.id)
      );
    }
  };

  // ------------------------------------------------------------
  // Edit comment
  // ------------------------------------------------------------
  const handleEdit = async (id: number, text: string) => {
    // optimistic
    setComments((prev) => editRecursive(prev, id, text));

    await editComment(id, text);
  };

  // ------------------------------------------------------------
  // Delete comment
  // ------------------------------------------------------------
  const handleDeleteConfirm = async (id: number) => {
    // optimistic UI
    const prev = comments;
    setComments(deleteRecursive(prev, id));

    try {
      const res = await deleteComment(id);

      if (res?.status === 200 || res?.status === 204) {
        toast.success("Comment deleted successfully");
      } else {
        throw new Error(res?.message || "Failed to delete comment");
      }
    } catch (error: any) {
      setComments(prev); // rollback
      toast.error(error?.message || "Unable to delete comment");
    } finally {
      setConfirmModal({ open: false, action: "delete", id: null });
    }
  };

  // ------------------------------------------------------------
  // Report comment
  // ------------------------------------------------------------
  const handleReportConfirm = async (id: number) => {
    try {
      const res = await reportComment(id, "Inappropriate content");

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Comment reported successfully");
      } else {
        throw new Error(res?.message || "Failed to report comment");
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to report comment");
    } finally {
      setConfirmModal({ open: false, action: "report", id: null });
    }
  };

  // ------------------------------------------------------------
  // React to comment
  // ------------------------------------------------------------
  const handleReact = async (id: number, type: string) => {
    // optimistic UI
    setComments((prev) => reactRecursive(prev, id, type));

    await reactToComment(id, type as any);
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (loading) return <div className="text-gray-500">Loading comments...</div>;

  return (
    <div className="mt-6 border-t border-gray-300 pt-6">
      <h3 className="text-lg font-semibold mb-4 text-black">Comments</h3>

      {visibleCount < comments.length && (
        <button
          onClick={() =>
            setVisibleCount((v) => Math.min(comments.length, v + LOAD_MORE_STEP))
          }
          className="py-1 px-4 text-sm hover:bg-gray-200 rounded-md"
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
            onDelete={(id) =>
              setConfirmModal({ open: true, action: "delete", id })
            }
            onReport={(id) =>
              setConfirmModal({ open: true, action: "report", id })
            }
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
            setVisibleCount((v) => v + 1);
          }}
          onDiscard={() => setNewComment("")}
          showButtons={newComment.length > 0}
          placeholder="Add a public comment..."
        />
      </div>

      <ConfirmModal
        open={confirmModal.open}
        title={
          confirmModal.action === "delete"
            ? "Delete Comment?"
            : "Report Comment?"
        }
        description={
          confirmModal.action === "delete"
            ? "Are you sure you want to delete this comment?"
            : "Are you sure you want to report this comment?"
        }
        onConfirm={() =>
          confirmModal.action === "delete"
            ? handleDeleteConfirm(confirmModal.id!)
            : handleReportConfirm(confirmModal.id!)
        }
        onCancel={() =>
          setConfirmModal({ open: false, action: "delete", id: null })
        }
      />
    </div>
  );
};

export default CommentsSection;
