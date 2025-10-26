"use client";

import React, { useState } from "react";
import { Edit, Trash2, Flag, MessageCircleReply } from "lucide-react";
import ReactionBar from "./ReactionBar";
import CommentInput from "./CommentInput";
import { CommentType } from "@/data/comments";

interface CommentProps {
  comment: CommentType;
  currentUser: string;
  onReply: (parentId: number, text: string) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onReport: (id: number) => void;
  onReact: (id: number, type: string) => void;
  nested?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onReact,
  nested = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyInput, setShowReplyInput] = useState(comment.role === "Admin" || comment.role === "Tutor");
  const [replyText, setReplyText] = useState("");
  const INITIAL_REPLIES = 2;
  const [visibleReplies, setVisibleReplies] = useState(INITIAL_REPLIES);

  const handleSaveEdit = () => {
    const newText = editText.trim();
    if (!newText) return;
    onEdit(comment.id, newText);
    setIsEditing(false);
  };

  const handlePostReply = () => {
    const text = replyText.trim();
    if (!text) return;
    onReply(comment.id, text);
    setReplyText("");
    setShowReplyInput(false);
  };

  const repliesToShow = comment.replies?.slice(0, visibleReplies) || [];

  return (
    <div className={`relative ${nested ? "pl-8 border-l border-gray-300" : ""} transition-all`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          <img
            src={comment.avatar ?? "/default-avatar.png"}
            alt={comment.author}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-black">
              {comment.author}{" "}
              {comment.role ? (
                <span className="text-xs text-gray-500">({comment.role})</span>
              ) : null}
            </p>
            {comment.timestamp && <p className="text-xs text-gray-400">{comment.timestamp}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comment.author === currentUser && (
            <>
              <button
                aria-label="Edit"
                onClick={() => {
                  setIsEditing((s) => !s);
                  setEditText(comment.text);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit className="w-4 h-4 text-black" />
              </button>
              <button
                aria-label="Delete"
                onClick={() => onDelete(comment.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
          {comment.author !== currentUser && (
            <button
              aria-label="Report"
              onClick={() => onReport(comment.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Flag className="w-4 h-4 text-yellow-600" />
            </button>
          )}
          <button
            aria-label="Reply"
            onClick={() => setShowReplyInput((s) => !s)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MessageCircleReply className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="relative">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ paddingRight: 140 }}
            className="w-full min-h-20 border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <div className="absolute bottom-3 right-2 flex gap-2">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.text);
              }}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Discard
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSaveEdit}
              className="px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-2 whitespace-pre-wrap">{comment.text}</p>
      )}

      <ReactionBar
        reactions={comment.reactions ?? {}}
        reactedByUser={comment.reactedByUser ?? {}}
        onReact={(type) => onReact(comment.id, type)}
      />

      {showReplyInput && (
        <div className="mt-2">
          <CommentInput
            value={replyText}
            onChange={setReplyText}
            onPost={handlePostReply}
            onDiscard={() => {
              setReplyText("");
              setShowReplyInput(false);
            }}
            placeholder="Write a reply..."
            showButtons={replyText.length > 0}
            avatarUrl={"https://i.pravatar.cc/150?img=12"} 
          />
        </div>
      )}

      {repliesToShow.length > 0 && (
        <div className="mt-3 space-y-2">
          {repliesToShow.map((r) => (
            <Comment
              key={r.id}
              comment={r}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReport={onReport}
              onReact={onReact}
              nested
            />
          ))}

          {comment.replies && visibleReplies < comment.replies.length && (
            <button
              onClick={() => setVisibleReplies((v) => Math.min(comment.replies!.length, v + 2))}
              className="py-3 px-5 text-sm bg-gray-300 border rounded-md flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Show {Math.min(2, comment.replies.length - visibleReplies)} more replies...
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
