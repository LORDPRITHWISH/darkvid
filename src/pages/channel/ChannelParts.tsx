import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDuration(sec: number): string {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function formatViews(n: number): string {
  if (!n) return "0 views";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export function formatSubs(n: number): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChannelData = {
  _id: string; username: string; name: string;
  profilepic: string; bio: string; coverimage: string;
  subscriberCount: number; subscriptionCount: number;
  isSubscribed: boolean; isOwner: boolean;
};

export type VideoItem = {
  _id: string; videoId: string; title: string;
  thumbnailUrl?: string; duration?: number;
  totalViews?: number; createdAt: string;
  privacy?: string; isPublished?: boolean;
};

export type PlaylistItem = {
  _id: string; title: string; description?: string; createdAt: string;
};

export type TweetItem = {
  _id: string; title?: string; content: string;
  featuredImage?: string; likes: number; retweets?: number;
  createdAt: string;
  originatorDetails?: { username: string; name: string; profilepic: string };
};

export type Tab = "home" | "videos" | "shorts" | "playlists" | "posts";

// ─── Video Card ───────────────────────────────────────────────────────────────

export function VideoCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden focus-visible:ring-2 focus-visible:ring-violet-500 outline-none"
      onClick={onClick} tabIndex={0} role="button"
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <div className="relative w-full aspect-video bg-white/5 rounded-lg overflow-hidden">
        <img
          src={video.thumbnailUrl || "/thumb.jpg"}
          alt={video.title || "Video"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = "/thumb.jpg"; }}
        />
        {video.duration !== undefined && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="pt-2.5 px-1">
        <p className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug mb-1">
          {video.title || "Untitled Video"}
        </p>
        <p className="text-xs text-zinc-500">
          {formatViews(video.totalViews || 0)} • {moment(video.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}

// ─── Short Card ───────────────────────────────────────────────────────────────

export function ShortCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden"
      onClick={onClick} tabIndex={0} role="button"
    >
      <div className="relative aspect-[9/16] bg-white/5 rounded-lg overflow-hidden">
        <img
          src={video.thumbnailUrl || "/thumb.jpg"} alt={video.title || "Short"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = "/thumb.jpg"; }}
        />
        {video.duration !== undefined && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-zinc-200 mt-2 px-1 line-clamp-2 leading-snug">
        {video.title || "Short"}
      </p>
      <p className="text-xs text-zinc-500 px-1">{formatViews(video.totalViews || 0)}</p>
    </div>
  );
}

// ─── Playlist Card ────────────────────────────────────────────────────────────

export function PlaylistCard({ pl }: { pl: PlaylistItem }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5">
        <div className="w-full h-full bg-gradient-to-br from-violet-950/60 to-zinc-900 rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            ▶ Play all
          </span>
        </div>
        <div className="absolute -bottom-1 left-2 right-2 h-1 bg-zinc-700 rounded-b" />
        <div className="absolute -bottom-2 left-4 right-4 h-1 bg-zinc-800 rounded-b" />
      </div>
      <p className="text-sm font-semibold text-zinc-100 line-clamp-2 mb-1">{pl.title}</p>
      {pl.description && <p className="text-xs text-zinc-500 line-clamp-1 mb-1">{pl.description}</p>}
      <p className="text-xs text-zinc-600">{moment(pl.createdAt).fromNow()}</p>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

export function PostCard({ tweet, channel }: { tweet: TweetItem; channel: ChannelData }) {
  return (
    <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 hover:border-violet-500/25 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="size-10 border-2 border-violet-500/30">
          <AvatarImage src={channel.profilepic || "/profile.jpg"} />
          <AvatarFallback>{channel.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-zinc-100">{channel.name}</p>
          <p className="text-xs text-zinc-500">{moment(tweet.createdAt).fromNow()}</p>
        </div>
      </div>
      {tweet.title && <h3 className="text-base font-bold text-zinc-50 mb-2">{tweet.title}</h3>}
      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-3">{tweet.content}</p>
      {tweet.featuredImage && (
        <img src={tweet.featuredImage} alt="post" className="w-full max-h-96 object-cover rounded-xl mb-3" />
      )}
      <div className="flex gap-2 pt-3 border-t border-white/5">
        {[["👍", String(tweet.likes || 0)], ["👎", ""], ["💬", "Reply"]].map(([icon, label], i) => (
          <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-zinc-400 text-xs hover:bg-white/[0.09] hover:text-zinc-100 transition-colors">
            <span>{icon}</span>{label && <span>{label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Skeletons ────────────────────────────────────────────────────────

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="w-full aspect-video rounded-lg mb-2" />
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500">{sub}</p>
    </div>
  );
}

// ─── Horizontal Scroll Row ────────────────────────────────────────────────────

export function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      <div className="flex gap-4 pb-2 min-w-max">{children}</div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

export function SectionHeader({ title, onSeeAll }: { title: React.ReactNode; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium flex items-center gap-1">
          See all <span className="text-lg leading-none">›</span>
        </button>
      )}
    </div>
  );
}

// ─── Image Upload Button (Banner) ─────────────────────────────────────────────

export function BannerEditButton({
  uploading, onClick,
}: { uploading: boolean; onClick: () => void }) {
  return (
    <button
      id="ch-edit-cover-btn"
      onClick={onClick}
      disabled={uploading}
      title="Change channel banner"
      className="absolute bottom-4 right-5 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white text-sm font-semibold opacity-0 translate-y-1.5 group-hover/banner:opacity-100 group-hover/banner:translate-y-0 transition-all duration-200 hover:bg-violet-600/70 hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {uploading ? <UploadSpinner /> : <><span>📷</span><span>Change banner</span></>}
    </button>
  );
}

// ─── Avatar Edit Button ───────────────────────────────────────────────────────

export function AvatarEditButton({
  uploading, onClick,
}: { uploading: boolean; onClick: () => void }) {
  return (
    <button
      id="ch-edit-avatar-btn"
      onClick={onClick}
      disabled={uploading}
      title="Change profile picture"
      className="absolute inset-0 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 border-none disabled:cursor-not-allowed"
    >
      {uploading ? <UploadSpinner /> : "📷"}
    </button>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function UploadSpinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function UploadToast({ message }: { message: string }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-300 pointer-events-none z-20">
      ✓ {message}
    </div>
  );
}

// ─── Filter Chips ─────────────────────────────────────────────────────────────

export function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
        active
          ? "bg-violet-500/15 border-violet-400/40 text-violet-300 font-medium"
          : "bg-white/[0.05] border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}
