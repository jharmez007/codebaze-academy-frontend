"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, ListChecks, PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LessonEditor({
  lesson,
  onSave,
}: {
  lesson: any;
  onSave?: (updatedLesson: any) => void;
}) {
  const [videoUrl, setVideoUrl] = useState(lesson.video?.url || "");
  const [notesUrl, setNotesUrl] = useState(lesson.notes?.url || "");
  const [quizzes, setQuizzes] = useState(lesson.quizzes || []);

  const updateQuiz = (index: number, updates: any) => {
    const updated = [...quizzes];
    updated[index] = { ...updated[index], ...updates };
    setQuizzes(updated);
  };

  const deleteQuiz = (index: number) => {
    const updated = quizzes.filter((_, i) => i !== index);
    setQuizzes(updated);
  };

  const handleSave = () => {
    const updatedLesson = {
      ...lesson,
      video: { ...lesson.video, url: videoUrl },
      notes: notesUrl ? { type: "pdf", url: notesUrl } : null,
      quizzes,
    };

    if (onSave) {
      onSave(updatedLesson); // send update up to parent
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{lesson.title}</h2>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Video
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Quizzes
          </TabsTrigger>
        </TabsList>

        {/* --- VIDEO TAB --- */}
        <TabsContent value="video" className="mt-4">
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <Input
            type="url"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {videoUrl && (
            <div className="mt-4">
              <video controls className="w-full rounded-lg">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </TabsContent>

        {/* --- NOTES TAB --- */}
        <TabsContent value="notes" className="mt-4">
          <label className="block text-sm font-medium mb-2">Notes URL</label>
          <Input
            type="url"
            placeholder="Enter PDF URL"
            value={notesUrl}
            onChange={(e) => setNotesUrl(e.target.value)}
          />

          {notesUrl && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-sm font-medium">Notes uploaded:</p>
              <a
                href={notesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Notes
              </a>
            </div>
          )}
        </TabsContent>

        {/* --- QUIZZES TAB --- */}
        <TabsContent value="quizzes" className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold">Quizzes</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setQuizzes([
                  ...quizzes,
                  {
                    id: `quiz${quizzes.length + 1}`,
                    question: "",
                    type: "multiple_choice",
                    options: [],
                    answer: "",
                    explanation: "",
                  },
                ])
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Quiz
            </Button>
          </div>

          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-sm">No quizzes added yet.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, i) => (
                <div
                  key={quiz.id}
                  className="p-4 border rounded-lg space-y-3 relative"
                >
                  {/* Delete button */}
                  <button
                    onClick={() => deleteQuiz(i)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Question input */}
                  <label className="block text-sm font-medium mb-1">
                    Question {i + 1}
                  </label>
                  <Textarea
                    placeholder="Enter question"
                    value={quiz.question}
                    onChange={(e) =>
                      updateQuiz(i, { question: e.target.value })
                    }
                  />

                  {/* Quiz type selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Quiz Type</label>
                    <Select
                      value={quiz.type}
                      onValueChange={(val) => updateQuiz(i, { type: val })}
                    >
                      <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True / False</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Render different fields by type */}
                  {quiz.type === "multiple_choice" && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Options</label>
                        {quiz.options?.map((opt: any, j: number) => (
                        <div key={j} className="flex gap-2 items-center">
                            <Input
                            placeholder={`Option ${j + 1}`}
                            value={opt.text}
                            onChange={(e) => {
                                const newOptions = [...quiz.options];
                                newOptions[j].text = e.target.value;
                                updateQuiz(i, { options: newOptions });
                            }}
                            />
                            <Button
                            variant={quiz.answer === opt.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateQuiz(i, { answer: opt.id })}
                            >
                            Correct
                            </Button>
                            {/* ✅ Delete Option Button */}
                            <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                                const newOptions = quiz.options.filter((_: any, k: number) => k !== j);
                                // if the deleted option was the correct one, reset answer
                                const newAnswer =
                                quiz.answer === opt.id ? "" : quiz.answer;
                                updateQuiz(i, { options: newOptions, answer: newAnswer });
                            }}
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        ))}
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            updateQuiz(i, {
                            options: [
                                ...quiz.options,
                                { id: `opt${quiz.options.length + 1}`, text: "" },
                            ],
                            })
                        }
                        >
                        Add Option
                        </Button>
                    </div>
                    )}

                  {quiz.type === "true_false" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Correct Answer</label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={quiz.answer === "true" ? "default" : "outline"}
                          onClick={() => updateQuiz(i, { answer: "true" })}
                        >
                          True
                        </Button>
                        <Button
                          size="sm"
                          variant={quiz.answer === "false" ? "default" : "outline"}
                          onClick={() => updateQuiz(i, { answer: "false" })}
                        >
                          False
                        </Button>
                      </div>
                    </div>
                  )}

                  {quiz.type === "short_answer" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Expected Answer</label>
                      <Input
                        placeholder="Enter expected answer"
                        value={quiz.answer}
                        onChange={(e) =>
                          updateQuiz(i, { answer: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Explanation (shown after answering)
                    </label>
                    <Textarea
                      placeholder="Explain why the answer is correct"
                      value={quiz.explanation || ""}
                      onChange={(e) =>
                        updateQuiz(i, { explanation: e.target.value })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button className="mt-6 w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}
