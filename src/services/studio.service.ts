import { apiRequest } from "@/api/apiClient";

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getStudioDashboard = () =>
  apiRequest<{ data: any }>({ method: "GET", url: "/studio/dashboard" });

// ── Content / Videos ─────────────────────────────────────────────────────────

export type GetVideosParams = {
  page?: number;
  limit?: number;
  q?: string;
  privacy?: string;
};

export const getStudioVideo = (params?: GetVideosParams) => {
  const query = new URLSearchParams();
  if (params?.page)    query.set("page",    String(params.page));
  if (params?.limit)   query.set("limit",   String(params.limit));
  if (params?.q)       query.set("q",       params.q);
  if (params?.privacy) query.set("privacy", params.privacy);
  const qs = query.toString();
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/studio/videos${qs ? `?${qs}` : ""}`,
  });
};

// ── Analytics ────────────────────────────────────────────────────────────────

export const getStudioAnalytics = (period = 28) =>
  apiRequest<{ data: any }>({
    method: "GET",
    url: `/studio/analytics?period=${period}`,
  });

// ── Community – Comments ─────────────────────────────────────────────────────

export type GetCommentsParams = {
  page?: number;
  limit?: number;
  videoId?: string;
};

export const getStudioComments = (params?: GetCommentsParams) => {
  const query = new URLSearchParams();
  if (params?.page)    query.set("page",    String(params.page));
  if (params?.limit)   query.set("limit",   String(params.limit));
  if (params?.videoId) query.set("videoId", params.videoId);
  const qs = query.toString();
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/studio/community/comments${qs ? `?${qs}` : ""}`,
  });
};

export const replyToComment = (commentId: string, content: string) =>
  apiRequest<{ data: any }>({
    method: "POST",
    url: `/studio/community/comments/${commentId}/reply`,
    data: { content },
  });

export const deleteStudioComment = (commentId: string) =>
  apiRequest<{ data: any }>({
    method: "DELETE",
    url: `/studio/community/comments/${commentId}`,
  });
