"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, ListChecks, PlusCircle, Trash2, Link2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addQuiz, deleteQuiz as deleteQuizService, updateQuiz as updateQuizService } from "@/services/courseService";
import { toast } from "sonner";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function mapBackendQuizToEditor(quiz: any) {
  let type = "multiple_choice";
  if (quiz.options && quiz.options.length === 2 && ["true", "false"].includes(quiz.options[0].toLowerCase())) {
    type = "true_false";
  } else if (!quiz.options || quiz.options.length === 0) {
    type = "free_text";
  }

  let options = [];
  if (type === "multiple_choice" && Array.isArray(quiz.options)) {
    options = quiz.options.map((opt: string, idx: number) => ({
      id: `opt${idx + 1}`,
      text: opt,
    }));
  }

  let answer = "";
  if (type === "multiple_choice" && options.length > 0) {
    const correctIdx = options.findIndex((opt) => opt.text === quiz.correct_answer);
    answer = correctIdx !== -1 ? options[correctIdx].id : "";
  } else if (type === "true_false" || type === "free_text") {
    answer = quiz.correct_answer;
  }

  return {
    id: quiz.id,
    question: quiz.question,
    type,
    options,
    answer,
    explanation: quiz.explanation || "",
  };
}

export default function LessonEditor({
  lesson,
  onSave,
}: {
  lesson: any;
  onSave?: (updatedLesson: any) => void;
}) {
  const [title, setTitle] = useState(lesson.title || "");
  const [notesText, setNotesText] = useState(lesson.notes?.text || lesson.notes || "");
  const { id } = useParams();

  // Reference links
  const [referenceLinks, setReferenceLinks] = useState<string[]>(
    Array.isArray(lesson.reference_links)
      ? lesson.reference_links
      : lesson.reference_link
      ? (() => {
          try {
            const arr = JSON.parse(lesson.reference_link);
            return Array.isArray(arr) ? arr : [];
          } catch {
            return [];
          }
        })()
      : []
  );
  const [newLink, setNewLink] = useState("");

  // Video logic
  const initialVideoUrl =
    lesson.video?.url && typeof lesson.video.url === "string"
      ? lesson.video.url.startsWith("http")
        ? lesson.video.url
        : `${BASE_SERVER_URL}/${lesson.video.url.replace(/^\/+/, "")}`
      : lesson.video_url
      ? lesson.video_url.startsWith("http")
        ? lesson.video_url
        : `${BASE_SERVER_URL}${lesson.video_url}`
      : "";
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [notesUrl, setNotesUrl] = useState(
    lesson.notes?.url ||
      (lesson.document_url
        ? lesson.document_url.startsWith("http")
          ? lesson.document_url
          : `${BASE_SERVER_URL}${lesson.document_url}`
        : "")
  );

  // Prefill quizzes from backend
  const [quizzes, setQuizzes] = useState(
    Array.isArray(lesson.quizzes)
      ? lesson.quizzes.map(mapBackendQuizToEditor)
      : []
  );

  // Existing quizzes are initially collapsed, new quizzes are expanded
  const [collapsedQuizzes, setCollapsedQuizzes] = useState<boolean[]>(
    quizzes.map((quiz) => typeof quiz.id === "number" ? true : false)
  );
  const [quizLoading, setQuizLoading] = useState(false);

  const updateQuiz = (index: number, updates: any) => {
    const updated = [...quizzes];
    updated[index] = { ...updated[index], ...updates };
    setQuizzes(updated);
  };

  const deleteQuiz = (index: number) => {
    const updated = quizzes.filter((_, i) => i !== index);
    setQuizzes(updated);
  };

  // Video file upload
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl("");
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNotesFile(file);
    setNotesUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setReferenceLinks([...referenceLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (idx: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== idx));
  };

  const handleLinkChange = (idx: number, value: string) => {
    setReferenceLinks(referenceLinks.map((link, i) => (i === idx ? value : link)));
  };

  const handleSave = () => {
    const updatedLesson = {
      ...lesson,
      title,
      reference_links: referenceLinks,
      notes: notesFile
        ? { type: "pdf", file: notesFile, url: notesUrl, text: notesText }
        : { url: notesUrl, text: notesText },
      video: videoFile
        ? { ...lesson.video, file: videoFile, url: videoUrl }
        : { ...lesson.video, url: videoUrl },
      quizzes,
    };

    if (onSave) onSave(updatedLesson);
    toast.success("Lesson changes saved!");
  };

  // Update quiz handler (for both new and existing quizzes)
  const handleUpdateQuiz = async (quiz: any, i: number) => {
    if (!id || !lesson?.id) {
      toast.error("Missing course or lesson ID");
      return;
    }
    setQuizLoading(true);

    let payload: any = {
      question: quiz.question,
      quiz_type: quiz.type,
      explanation: quiz.explanation,
    };
    if (quiz.type === "multiple_choice") {
      payload.options = quiz.options.map((opt: any) => opt.text).filter((t: string) => t.trim());
      payload.correct_answer =
        quiz.options.find((opt: any) => opt.id === quiz.answer)?.text || "";
    } else if (quiz.type === "true_false") {
      payload.correct_answer = quiz.answer;
    } else if (quiz.type === "free_text") {
      payload.correct_answer = quiz.answer;
    }

    try {
      if (typeof quiz.id === "number") {
        // Update existing quiz
        const res = await updateQuizService( lesson.id, quiz.id, payload);
        if (res.status === 200) {
          setCollapsedQuizzes((prev) =>
            prev.map((collapsed, idx) => (idx === i ? true : collapsed))
          );
          toast.success("Quiz updated successfully!");
        } else {
          toast.error(res.message || "Failed to update quiz");
        }
      } else {
        // Add new quiz
        const res = await addQuiz(Number(id), lesson.id, payload);
        if (res.status === 201 || res.status === 200) {
          setCollapsedQuizzes((prev) =>
            prev.map((collapsed, idx) => (idx === i ? true : collapsed))
          );
          toast.success("Quiz added successfully!");
        } else {
          toast.error(res.message || "Failed to add quiz");
        }
      }
    } catch (err) {
      toast.error("Error updating quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleDeleteQuiz = async (i: number) => {
    const quiz = quizzes[i];
    if (!lesson?.id) {
      toast.error("Missing lesson ID");
      return;
    }
    if (typeof quiz.id === "number") {
      try {
        const res = await deleteQuizService(quiz.id, lesson.id);
        if (res.status === 200 || res.status === 204) {
          setQuizzes(prev => prev.filter((_, idx) => idx !== i));
          setCollapsedQuizzes(prev => prev.filter((_, idx) => idx !== i));
          toast.success("Quiz deleted!");
        } else {
          toast.error(res.message || "Failed to delete quiz");
        }
      } catch (err) {
        toast.error("Error deleting quiz");
      }
    } else {
      setQuizzes(prev => prev.filter((_, idx) => idx !== i));
      setCollapsedQuizzes(prev => prev.filter((_, idx) => idx !== i));
      toast.success("Quiz removed!");
    }
  };

  const handleToggleCollapse = (i: number) => {
    setCollapsedQuizzes((prev) =>
      prev.map((collapsed, idx) => (idx === i ? !collapsed : collapsed))
    );
  };

  return (
    <div className="w-full bg-white dark:bg-background rounded-xl shadow p-6">
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Lesson Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            placeholder="Enter lesson title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Notes Text */}
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Notes (text)</label>
          <Textarea
            placeholder="Write lesson notes or key points..."
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
          />
        </div>

        {/* Multiple Reference Links as separate inputs */}
        <div>
          <label className="block text-sm font-medium mb-1">Reference Links</label>
          <div className="space-y-2">
            {referenceLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-gray-500" />
                <Input
                  value={link}
                  onChange={(e) => handleLinkChange(idx, e.target.value)}
                  className="flex-1"
                  placeholder={`Reference Link ${idx + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveLink(idx)}
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <Link2 className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="https://example.com"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddLink}
                disabled={!newLink.trim()}
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-lg">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Video
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Quizzes
          </TabsTrigger>
        </TabsList>

        {/* --- VIDEO TAB --- */}
        <TabsContent value="video" className="mt-4">
          <label className="block text-sm font-medium mb-2">Upload Video</label>
          {videoUrl ? (
            <div className="relative mb-4">
              <video controls className="w-full rounded-lg">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                onClick={handleRemoveVideo}
                title="Remove video"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ) : (
            <Input type="file" accept="video/*" onChange={handleVideoChange} />
          )}
        </TabsContent>

        {/* --- NOTES TAB --- */}
        <TabsContent value="notes" className="mt-4">
          <label className="block text-sm font-medium mb-2">Upload Notes (PDF)</label>
          <Input type="file" accept="application/pdf" onChange={handleNotesChange} />
          {notesUrl && (
            <div className="mt-4 p-4 border rounded-lg">
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
              onClick={() => {
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
                ]);
                setCollapsedQuizzes([...collapsedQuizzes, false]);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Quiz
            </Button>
          </div>

          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-sm">No quizzes added yet.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, i) =>
                collapsedQuizzes[i] ? (
                  <div
                    key={quiz.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <span className="font-medium">{quiz.question || "Untitled Quiz"}</span>
                    <button
                      onClick={() => handleDeleteQuiz(i)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleCollapse(i)}
                      className="ml-2"
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <div
                    key={quiz.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteQuiz(i)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Delete quiz"
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
                          <SelectItem value="free_text">Short Answer</SelectItem>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newOptions = quiz.options.filter((_: any, k: number) => k !== j);
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

                    {quiz.type === "free_text" && (
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
                    <Button
                      className="mt-2"
                      size="sm"
                      variant="default"
                      disabled={quizLoading}
                      onClick={() => handleUpdateQuiz(quiz, i)}
                    >
                      {quizLoading ? "Updating..." : "Save Quiz"}
                    </Button>
                  </div>
                )
              )}
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

