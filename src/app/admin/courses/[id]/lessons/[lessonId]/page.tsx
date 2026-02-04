"use client";

import { useParams, useRouter  } from "next/navigation";
import { useState, useEffect } from "react";
import LessonEditor from "@/components/admin/courses/LessonEditor";
import { getLessonById, updateLesson } from "@/services/courseService";
import { toast } from "sonner";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();


  useEffect(() => {
    if (!lessonId) {
      toast.error("No lesson ID provided.");
      setLoading(false);
      return;
    }

    getLessonById(Number(lessonId))
      .then((res) => {
        if (res.data) {
          // Map API fields to LessonEditor format
          const lesson = {
            ...res.data,
            video: {
              url: res.data.video_url
                ? res.data.video_url.startsWith("http")
                  ? res.data.video_url
                  : `${BASE_SERVER_URL}${res.data.video_url}`
                : "",
            },
            notes: {
              url: res.data.document_url
                ? res.data.document_url.startsWith("http")
                  ? res.data.document_url
                  : `${BASE_SERVER_URL}${res.data.document_url}`
                : "",
              text: res.data.notes || "",
            },
            reference_links: (() => {
              try {
                const arr = JSON.parse(res.data.reference_link);
                return Array.isArray(arr) ? arr : [];
              } catch {
                return [];
              }
            })(),
          };
          setCurrentLesson(lesson);
        } else {
          toast.error(res.message || "Lesson not found");
        }
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
          notes: updatedLesson.notes?.text || "Updated lesson note",
          reference_link: JSON.stringify(updatedLesson.reference_links || []),
        })
      );

      if (updatedLesson.notes?.file) {
        formData.append("document", updatedLesson.notes.file);
      }

      const res = await updateLesson(Number(id), Number(lessonId), formData);

      if (res.status === 200) {
        toast.success("Lesson updated successfully!");
        setCurrentLesson(updatedLesson);
        setTimeout(() => {
        router.push(`/admin/courses/${id}/lessons`); 
      }, 800);
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
