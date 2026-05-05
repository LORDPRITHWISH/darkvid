import { useEffect, useState, useRef } from "react";
import {
  getStudioComments,
  replyToComment,
  deleteStudioComment,
} from "@/services/studio.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MessageSquare,
  Trash2,
  CornerDownRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type Comment = {
  _id: string;
  content: string;
  createdAt: string;
  replyCount: number;
  likeCount: number;
  author: { _id: string; username: string; profilepic: string; name: string };
  video: { videoId: string; title: string } | null;
  thumbnailUrl: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function StudioCommunity() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getStudioComments({ page, limit: 20 });
      if (res?.data) {
        setComments(res.data.comments);
        setPagination(res.data.pagination);
      }
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteStudioComment(id);
      toast.success("Comment deleted");
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      await replyToComment(commentId, replyText);
      toast.success("Reply posted");
      setReplyingTo(null);
      setReplyText("");
      // Bump reply count in local state
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, replyCount: c.replyCount + 1 } : c
        )
      );
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const startReply = (id: string) => {
    setReplyingTo(id);
    setReplyText("");
    setTimeout(() => replyRef.current?.focus(), 100);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-zinc-400 mt-1">
          Manage comments on your videos
        </p>
      </div>

      {/* Stats strip */}
      {!loading && (
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            <span>{pagination.total} comments</span>
          </div>
          <span>•</span>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          : comments.length === 0
          ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
              <MessageSquare size={40} className="opacity-20" />
              <p>No comments yet</p>
            </div>
          )
          : comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <img
                    src={comment.author?.profilepic ?? "/default-avatar.png"}
                    alt={comment.author?.username}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Author row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-semibold">
                        @{comment.author?.username}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {timeAgo(comment.createdAt)}
                      </span>
                      {comment.video && (
                        <>
                          <span className="text-zinc-600 text-xs">on</span>
                          <span className="text-zinc-400 text-xs truncate max-w-xs">
                            {comment.video.title}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-zinc-200 text-sm mt-1 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Meta + actions */}
                    <div className="flex items-center gap-4 mt-2">
                      {comment.likeCount > 0 && (
                        <span className="text-zinc-500 text-xs">
                          👍 {comment.likeCount}
                        </span>
                      )}
                      {comment.replyCount > 0 && (
                        <span className="text-zinc-500 text-xs">
                          {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
                        </span>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() =>
                            replyingTo === comment._id
                              ? setReplyingTo(null)
                              : startReply(comment._id)
                          }
                          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800"
                        >
                          <CornerDownRight size={12} />
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Reply input */}
                    {replyingTo === comment._id && (
                      <div className="mt-3 flex gap-2">
                        <textarea
                          ref={replyRef}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          placeholder="Write a reply…"
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-zinc-500 placeholder:text-zinc-500"
                        />
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleReply(comment._id)}
                            disabled={replyLoading || !replyText.trim()}
                            className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                          >
                            {replyLoading ? "…" : "Reply"}
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1.5 bg-zinc-700 text-zinc-300 text-xs rounded-lg hover:bg-zinc-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  {comment.thumbnailUrl && (
                    <img
                      src={comment.thumbnailUrl}
                      alt={comment.video?.title}
                      className="h-12 w-20 object-cover rounded-lg shrink-0 hidden md:block"
                    />
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => fetchComments(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-zinc-400 text-sm">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => fetchComments(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
