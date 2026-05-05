import { useEffect, useRef, useState } from "react";
import { getStudioVideo } from "@/services/studio.service";
import { deleteVideo } from "@/services/video.service";
import { useNavigate } from "react-router";
import type { StudioVideo } from "@/types/studio.types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PopupCustom } from "@/components/PopupCustom";
import {
  Globe,
  Lock,
  EyeOff,
  Edit3,
  Trash2,
  Play,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  ChevronDown,
  MoreVertical,
  Upload,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = { label: string; key: string };

const TABS: Tab[] = [
  { label: "Videos", key: "videos" },
  { label: "Shorts", key: "shorts" },
  { label: "Live", key: "live" },
  { label: "Posts", key: "posts" },
  { label: "Playlists", key: "playlists" },
  { label: "Podcasts", key: "podcasts" },
  { label: "Promotions", key: "promotions" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtNum = (n: number = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

// ── Sub-components ────────────────────────────────────────────────────────────

function VisibilityBadge({ privacy }: { privacy: string }) {
  if (privacy === "private")
    return (
      <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
        <Lock size={12} className="text-zinc-400" />
        Private
      </div>
    );
  if (privacy === "unlisted")
    return (
      <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
        <EyeOff size={12} className="text-zinc-400" />
        Unlisted
      </div>
    );
  return (
    <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
      <Globe size={12} className="text-zinc-400" />
      Public
    </div>
  );
}

function StatusBadge({ video }: { video: StudioVideo }) {
  if (!video.isPublished && video.status === "completed") {
    return (
      <span className="text-[11px] text-amber-400 font-medium">Draft</span>
    );
  }
  if (!video.isPublished && video.status !== "completed") {
    return (
      <span className="text-[11px] text-amber-400 font-medium">Draft</span>
    );
  }
  if (video.status === "uploading") {
    return (
      <span className="text-[11px] text-blue-400 font-medium">Processing…</span>
    );
  }
  if (video.status === "failed") {
    return (
      <span className="text-[11px] text-red-400 font-medium">Failed</span>
    );
  }
  return null;
}

function ActionMenu({
  video,
  onDelete,
}: {
  video: StudioVideo;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/8 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
          <button
            onClick={() => { navigate(`/edit/${video.videoId}`); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/6 hover:text-white transition-colors"
          >
            <Edit3 size={14} /> Edit video
          </button>
          <button
            onClick={() => { navigate(`/video/${video.videoId}`); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/6 hover:text-white transition-colors"
          >
            <Play size={14} /> Watch video
          </button>
          <div className="h-px bg-zinc-800 my-1" />
          <PopupCustom
            title="Delete Video"
            description={`Are you sure you want to delete "${video.title}"? This action cannot be undone.`}
            actionText="Delete"
            cancelText="Cancel"
            onAction={() => { onDelete(video.videoId); setOpen(false); }}
            triggerElement={
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-800/60 animate-pulse">
      <td className="pl-4 py-4 w-8"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[120px] h-[68px] rounded-lg shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      </td>
      <td className="py-4 pr-8"><Skeleton className="h-3 w-16 rounded" /></td>
      <td className="py-4 pr-8"><Skeleton className="h-3 w-20 rounded" /></td>
      <td className="py-4 pr-8"><Skeleton className="h-3 w-10 rounded" /></td>
      <td className="py-4 pr-8"><Skeleton className="h-3 w-10 rounded" /></td>
      <td className="py-4 pr-4"><Skeleton className="h-6 w-6 rounded-full" /></td>
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [privacyFilter, setPrivacyFilter] = useState<string>("all");
  const navigate = useNavigate();

  const fetchVideos = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await getStudioVideo();
      if (res?.data) {
        const payload = res.data as any;
        setVideos(Array.isArray(payload) ? payload : (payload.videos ?? []));
      }
    } catch {
      toast.error("Failed to fetch videos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleDelete = async (videoId: string) => {
    try {
      await deleteVideo(videoId);
      toast.success("Video deleted");
      setVideos((prev) => prev.filter((v) => v.videoId !== videoId));
      setSelected((prev) => { const s = new Set(prev); s.delete(videoId); return s; });
    } catch {
      toast.error("Failed to delete video");
    }
  };

  // Filtering
  const filtered = videos.filter((v) => {
    const matchesSearch = !search || v.title?.toLowerCase().includes(search.toLowerCase());
    const matchesPrivacy = privacyFilter === "all" || v.privacy === privacyFilter;
    return matchesSearch && matchesPrivacy;
  });

  // Selection
  const allSelected = filtered.length > 0 && filtered.every((v) => selected.has(v.videoId));
  const someSelected = selected.size > 0;
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((v) => v.videoId)));
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[22px] font-medium text-white tracking-tight">Channel content</h1>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-colors"
          >
            <Upload size={15} />
            Upload
          </button>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-0 border-b border-zinc-800/60">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter / toolbar ──────────────────────────────────────────────── */}
      <div className="px-6 py-3 flex items-center gap-3">
        {/* Bulk action strip (only when rows selected) */}
        {someSelected && (
          <div className="flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-lg px-3 py-1.5 text-sm text-blue-300 mr-2">
            <span className="font-medium">{selected.size} selected</span>
            <button
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              onClick={() => {
                selected.forEach((id) => handleDelete(id));
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <SlidersHorizontal
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter videos…"
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 rounded-lg text-sm text-white placeholder:text-zinc-500 outline-none transition-colors"
          />
        </div>

        {/* Visibility filter */}
        <div className="relative">
          <select
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg pl-3 pr-7 py-1.5 text-sm text-zinc-300 outline-none transition-colors cursor-pointer"
          >
            <option value="all">All visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>

        {/* Refresh */}
        <button
          onClick={() => fetchVideos(true)}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/6 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {activeTab !== "videos" ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3 py-24">
          <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center">
            <Play size={22} className="opacity-30" />
          </div>
          <p className="text-sm">This section isn't available yet</p>
        </div>
      ) : (
        <div className="flex-1 px-6 pb-10">
          <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/30">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/60 text-left">
                  <th className="pl-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="accent-blue-500 cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="py-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Video
                  </th>
                  <th className="py-3 pr-8 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                    Visibility
                  </th>
                  <th className="py-3 pr-8 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                    Date
                  </th>
                  <th className="py-3 pr-8 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                    Views
                  </th>
                  <th className="py-3 pr-8 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 whitespace-nowrap">
                    Comments
                  </th>
                  <th className="py-3 pr-4 w-8" />
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
                          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Play size={20} className="opacity-30" />
                          </div>
                          <p className="text-sm">
                            {search ? "No videos match your filter" : "No videos yet"}
                          </p>
                          {!search && (
                            <button
                              onClick={() => navigate("/upload")}
                              className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <Upload size={13} /> Upload your first video
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                  : filtered.map((video) => (
                    <VideoRow
                      key={video._id}
                      video={video}
                      selected={selected.has(video.videoId)}
                      onToggle={() => toggleOne(video.videoId)}
                      onDelete={handleDelete}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── VideoRow (separated for performance) ─────────────────────────────────────

function VideoRow({
  video,
  selected,
  onToggle,
  onDelete,
}: {
  video: StudioVideo;
  selected: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const isDraft = !video.isPublished;

  return (
    <tr
      className={`
        group border-b border-zinc-800/40 transition-colors
        ${selected ? "bg-blue-600/6" : "hover:bg-white/[0.025]"}
      `}
    >
      {/* Checkbox */}
      <td className="pl-4 py-4 w-8 align-top pt-5">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="accent-blue-500 cursor-pointer w-3.5 h-3.5"
        />
      </td>

      {/* Thumbnail + title + description */}
      <td className="py-4 pr-4 min-w-0">
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <div className="relative shrink-0 w-[120px] h-[68px] rounded-lg overflow-hidden bg-zinc-800 cursor-pointer group/thumb"
            onClick={() => navigate(`/video/${video.videoId}`)}>
            <img
              src={video.thumbnailUrl || "/thumb.jpg"}
              alt={video.title}
              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
            />
            {/* Notices overlay */}
            {isDraft && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-[10px] text-white font-semibold bg-zinc-700 px-2 py-0.5 rounded">DRAFT</span>
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 space-y-1">
            <p
              className="text-[13px] font-medium text-white leading-snug line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => navigate(`/video/${video.videoId}`)}
            >
              {video.title || "Untitled video"}
            </p>
            <p className="text-[11px] text-zinc-500 line-clamp-1">
              Add description
            </p>

            {/* Notices */}
            {video.status === "failed" && (
              <div className="flex items-center gap-1 text-red-400 text-[11px]">
                <AlertCircle size={11} /> Upload failed
              </div>
            )}

            {/* Action buttons (appear on row hover) */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
              <button
                onClick={() => navigate(`/edit/${video.videoId}`)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors"
              >
                <Edit3 size={11} /> Edit
              </button>
              <button
                onClick={() => navigate(`/video/${video.videoId}`)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors"
              >
                <Play size={11} /> Watch
              </button>
            </div>
          </div>
        </div>
      </td>

      {/* Visibility */}
      <td className="py-4 pr-8 align-top pt-5">
        <div className="flex flex-col gap-1 items-start">
          <VisibilityBadge privacy={video.privacy} />
          <StatusBadge video={video} />
        </div>
      </td>

      {/* Date */}
      <td className="py-4 pr-8 align-top pt-5 text-[12px] text-zinc-400 whitespace-nowrap">
        <div>
          <p>{fmtDate(video.createdAt)}</p>
          <p className="text-zinc-600 text-[11px]">
            {video.isPublished ? "Published" : "Draft"}
          </p>
        </div>
      </td>

      {/* Views */}
      <td className="py-4 pr-8 align-top pt-5 text-[12px] text-zinc-300 tabular-nums">
        {fmtNum(video.totalViews)}
      </td>

      {/* Comments */}
      <td className="py-4 pr-8 align-top pt-5 text-[12px] text-zinc-300 tabular-nums">
        {fmtNum(video.commentCount)}
      </td>

      {/* Action menu */}
      <td className="py-4 pr-4 align-top pt-4">
        <ActionMenu video={video} onDelete={onDelete} />
      </td>
    </tr>
  );
}
