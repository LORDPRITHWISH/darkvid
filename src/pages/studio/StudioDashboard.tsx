import { useEffect, useState } from "react";
import { getStudioDashboard } from "@/services/studio.service";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  ThumbsUp,
  Users,
  Video,
  Clock,
  TrendingUp,
  Play,
  Lock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

type DashboardData = {
  channelStats: {
    name: string;
    username: string;
    profilepic: string;
    totalVideos: number;
    totalSubscribers: number;
    totalLikes: number;
    totalViews: number;
    totalWatchTime: number;
  };
  latestVideo: {
    videoId: string;
    title: string;
    thumbnailUrl: string | null;
    uniqueViews: number;
    totalWatchTime: number;
    likes: number;
    comments: number;
    privacy: string;
    createdAt: string;
  } | null;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4 hover:border-zinc-700 transition-colors">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

const fmtTime = (secs: number) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const fmtNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export default function StudioDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudioDashboard();
        if (res?.data) setData(res.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = data?.channelStats;
  const latest = data?.latestVideo;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Channel Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Overview of your channel performance
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            icon={Users}
            label="Subscribers"
            value={fmtNum(stats?.totalSubscribers ?? 0)}
            color="bg-blue-600"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={fmtNum(stats?.totalViews ?? 0)}
            color="bg-purple-600"
          />
          <StatCard
            icon={ThumbsUp}
            label="Total Likes"
            value={fmtNum(stats?.totalLikes ?? 0)}
            color="bg-green-600"
          />
          <StatCard
            icon={Video}
            label="Videos"
            value={stats?.totalVideos ?? 0}
            color="bg-orange-600"
          />
          <StatCard
            icon={Clock}
            label="Watch Time"
            value={fmtTime(stats?.totalWatchTime ?? 0)}
            color="bg-rose-600"
          />
        </div>
      )}

      {/* Latest Video Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest video card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Latest video performance
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : latest ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden group cursor-pointer" onClick={() => navigate(`/video/${latest.videoId}`)}>
                <img
                  src={latest.thumbnailUrl ?? "/thumb.jpg"}
                  alt={latest.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white" size={40} fill="white" />
                </div>
                <div className="absolute top-2 right-2">
                  {latest.privacy === "private" ? (
                    <span className="flex items-center gap-1 bg-black/70 text-xs text-white px-2 py-0.5 rounded-full">
                      <Lock size={10} /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-black/70 text-xs text-white px-2 py-0.5 rounded-full">
                      <Globe size={10} /> Public
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
                {latest.title}
              </h3>
              <p className="text-zinc-500 text-xs">
                Published {new Date(latest.createdAt).toLocaleDateString()}
              </p>
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800">
                {[
                  { label: "Views", value: fmtNum(latest.uniqueViews) },
                  { label: "Watch Time", value: fmtTime(latest.totalWatchTime) },
                  { label: "Likes", value: fmtNum(latest.likes) },
                  { label: "Comments", value: fmtNum(latest.comments) },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-bold text-lg">{value}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
              <Video size={32} className="opacity-30" />
              <p className="text-sm">No videos yet</p>
              <button
                onClick={() => navigate("/upload")}
                className="text-xs text-blue-400 hover:underline"
              >
                Upload your first video →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: "Upload a video", path: "/upload", icon: Video },
              { label: "View all content", path: "/studio/content", icon: Film },
              { label: "Check analytics", path: "/studio/analytics", icon: TrendingUp },
              { label: "Manage comments", path: "/studio/community", icon: Eye },
              { label: "Customise channel", path: "/studio/customisation", icon: Users },
            ].map(({ label, path, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-sm font-medium text-left"
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Local Film icon since we used it inline
function Film(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
      <line x1="7" x2="7" y1="2" y2="22" />
      <line x1="17" x2="17" y1="2" y2="22" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="2" x2="7" y1="7" y2="7" />
      <line x1="2" x2="7" y1="17" y2="17" />
      <line x1="17" x2="22" y1="17" y2="17" />
      <line x1="17" x2="22" y1="7" y2="7" />
    </svg>
  );
}
