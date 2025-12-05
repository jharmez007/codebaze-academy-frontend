"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LessonEditor from "@/components/admin/courses/LessonEditor";
import { getLessonById, updateLesson } from "@/services/courseService";
import { toast } from "sonner";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "";

// -----------------------------
// Correct Lesson Backend Shape
// -----------------------------
type LessonApiResponse = {
  id: number;
  title: string;
  video_url?: string;
  document_url?: string;
  notes?: string;
  reference_link?: string;
  // add more fields if your backend returns more
};

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      toast.error("No lesson ID provided.");
      setLoading(false);
      return;
    }

    getLessonById(Number(lessonId))
      .then((res) => {
        if (!res.data) {
          toast.error(res.message || "Lesson not found");
          setLoading(false);
          return;
        }

        // Cast response to typed lesson object
        const data = res.data as LessonApiResponse;

        const lesson = {
          ...data,
          video: {
            url: data.video_url
              ? data.video_url.startsWith("http")
                ? data.video_url
                : `${BASE_SERVER_URL}${data.video_url}`
              : "",
          },
          notes: {
            url: data.document_url
              ? data.document_url.startsWith("http")
                ? data.document_url
                : `${BASE_SERVER_URL}${data.document_url}`
              : "",
            text: data.notes || "",
          },
          reference_links: (() => {
            try {
              const arr = JSON.parse(data.reference_link || "[]");
              return Array.isArray(arr) ? arr : [];
            } catch {
              return [];
            }
          })(),
        };

        setCurrentLesson(lesson);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to fetch lesson");
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!currentLesson) return <p className="p-6">Lesson not found.</p>;

  const handleSave = async (updatedLesson: any) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: updatedLesson.title,
          notes: updatedLesson.notes?.text || "",
          reference_link: JSON.stringify(updatedLesson.reference_links || []),
        })
      );

      if (updatedLesson.video?.file) {
        formData.append("video", updatedLesson.video.file);
      }

      if (updatedLesson.notes?.file) {
        formData.append("document", updatedLesson.notes.file);
      }

      const res = await updateLesson(Number(id), Number(lessonId), formData);

      if (res.status === 200) {
        toast.success("Lesson updated successfully!");
        setCurrentLesson(updatedLesson);
      } else {
        toast.error(res.message || "Failed to update lesson");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating the lesson.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LessonEditor lesson={currentLesson} onSave={handleSave} />
      {saving && <p className="mt-4 text-green-600">Saving...</p>}
    </div>
  );
}
