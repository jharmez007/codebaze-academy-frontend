"use client";

import React, { useState } from "react";

interface CommentInputProps {
  value: string;
  onChange: (v: string) => void;
  onPost: () => void;
  onDiscard: () => void;
  placeholder?: string;
  showButtons?: boolean;
  avatarUrl?: string; // ✅ NEW: user avatar
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onPost,
  onDiscard,
  placeholder = "Add a comment...",
  showButtons = false,
  avatarUrl = "https://i.pravatar.cc/150?img=20", // fallback avatar
}) => {
  const [focused, setFocused] = useState(false);
  const inputPaddingRight = 140;

  return (
    <div className="flex items-start gap-3 mt-2">
      {/* ✅ User Avatar */}
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="w-9 h-9 rounded-full object-cover mt-1"
      />

      <div className="relative flex-1">
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          style={{ paddingRight: `${inputPaddingRight}px` }}
          className="w-full min-h-20 border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition"
        />

        {(showButtons || focused || value.length > 0) && (
          <div className="absolute bottom-3 right-2 flex gap-2">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onDiscard}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Discard
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onPost}
              className="px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800 text-sm"
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
