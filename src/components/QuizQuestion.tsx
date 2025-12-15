"use client";

import { useState } from "react";
import { toast } from "sonner";

const QuizQuestion = ({ quiz }: any) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const options = quiz.options ?? ["true", "false"]; // fallback for true/false

  const handleCheckAnswer = () => {
    if (!selected) return toast.error("Select an answer first");
    setShowAnswer(true);
  };

  return (
    <div className="border p-4 rounded-lg mb-4">
      <p className="font-semibold mb-3">{quiz.question}</p>

      <div className="flex flex-col gap-2">
        {options.map((opt: string, i: number) => {
          let bgColor = "bg-white"; // default

          if (showAnswer) {
            if (opt === quiz.correct_answer) bgColor = "bg-green-100 border border-green-500 hover:bg-green-50";
            else if (opt === selected && opt !== quiz.correct_answer)
              bgColor = "bg-red-100 border border-red-500 hover:bg-red-50";
          } else if (opt === selected) {
            bgColor = "bg-gray-100 border border-gray-400";
          }

          return (
            <button
              key={i}
              className={`text-left p-2 rounded ${bgColor} transition cursor-pointer hover:bg-gray-50 `}
              onClick={() => !showAnswer && setSelected(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!showAnswer ? (
        <button
          onClick={handleCheckAnswer}
          className="mt-3 px-4 py-2 bg-black text-white rounded-md"
        >
          Submit Answer
        </button>
      ) : (
        <p className="mt-3 text-sm">
          Correct Answer: <span className="font-bold">{quiz.correct_answer}</span>
        </p>
      )}
    </div>
  );
};


export default QuizQuestion;