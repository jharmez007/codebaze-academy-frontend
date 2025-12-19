import Api from "../api";

// --- Add Comment ---
export async function addComment(payload: {
  lesson_id: number;
  content: string;
  parent_id?: number | null;
}) {
  try {
    const response = await Api.post("/comments/", payload);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

// --- Get Course Comments ---
export async function getComments(lesson_id: number) {
  try {
    const response = await Api.get(`/comments/course/${lesson_id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}


// --- React to Comment ---
export async function reactToComment(
  comment_id: number,
  reaction: "like" | "clap" | "love" | "wow"
) {
  try {
    const response = await Api.post(`/comments/${comment_id}/react`, {
      reaction,
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

// --- Get Comment Reactions ---
export async function getCommentReactions(comment_id: number) {
  try {
    const response = await Api.get(`/comments/${comment_id}/reactions`);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

// --- Edit Comment ---
export async function editComment(
  comment_id: number,
  content: string
) {
  try {
    const response = await Api.put(`/comments/${comment_id}`, { content });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

// --- Delete Comment ---
export async function deleteComment(comment_id: number) {
  try {
    const response = await Api.delete(`/comments/${comment_id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}

// --- Report Comment ---
export async function reportComment(
  comment_id: number,
  reason: string
) {
  try {
    const response = await Api.post(`/comments/${comment_id}/report`, {
      reason,
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return {
      message:
        error?.response?.data?.data?.error ||
        error?.response?.data?.error ||
        error.error,
    };
  }
}