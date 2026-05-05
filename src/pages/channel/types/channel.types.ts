export type ChannelData = {
  _id: string;
  username: string;
  name: string;
  profilepic: string;
  bio: string;
  coverimage: string;
  subscriberCount: number;
  subscriptionCount: number;
  isSubscribed: boolean;
  isOwner: boolean;
};

export type VideoItem = {
  _id: string;
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
  totalViews?: number;
  createdAt: string;
  privacy?: string;
  isPublished?: boolean;
};

export type PlaylistItem = {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
};

export type TweetItem = {
  _id: string;
  title?: string;
  content: string;
  featuredImage?: string;
  likes: number;
  retweets?: number;
  createdAt: string;
  originatorDetails?: {
    username: string;
    name: string;
    profilepic: string;
  };
};

export type Tab = "home" | "videos" | "shorts" | "playlists" | "posts";

export function formatDuration(sec: number): string {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
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
