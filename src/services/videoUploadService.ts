import Api from "../api";

/**
 * Request a presigned upload URL from backend
 */
export async function generateVideoUploadUrl(payload: {
  filename: string;
  filetype: string;
  folder?: string;
}): Promise<{
  upload_url: string;
  file_url: string;
  file_key: string;
  content_type: string;
  content_disposition?: string;
}> {
  const response = await Api.post("/courses/generate-upload-url", payload);
  return response.data;
}

/**
 * Confirm upload after successful S3 PUT
 */
export async function confirmVideoUpload(payload: {
  lesson_id: number;
  file_key: string;
  file_url: string;
  file_type: "video";
  duration: number | null;
  size: number;
}): Promise<any> {
  const response = await Api.post("/courses/confirm-upload", payload);
  return response.data;
}

/**
 * Backend fallback upload
 */
export async function uploadVideoViaBackend(
  formData: FormData,
  onProgress?: (percent: number) => void,
   signal?: AbortSignal
): Promise<any> {
  const response = await Api.post("/courses/upload-to-s3-backend", formData, {
    signal,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (e) => {
      if (!e.total || !onProgress) return;
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });

  return response.data;
}
