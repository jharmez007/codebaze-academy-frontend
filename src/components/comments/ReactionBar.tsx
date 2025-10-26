"use client";

import React from "react";

interface ReactionBarProps {
  reactions?: Record<string, number>;
  reactedByUser?: Record<string, boolean>;
  onReact: (type: string) => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions = {},
  reactedByUser = {},
  onReact,
}) => {
  const EMOJIS: Record<string, string> = {
    like: "👍",
    love: "❤️",
    clap: "👏",
    wow: "😮",
  };
  return (
    <div className="flex items-center gap-3 text-sm mb-2">
      {Object.entries(EMOJIS).map(([key, emoji]) => {
        const count = reactions[key] ?? 0;
        const active = reactedByUser[key];
        return (
          <button
            key={key}
            onClick={() => onReact(key)}
            className={`flex items-center gap-1 px-1 py-0.5 rounded transition ${
              active ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            aria-pressed={active}
          >
            <span>{emoji}</span>
            <span className="text-xs">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
