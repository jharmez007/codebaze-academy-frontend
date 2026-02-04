"use client";

import { useState, useRef  } from "react";
import axios from "axios";
import {
  generateVideoUploadUrl,
  confirmVideoUpload,
  uploadVideoViaBackend,
} from "../../../services/videoUploadService";

type VideoMeta = {
  url: string;
  key: string;
  duration: number | null;
  size: number;
};

type Props = {
  lessonId: number;
  onUploadSuccess?: (video: VideoMeta) => void;
};

const VideoUploader = ({ lessonId, onUploadSuccess }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"direct" | "backend" | null>(
    null
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [cancelled, setCancelled] = useState(false);


  // Get video duration
  const getVideoDuration = (file: File): Promise<number | null> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };

      video.onerror = () => resolve(null);
      video.src = URL.createObjectURL(file);
    });
  };

  // Direct S3 upload (primary)
  const uploadDirectToS3 = async (file: File): Promise<VideoMeta> => {
    setUploadMethod("direct");

    // 1️⃣ Get presigned URL
    const uploadData = await generateVideoUploadUrl({
      filename: file.name,
      filetype: file.type,
      folder: "videos",
    });

    // 2️⃣ Upload to S3 (RAW axios — no interceptor)
    abortControllerRef.current = new AbortController();

    await axios.put(uploadData.upload_url, file, {
    signal: abortControllerRef.current.signal,
    headers: {
        "Content-Type": uploadData.content_type,
        "Content-Disposition": uploadData.content_disposition,
        "Cache-Control": "max-age=31536000",
    },
    onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total || 1));
        setProgress(percent);
    },
    });


    // 3️⃣ Extract duration
    const duration = await getVideoDuration(file);

    // 4️⃣ Confirm with backend
    await confirmVideoUpload({
      lesson_id: lessonId,
      file_key: uploadData.file_key,
      file_url: uploadData.file_url,
      file_type: "video",
      duration,
      size: file.size,
    });

    return {
      url: uploadData.file_url,
      key: uploadData.file_key,
      duration,
      size: file.size,
    };
  };

  // Backend upload (fallback)
  const uploadViaBackendFallback = async (
    file: File
  ): Promise<VideoMeta> => {
    setUploadMethod("backend");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lesson_id", String(lessonId));
    formData.append("file_type", "video");

    abortControllerRef.current = new AbortController();

    const data = await uploadVideoViaBackend(
    formData,
    (percent) => setProgress(percent),
    abortControllerRef.current.signal 
    );


    return {
      url: data.file_url,
      key: data.file_key,
      duration: data.duration ?? null,
      size: file.size,
    };
  };

  // Main handler
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Upload MP4, MOV, AVI, or MKV.");
      return;
    }

    // Validate size (2GB)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError("File too large. Maximum size is 2GB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setLastFile(file);


    try {
      let video: VideoMeta;

      try {
        video = await uploadDirectToS3(file);
      } catch {
        video = await uploadViaBackendFallback(file);
      }

      setProgress(100);
      onUploadSuccess?.(video);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  //Cancel handler
  const handleCancelUpload = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setCancelled(true);
    setUploading(false);
    setProgress(0);
  };

  //Retry handler
  const handleRetryUpload = async () => {
    if (!lastFile) return;

    setCancelled(false);
    setError(null);
    setProgress(0);
    setUploading(true);

    try {
        let video;

        try {
        video = await uploadDirectToS3(lastFile);
        } catch {
        video = await uploadViaBackendFallback(lastFile);
        }

        setProgress(100);
        onUploadSuccess?.(video);
    } catch (err: any) {
        setError("Retry failed. Please try again.");
    } finally {
        setUploading(false);
    }
  };



  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <div className="space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded">
            <div
                className="h-2 bg-green-600 rounded"
                style={{ width: `${progress}%` }}
            />
            </div>

            <div className="flex items-center justify-between text-sm">
            <span>
                {uploadMethod === "direct"
                ? "Uploading directly to S3"
                : "Uploading via backend"}{" "}
                · {progress}%
            </span>

            <button
                onClick={handleCancelUpload}
                className="text-red-600 hover:underline"
            >
                Cancel
            </button>
            </div>
        </div>
        )}

        {cancelled && !uploading && (
            <button
                onClick={handleRetryUpload}
                className="text-sm text-blue-600 hover:underline"
            >
                Retry upload
            </button>
        )}



      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default VideoUploader;
