import { useEffect, useState } from "react";
import { getStudioAnalytics } from "@/services/studio.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BarChart2, Eye, Clock, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

type AnalyticsData = {
  period: number;
  totalSubscribers: number;
  overallPeriod: { totalViews: number; totalWatchTime: number };
  viewsByDay: { date: string; views: number }[];
  watchTimeByDay: { date: string; watchTime: number }[];
  subHistory: { date: string; newSubs: number }[];
  topVideos: {
    videoId: string;
    title: string;
    thumbnailUrl: string | null;
    views: number;
    watchTime: number;
  }[];
};

const PERIODS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 28 days", value: 28 },
  { label: "Last 90 days", value: 90 },
  { label: "Last year", value: 365 },
];

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

// Mini inline bar chart
const MiniBarChart = ({
  data,
  valueKey,
  color,
}: {
  data: { date: string; [key: string]: number | string }[];
  valueKey: string;
  color: string;
}) => {
  if (!data.length) return <div className="text-zinc-500 text-sm">No data</div>;
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="flex items-end gap-0.5 h-28 w-full">
      {data.map((d, i) => {
        const pct = max > 0 ? (Number(d[valueKey]) / max) * 100 : 0;
        return (
          <div
            key={i}
            title={`${d.date}: ${fmtNum(Number(d[valueKey]))}`}
            className={`flex-1 rounded-t-sm ${color} opacity-80 hover:opacity-100 transition-opacity min-h-[2px]`}
            style={{ height: `${Math.max(pct, 1)}%` }}
          />
        );
      })}
    </div>
  );
};

export default function StudioAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(28);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getStudioAnalytics(period)
      .then((res) => {
        if (res?.data) setData(res.data);
      })
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [period]);

  const totals = data?.overallPeriod;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Channel Analytics</h1>
          <p className="text-zinc-400 mt-1">
            Understand how your content is performing
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === value
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Eye,
            label: `Views (${period}d)`,
            value: loading ? null : fmtNum(totals?.totalViews ?? 0),
            color: "bg-blue-600",
          },
          {
            icon: Clock,
            label: `Watch Time (${period}d)`,
            value: loading ? null : fmtTime(totals?.totalWatchTime ?? 0),
            color: "bg-purple-600",
          },
          {
            icon: Users,
            label: "Subscribers",
            value: loading ? null : fmtNum(data?.totalSubscribers ?? 0),
            color: "bg-green-600",
          },
          {
            icon: TrendingUp,
            label: `New Subs (${period}d)`,
            value: loading
              ? null
              : fmtNum(
                  (data?.subHistory ?? []).reduce(
                    (s, x) => s + x.newSubs,
                    0
                  )
                ),
            color: "bg-orange-600",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${color} shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wide">
                {label}
              </p>
              {loading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views by day */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Views over time
            </h2>
          </div>
          {loading ? (
            <Skeleton className="h-28" />
          ) : (
            <>
              <MiniBarChart
                data={data?.viewsByDay ?? []}
                valueKey="views"
                color="bg-blue-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>{data?.viewsByDay?.[0]?.date ?? ""}</span>
                <span>
                  {data?.viewsByDay?.[data.viewsByDay.length - 1]?.date ?? ""}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Watch time by day */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Watch time (seconds)
            </h2>
          </div>
          {loading ? (
            <Skeleton className="h-28" />
          ) : (
            <>
              <MiniBarChart
                data={data?.watchTimeByDay ?? []}
                valueKey="watchTime"
                color="bg-purple-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>{data?.watchTimeByDay?.[0]?.date ?? ""}</span>
                <span>
                  {data?.watchTimeByDay?.[
                    data.watchTimeByDay.length - 1
                  ]?.date ?? ""}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Subscriber growth */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Subscriber growth
            </h2>
          </div>
          {loading ? (
            <Skeleton className="h-28" />
          ) : (
            <>
              <MiniBarChart
                data={data?.subHistory ?? []}
                valueKey="newSubs"
                color="bg-green-500"
              />
              {!data?.subHistory?.length && (
                <p className="text-zinc-500 text-sm text-center py-4">
                  No new subscribers in this period
                </p>
              )}
            </>
          )}
        </div>

        {/* Top Videos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Top content
            </h2>
            <span className="text-zinc-500 text-xs ml-auto">
              Last {period} days · Views
            </span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : data?.topVideos?.length ? (
            <div className="space-y-3">
              {data.topVideos.map((v, i) => (
                <div
                  key={v.videoId}
                  className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 rounded-lg p-2 -mx-2 transition-colors"
                  onClick={() => navigate(`/video/${v.videoId}`)}
                >
                  <span className="text-zinc-500 text-sm w-4 shrink-0">{i + 1}</span>
                  <img
                    src={v.thumbnailUrl ?? "/thumb.jpg"}
                    alt={v.title}
                    className="h-10 w-16 object-cover rounded shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {v.title}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {fmtTime(v.watchTime)} watch time
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-semibold">
                      {fmtNum(v.views)}
                    </p>
                    <p className="text-zinc-500 text-xs">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm text-center py-4">
              No view data for this period
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
